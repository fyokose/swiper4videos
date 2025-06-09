class WebSocketClient {
    client = this;
    // コンストラクタ
    constructor(handlers = {}, port = 3000, reconnectDelay = 60000) {
        const host = window.location.host.split(':')[0]; // ホスト名からポート番号を除去
        this.url = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${host}:${port}`;
        this.ws = null;
        this.isConnected = false;
        this.handlers = handlers;
        this.reconnectDelay = reconnectDelay; // デフォルト60秒
        this.connect(); // コンストラクタで接続を開始
    }

    connect() {
        try {
            this.ws = new WebSocket(this.url);

            this.ws.onopen = () => {
                console.log('WebSocket接続が確立されました');
                this.isConnected = true;
            };

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    console.log(message);
                    
                    if (!message.command) { return; }
                    if (message.toPageTitle && message.toPageTitle !== document.title) { return; }
                    if (message.toPagePath && message.toPagePath !== window.location.pathname) { return; }

                    const handler = this.handlers[message.command];
                    if (handler) {
                        handler(this.client, message, message.from, message.pageTitle, message.pagePath);
                    }
                } catch (error) {
                    console.error('メッセージの解析に失敗しました:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('WebSocket接続が切断されました');
                this.isConnected = false;
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocketエラー:', error);
            };
        } catch (error) {
            console.error('WebSocket接続エラー:', error);
            this.attemptReconnect();
        }
    }

    attemptReconnect() {
        setTimeout(() => this.connect(), this.reconnectDelay);
    }

    send(command, data = null, to = null, toPageTitle = null, toPagePath = null) {
        if (this.isConnected && this.ws && command) {
            try {
                const obj = {};
                obj.command = command;
                data && (obj.data = data);
                to && (obj.to = to);
                toPageTitle && (obj.toPageTitle = toPageTitle);
                toPagePath && (obj.toPagePath = toPagePath);
                obj.pageTitle = document.title;
                obj.pagePath = window.location.pathname;
                this.ws.send(JSON.stringify(obj));
            } catch (error) {
            }
        }
    }

    debug(command) {
        this.ws.send(JSON.stringify({ command: command, debug: true }));
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.isConnected = false;
        }
    }
}

// 使用例:
/*
const handlers = {
    'ping': (client, message, fromIP, pageTitle, pagePath) => {
        console.log('Pingを受信:', message, 'from:', fromIP, 'pageTitle:', pageTitle, 'pagePath:', pagePath);
    },
    'update': (client, message, fromIP, pageTitle, pagePath) => {
        console.log('更新メッセージを受信:', message, 'from:', fromIP, 'pageTitle:', pageTitle, 'pagePath:', pagePath);
    }
};

const wsClient = new WebSocketClient(handlers, 60000);

// メッセージの送信
wsClient.send({ command: 'ping', data: 'こんにちは' });

// 切断
// wsClient.disconnect();
*/

export default WebSocketClient;