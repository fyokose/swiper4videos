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
    clients.add(ws);

    // メッセージ受信時の処理
    ws.on('message', (message) => {
        let jsonMessage;
        try {
            jsonMessage = JSON.parse(message.toString());
            
            // IPアドレスを追加
            const ip = ws._socket.remoteAddress;
            jsonMessage.fromIP = ip;

            // toIPが指定されている場合は特定のクライアントのみに送信
            // 指定がない場合は全クライアントにブロードキャスト
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    if (!jsonMessage.toIP || client._socket.remoteAddress === jsonMessage.toIP) {
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