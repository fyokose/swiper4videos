const WebSocket = require('ws');
const https = require('https');
const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// TLSを使用するかどうかの設定
const useTLS = process.env.USE_TLS === 'true';

let server;
if (useTLS) {
    // SSL証明書の設定
    const options = {
        key: fs.readFileSync(path.join(__dirname, 'private-key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'certificate.pem'))
    };
    server = https.createServer(options, app);
} else {
    server = http.createServer(app);
}

const wsServer = new WebSocket.Server({ server });

// WebSocket接続の処理
wsServer.on('connection', (ws) => {

    // メッセージ受信時の処理
    ws.on('message', (message) => {

        try {
            const msgObj = JSON.parse(message.toString());
            //console.log(msgObj);

            // デバッグモードの場合、デバッグ関数を呼び出して処理を終了
            if (msgObj.debug === true) {
                ws.send(JSON.stringify(debug(msgObj)));
                return;
            }
            
            // 送信元情報を追加
            msgObj.from = `${ws._socket.remoteAddress}:${ws._socket.remotePort}`;

            // toが指定されている場合は特定のクライアントのみに送信
            // 指定がない場合は全クライアントにブロードキャスト
            const messageStr = JSON.stringify(msgObj);
            wsServer.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    if (!msgObj.to || `${client._socket.remoteAddress}:${client._socket.remotePort}` === msgObj.to) {
                        client.send(messageStr);
                    }
                }
            });
        } catch (error) {
            return;
        }
    });

    // 接続が切れた時の処理
    ws.on('close', () => {
    });
});

// サーバーの起動
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

function debug(msgObj) {
    if ( msgObj.command.toLowerCase() === 'memoryusage') {
        msgObj.memoryUsage = process.memoryUsage();
    } else if (msgObj.command.toLowerCase() === 'cpuusage') {
        msgObj.cpuUsage = process.cpuUsage();
    } else if (msgObj.command.toLowerCase() === 'uptime') {
        msgObj.uptime = process.uptime();
    } else if (msgObj.command.toLowerCase() === 'websocketclients') {
        msgObj.websocketClients = Array.from(wsServer.clients).map(client => {
            return {
                ip: client._socket.remoteAddress,
                port: client._socket.remotePort,
                id: `${client._socket.remoteAddress}:${client._socket.remotePort}`,
                readyState: client.readyState
            };
        });
    }
    return msgObj;
}
