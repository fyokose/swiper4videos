class WebSocketClient {
    client = this;
    // コンストラクタ
    constructor(onmessage = null, port = 3000, reconnectDelay = 60000) {
        const host = window.location.protocol === 'file:' ? 'localhost' : window.location.host.split(':')[0]; // fileプロトコルの場合はlocalhost
        this.url = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${host}:${port}`;
        this.ws = null;
        this.isConnected = false;
        this.onmessage = typeof onmessage === 'function' ? onmessage : () => {};
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
                    if (!message.command) { return; }
                    this.onmessage(message);
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

    /**
     * WebSocketサーバーにメッセージを送信
     * @param {string} command - 送信するコマンド
     * @param {Object|null} options - コマンドのオプション
     * @param {string|null} to - 送信先のクライアントID (特定のクライアントにのみ送信する場合)
     * @param {boolean} isDebug - デバッグモードで送信するかどうか
     */
    send(command, options = null, to = null, isDebug = false) {
        if (this.isConnected && this.ws && command) {
            try {
                const obj = {};
                obj.command = command;
                obj.options = typeof options === 'object' && options !== null ? options : {};
                to && (obj.to = to);
                isDebug && (obj.debug = true);
                this.ws.send(JSON.stringify(obj));
            } catch (error) {
            }
        }
    }

    debug(command) {
        this.ws.send(command, null, null, true);
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