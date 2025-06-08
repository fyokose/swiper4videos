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

const wss = new WebSocket.Server({ server });
const clients = new Set();

// WebSocket接続の処理
wss.on('connection', (ws) => {
    console.log('接続');
    clients.add(ws);

    // メッセージ受信時の処理
    ws.on('message', (message) => {
        console.log(message);
        let jsonMessage;
        try {
            jsonMessage = JSON.parse(message.toString());
            
            // IPアドレスを追加
            const ip = ws._socket.remoteAddress;
            jsonMessage.from = ip;

            // toIPが指定されている場合は特定のクライアントのみに送信
            // 指定がない場合は全クライアントにブロードキャスト
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    if (!jsonMessage.to || client._socket.remoteAddress === jsonMessage.to) {
                        client.send(JSON.stringify(jsonMessage));
                    }
                }
            });
        } catch (error) {
            return;
        }
    });

    // 接続が切れた時の処理
    ws.on('close', () => {
        clients.delete(ws);
    });
});

// サーバーの起動
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});