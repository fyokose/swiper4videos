/**
 * Button Parser for Markdown Guide
 * buttonタグのinnerTextを解析してWebSocket命令を生成するパーサー
 */

import WebSocketClientWrapper from './websocket-client-wrapper.js';

export class ButtonParser {
    constructor(wsClient) {
        this.wsClient = wsClient;
    }

    /**
     * buttonタグを解析してイベントリスナーを設定
     * @param {HTMLElement} button - 解析対象のbutton要素
     */
    parseButton(button) {
        const command = button.getAttribute('command');
        const originalText = button.innerText.trim();
        const width = button.getAttribute('width');
        const height = button.getAttribute('height');
        
        if (!command) {
            this.setupErrorAction(button, 'command属性が設定されていません', width, height);
            return;
        }
        
        // 最初の単語（動詞）で分岐
        const words = command.trim().split(/\s+/);
        const verb = words[0].toLowerCase();
        
        switch (verb) {
            case 'show':
                this.parseShowCommand(command, button, originalText, width, height);
                break;
            case 'stop':
                this.parseStopCommand(command, button, originalText, width, height);
                break;
            case 'mute':
                this.parseMuteCommand(command, button, originalText, width, height);
                break;
            default:
                this.setupErrorAction(button, `認識できない動詞: ${verb}`, width, height);
        }
    }

