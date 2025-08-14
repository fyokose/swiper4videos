import WebSocketClient from './websocket-client.js';

class WebSocketClientWrapper {
    constructor(port = 3000, reconnectDelay = 60000) {
        this.wsClient = new WebSocketClient(this.handleMessage.bind(this), port, reconnectDelay);
        this.commandHandlers = new Map();
        this.setupDefaultHandlers();
    }

    /**
     * デフォルトのコマンドハンドラーを設定
     */
    setupDefaultHandlers() {
        // 成功メッセージのハンドラー
        this.registerHandler('success', (message) => {
            console.log('Success:', message.message || message);
        });

        // エラーメッセージのハンドラー
        this.registerHandler('error', (message) => {
            console.error('Error:', message.message || message);
        });

        // ping/pongハンドラー
        this.registerHandler('ping', (message) => {
            console.log('Ping received from:', message.fromIP);
            this.send('pong', { timestamp: Date.now() });
        });

        this.registerHandler('pong', (message) => {
            console.log('Pong received:', message);
        });
    }

    /**
     * メッセージハンドラーを登録
     * @param {string} command - コマンド名
     * @param {Function} handler - ハンドラー関数
     */
    registerHandler(command, handler) {
        this.commandHandlers.set(command, handler);
    }

    /**
     * メッセージハンドラーを削除
     * @param {string} command - コマンド名
     */
    unregisterHandler(command) {
        this.commandHandlers.delete(command);
    }

    /**
     * 受信メッセージを処理
     * @param {Object} message - 受信メッセージ
     */
    handleMessage(message) {
        const { command } = message;
        if (!command) {
            console.warn('Received message without command:', message);
            return;
        }

        const handler = this.commandHandlers.get(command);
        if (handler) {
            try {
                handler(message);
            } catch (error) {
                console.error(`Error in handler for command '${command}':`, error);
            }
        } else {
            console.warn(`No handler registered for command '${command}':`, message);
        }
    }

    /**
     * 表示コマンドを送信
     * @param {Object} options - 表示オプション
     * @param {string} options.target - ターゲット
     * @param {string} options.content - コンテンツ
     * @param {string} options.contentType - コンテンツタイプ
     * @param {number|null} options.startTime - 開始時刻
     * @param {number|null} options.endTime - 終了時刻
     * @param {string|null} options.endAction - 終了時の動作
     * @param {string|null} to - 特定のクライアントに送信
     */
    sendDisplayCommand(options, to = null) {
        const message = {
            command: 'display',
            target: options.target,
            content: options.content,
            contentType: options.contentType,
            startTime: options.startTime,
            endTime: options.endTime,
            endAction: options.endAction
        };

        this.wsClient.send('executeCommand', message, to);
        
        let successMsg = `${options.target}に${options.content}を表示中`;
        
        // 時刻範囲の表示
        if (options.startTime !== null && options.endTime !== null) {
            successMsg += ` (${this.formatTime(options.startTime)}～${this.formatTime(options.endTime)})`;
        } else if (options.startTime !== null) {
            successMsg += ` (${this.formatTime(options.startTime)}～)`;
        }
        
        if (options.endAction === 'pause') {
            successMsg += ' (終了時一時停止)';
        }
        
        this.showSuccess(successMsg + '...');
    }

    /**
     * 停止コマンドを送信
     * @param {Object} options - 停止オプション
     * @param {string} options.target - ターゲット
     * @param {string|null} to - 特定のクライアントに送信
     */
    sendStopCommand(options, to = null) {
        const message = {
            command: 'stop',
            target: options.target
        };

        this.wsClient.send('executeCommand', message, to);
        this.showSuccess(`${options.target}を停止中...`);
    }

    /**
     * ミュートコマンドを送信
     * @param {Object} options - ミュートオプション
     * @param {string} options.target - ターゲット
     * @param {string|null} to - 特定のクライアントに送信
     */
    sendMuteCommand(options, to = null) {
        const message = {
            command: 'mute',
            target: options.target
        };

        this.wsClient.send('executeCommand', message, to);
        this.showSuccess(`${options.target}をミュート中...`);
    }

    /**
     * 汎用コマンドを送信
     * @param {string} command - コマンド名
     * @param {Object} options - オプション
     * @param {string|null} to - 特定のクライアントに送信
     * @param {boolean} isDebug - デバッグモード
     */
    send(command, options = null, to = null, isDebug = false) {
        this.wsClient.send(command, options, to, isDebug);
    }

    /**
     * デバッグコマンドを送信
     * @param {string} command - デバッグコマンド
     */
    debug(command) {
        this.wsClient.debug(command);
    }

    /**
     * 接続状態を取得
     * @returns {boolean} 接続状態
     */
    isConnected() {
        return this.wsClient.isConnected;
    }

    /**
     * 接続を切断
     */
    disconnect() {
        this.wsClient.disconnect();
    }

    /**
     * 時刻をフォーマット
     * @param {number} seconds - 秒数
     * @returns {string} フォーマットされた時刻
     */
    formatTime(seconds) {
        if (seconds === null) {
            return '';
        }
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * 成功メッセージを表示
     * @param {string} message - メッセージ
     */
    showSuccess(message) {
        // グローバルな成功メッセージ表示関数があれば使用
        if (typeof window.showSuccess === 'function') {
            window.showSuccess(message);
        } else if (typeof window.showNotification === 'function') {
            window.showNotification(message, 'success');
        } else {
            console.log('Success:', message);
        }
    }

    /**
     * エラーメッセージを表示
     * @param {string} message - メッセージ
     */
    showError(message) {
        // グローバルなエラーメッセージ表示関数があれば使用
        if (typeof window.showError === 'function') {
            window.showError(message);
        } else {
            console.error('Error:', message);
        }
    }
}

export default WebSocketClientWrapper; 