    /**
     * showコマンドを解析
     * @param {string} command - コマンド文字列
     * @param {HTMLElement} button - button要素
     * @param {string} originalText - 元のボタンテキスト
     * @param {string} width - 横幅の文字数
     * @param {string} height - 高さの文字数
     */
    parseShowCommand(command, button, originalText, width, height) {

        const parsed = {
            target: "*",
            content: null,
            startTime: null,
            endTime: null,
            endAction: null
        };

        let matches = null;

        if (matches = command.match(/^show\s+([^\s"']\S+|"[^"]*?"|'[^']*?')\s*(.*?)$/i)) {
            parsed.content = this.cleanQuotes(matches[1].trim());
            command = matches[2].trim();
        }
        if (matches = command.match(/^on\s+([^\s"']\S+|"[^"]*?"|'[^']*?')\s*(.*?)$/i)) {
            parsed.target = this.cleanQuotes(matches[1].trim());
            command = matches[2].trim();
        }
        if (matches = command.match(/^from\s+([^\s"']\S+|"[^"]*?"|'[^']*?')\s*(.*?)$/i)) {
            parsed.startTime = this.cleanQuotes(matches[1].trim());
            command = matches[2].trim();
        }
        if (matches = command.match(/^until\s+([^\s"']\S+|"[^"]*?"|'[^']*?')\s*(.*?)$/i)) {
            parsed.endTime = this.cleanQuotes(matches[1].trim());
            command = matches[2].trim();
        }
        if (matches = command.match(/^with\s+([^\s"']\S+|"[^"]*?"|'[^']*?')\s*(.*?)$/i)) {
            parsed.endAction = this.cleanQuotes(matches[1].trim());
            command = matches[2].trim();
        }

        if (command !== '') {
            this.setupErrorAction(button, `認識できないshowコマンド: ${command}`, width, height);
        }

        this.setupButtonAction(button, 'show', parsed, originalText, width, height);
    }

    /**
     * stopコマンドを解析
     * @param {string} command - コマンド文字列
     * @param {HTMLElement} button - button要素
     * @param {string} originalText - 元のボタンテキスト
     * @param {string} width - 横幅の文字数
     * @param {string} height - 高さの文字数
     */
    parseStopCommand(command, button, originalText, width, height) {
        const parsed = {
            target: "*"
        };

        let matches = null;
        if (matches = command.match(/^stop\s*(.*?)$/i)) {
            command = matches[1].trim();
        }
        if (matches = command.match(/^on\s+([^\s"']\S+|"[^"]*?"|'[^']*?')\s*(.*?)$/i)) {
            parsed.target = this.cleanQuotes(matches[1].trim());
            command = matches[2].trim();
        }
        if (command !== '') {
            this.setupErrorAction(button, `認識できないstopコマンド: ${command}`, width, height);
        }

        this.setupButtonAction(button, 'stop', parsed, originalText, width, height);
    }

    /**
     * muteコマンドを解析
     * @param {string} command - コマンド文字列
     * @param {HTMLElement} button - button要素
     * @param {string} originalText - 元のボタンテキスト
     * @param {string} width - 横幅の文字数
     * @param {string} height - 高さの文字数
     */
    parseMuteCommand(command, button, originalText, width, height) {
        const parsed = {
            target: "*"
        };

        let matches = null;
        if (matches = command.match(/^mute\s*(.*?)$/i)) {
            command = matches[1].trim();
        }
        if (matches = command.match(/^on\s+([^\s"']\S+|"[^"]*?"|'[^']*?')\s*(.*?)$/i)) {
            parsed.target = this.cleanQuotes(matches[1].trim());
            command = matches[2].trim();
        }
        if (command !== '') {
            this.setupErrorAction(button, `認識できないmuteコマンド: ${command}`, width, height);
        }

        this.setupButtonAction(button, 'mute', parsed, originalText, width, height);
    }

    /**
     * ボタンのアクションを設定
     * @param {HTMLElement} button - button要素
     * @param {string} actionType - アクションタイプ
     * @param {Object} parsed - 解析結果
     * @param {string} originalText - 元のボタンテキスト
     * @param {string} width - 横幅の文字数
     * @param {string} height - 高さの文字数
     */
    setupButtonAction(button, command, options, originalText, width, height) {
        // ボタンテキストが空の場合は自動生成
        if (!originalText) {
            button.innerText = this.generateButtonText(command, options);
        }

        // サイズ属性を適用
        this.applyButtonSize(button, width, height);

        button.onclick = () => {
            try {
                switch (command) {
                    case 'show':
                        // コンテンツタイプを判定
                        const contentType = this.determineContentType(options.content);
                        this.wsClient.sendDisplayCommand({
                            target: options.target,
                            content: options.content,
                            contentType: contentType,
                            startTime: options.startTime ? this.parseTime(options.startTime) : null,
                            endTime: options.endTime ? this.parseTime(options.endTime) : null,
                            endAction: options.endAction
                        });
                        break;
                    case 'stop':
                        this.wsClient.sendStopCommand({
                            target: options.target
                        });
                        break;
                    case 'mute':
                        this.wsClient.sendMuteCommand({
                            target: options.target
                        });
                        break;
                    default:
                        this.wsClient.send(command, options);
                }
            } catch (error) {
                console.error('Button action error:', error);
                this.showError(`コマンド実行エラー: ${error.message}`);
            }
        };

        // ボタンのスタイルを設定
        button.style.cursor = 'pointer';
        button.style.padding = '8px 16px';
        button.style.margin = '4px';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '4px';
        button.style.backgroundColor = '#f0f0f0';
        // フォントサイズは親要素から継承（文字サイズ変更機能と連動）
        button.style.fontSize = 'inherit';
    }

    /**
     * ボタンのサイズを文字数基準で設定
     * @param {HTMLElement} button - 対象のbutton要素
     * @param {string} width - 横幅の文字数（例: "10"）
     * @param {string} height - 高さの文字数（例: "2"）
     */
    applyButtonSize(button, width, height) {
        if (width) {
            const widthChars = parseInt(width);
            if (!isNaN(widthChars) && widthChars > 0) {
                // 1文字あたりの幅を推定（フォントサイズに基づく）
                const fontSize = parseFloat(getComputedStyle(button).fontSize);
                const charWidth = fontSize * 3.0; // 概算値
                button.style.width = `${widthChars * charWidth}px`;
                button.style.minWidth = `${widthChars * charWidth}px`;
                
                // テキストがはみ出した場合の処理
                button.style.overflow = 'hidden';
                button.style.textOverflow = 'ellipsis';
                button.style.whiteSpace = 'nowrap';
            }
        }
        
        if (height) {
            const heightChars = parseInt(height);
            if (!isNaN(heightChars) && heightChars > 0) {
                // 1文字あたりの高さを推定（フォントサイズに基づく）
                const fontSize = parseFloat(getComputedStyle(button).fontSize);
                const lineHeight = fontSize * 3.0; // 概算値
                button.style.height = `${heightChars * lineHeight}px`;
                button.style.minHeight = `${heightChars * lineHeight}px`;
                
                // 高さが1行の場合はテキストを省略表示
                if (heightChars === 1) {
                    button.style.overflow = 'hidden';
                    button.style.textOverflow = 'ellipsis';
                    button.style.whiteSpace = 'nowrap';
                } else {
                    // 複数行の場合は折り返し表示
                    button.style.overflow = 'hidden';
                    button.style.whiteSpace = 'normal';
                    button.style.wordWrap = 'break-word';
                    button.style.display = 'flex';
                    button.style.alignItems = 'center';
                    button.style.justifyContent = 'center';
                }
            }
        }
    }

    /**
     * エラーアクションを設定
     * @param {HTMLElement} button - button要素
     * @param {string} errorMessage - エラーメッセージ
     * @param {string} width - 横幅の文字数
     * @param {string} height - 高さの文字数
     */
    setupErrorAction(button, errorMessage, width, height) {
        button.onclick = () => {
            console.warn('Button command error:', errorMessage);
            this.showError(errorMessage);
        };

        button.innerText = errorMessage;
        
        // エラー用のスタイル
        button.style.backgroundColor = '#ffebee';
        button.style.borderColor = '#f44336';
        button.style.color = '#d32f2f';
        button.style.cursor = 'not-allowed';
        button.style.padding = '8px 16px';
        button.style.margin = '4px';
        button.style.borderRadius = '4px';
        // フォントサイズは親要素から継承（文字サイズ変更機能と連動）
        button.style.fontSize = 'inherit';
        
        // サイズ属性を適用
        this.applyButtonSize(button, width, height);
    }

    /**
     * クォートを除去
     * @param {string} text - 対象文字列
     * @returns {string} クォート除去後の文字列
     */
    cleanQuotes(text) {
        return text.replace(/^["']|["']$/g, '');
    }

    /**
     * 時刻を秒数に変換
     * @param {string} timeStr - 時刻文字列 (HH:MM または MM:SS)
     * @returns {number} 秒数
     */
    parseTime(timeStr) {
        const parts = timeStr.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0]);
            const seconds = parseInt(parts[1]);
            return minutes * 60 + seconds;
        }
        return 0;
    }

    /**
     * 秒数を時刻文字列に変換
     * @param {number} seconds - 秒数
     * @returns {string} 時刻文字列 (MM:SS)
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
     * コンテンツタイプを判定
     * @param {string} content - コンテンツ名
     * @returns {string} コンテンツタイプ ('video' または 'image')
     */
    determineContentType(content) {
        if (!content) return 'video';
        
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
        const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
        
        const lowerContent = content.toLowerCase();
        
        // 拡張子で判定
        for (const ext of imageExtensions) {
            if (lowerContent.endsWith(ext)) {
                return 'image';
            }
        }
        
        for (const ext of videoExtensions) {
            if (lowerContent.endsWith(ext)) {
                return 'video';
            }
        }
        
        // 拡張子がない場合は、コンテンツ名に含まれるキーワードで判定
        if (lowerContent.includes('image') || lowerContent.includes('img') || lowerContent.includes('picture')) {
            return 'image';
        }
        
        // デフォルトは動画
        return 'video';
    }

    /**
     * ボタンテキストを自動生成
     * @param {string} actionType - アクションタイプ
     * @param {Object} parsed - 解析結果
     * @returns {string} 生成されたボタンテキスト
     */
    generateButtonText(actionType, parsed) {
        switch (actionType) {
            case 'show':
                let text = `${parsed.target}に${parsed.content}を表示`;
                
                // 時刻範囲の表示
                if (parsed.startTime !== null || parsed.endTime !== null) {
                    text += ` (${this.formatTime(parsed.startTime)}～${this.formatTime(parsed.endTime)})`;
                }
                
                if (parsed.endAction === 'pause') {
                    text += ' (終了時一時停止)';
                }
                return text;
            case 'stop':
                return `${parsed.target}を停止`;
            case 'mute':
                return `${parsed.target}をミュート`;
            default:
                return `${parsed.target}に${parsed.content}を送信`;
        }
    }

    /**
     * 成功メッセージを表示
     * @param {string} message - メッセージ
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    /**
     * エラーメッセージを表示
     * @param {string} message - メッセージ
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * 通知を表示
     * @param {string} message - メッセージ
     * @param {string} type - タイプ（success/error）
     */
    showNotification(message, type) {
        // 既存の通知を削除
        const existing = document.querySelector('.button-notification');
        if (existing) {
            existing.remove();
        }

        // 現在の文字サイズを取得
        const currentFontSize = this.getCurrentFontSize();

        const notification = document.createElement('div');
        notification.className = `button-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            padding: 10px 15px;
            border-radius: 4px;
            color: white;
            font-size: ${currentFontSize}px;
            z-index: 1001;
            max-width: 300px;
            word-wrap: break-word;
            ${type === 'success' ? 'background-color: #4caf50;' : 'background-color: #f44336;'}
        `;

        document.body.appendChild(notification);

        // 3秒後に自動削除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    /**
     * 現在の文字サイズを取得
     * @returns {number} 現在の文字サイズ（px）
     */
    getCurrentFontSize() {
        const contentContainer = document.querySelector('div[style*="background-color: rgb(247, 243, 233)"]');
        if (contentContainer) {
            return parseFloat(getComputedStyle(contentContainer).fontSize);
        }
        return 16; // デフォルトサイズ
    }

    /**
     * ページ内のすべてのbuttonタグを解析
     * @param {HTMLElement} container - 解析対象のコンテナ
     */
    parseAllButtons(container) {
        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
            this.parseButton(button);
        });
    }
} 