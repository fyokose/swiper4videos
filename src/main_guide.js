import { Marked } from "marked";
import WebSocketClient from './websocket-client.js';
import { ButtonParser } from './button-parser.js';


export async function mainGuide() {
    const marked = new Marked();

    // クッキー操作のヘルパー関数
    function setCookie(name, value, days = 365) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // メニューバーの作成
    const menuBar = document.createElement('div');
    menuBar.style.backgroundColor = '#4CAF50'; // 緑色
    menuBar.style.width = '100%';
    menuBar.style.height = '50px';
    menuBar.style.position = 'fixed';
    menuBar.style.top = '0';
    menuBar.style.left = '0';
    menuBar.style.zIndex = '1000';
    menuBar.style.display = 'flex';
    menuBar.style.alignItems = 'center';
    menuBar.style.padding = '0 20px';

    // 文字サイズ変更ボタンの作成
    const fontSizeButtons = document.createElement('div');
    fontSizeButtons.style.display = 'flex';
    fontSizeButtons.style.gap = '10px';

    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = 'A-';
    decreaseButton.style.padding = '5px 10px';
    decreaseButton.onclick = () => changeFontSize('decrease');

    const increaseButton = document.createElement('button');
    increaseButton.textContent = 'A+';
    increaseButton.style.padding = '5px 10px';
    increaseButton.onclick = () => changeFontSize('increase');

    fontSizeButtons.appendChild(decreaseButton);
    fontSizeButtons.appendChild(increaseButton);
    menuBar.appendChild(fontSizeButtons);

    // 本文コンテナの作成
    const contentContainer = document.createElement('div');
    contentContainer.style.backgroundColor = '#F7F3E9'; // 明るいベージュ（視認性良好）
    contentContainer.style.marginTop = '50px'; // メニューバーの高さ分のマージン
    contentContainer.style.padding = '20px';
    contentContainer.style.height = 'calc(100vh - 50px)'; // minHeightからheightに変更
    contentContainer.style.overflowY = 'auto'; // scrollからautoに変更（必要時のみ表示）
    
    // 保存された文字サイズを復元
    const savedFontSize = getCookie('guideFontSize');
    if (savedFontSize) {
        contentContainer.style.fontSize = `${savedFontSize}px`;
    }

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.display = 'block';
    document.body.style.position = 'relative'; // fixedからrelativeに変更
    
    // WebSocketClientのインスタンスを作成
    window.wsClient = new WebSocketClient({
        'playVideo': (client, message, from, pageTitle, pagePath) => {
            const videosrc = swiper.slides[swiper.activeIndex].querySelector('video').src;
            startFullscreenVideo(videosrc);
        },
        'getVisibilityState': (client, message, from) => {
            console.log('可視性状態を受信:', message);
            client.send('getVisibilityState', {'state': document.visibilityState}, from);
        }
    });

    // ButtonParserのインスタンスを作成
    const buttonParser = new ButtonParser(window.wsClient);

    const src = document.body.getAttribute('src');
    const response = await fetch(src);
    const markdown = await response.text();
    console.log(markdown);
    const html = marked.parse(markdown);
    console.log(html);
    
    // コンテンツを配置
    contentContainer.innerHTML = html;
    document.body.appendChild(menuBar);
    document.body.appendChild(contentContainer);

    // buttonタグを解析してイベントリスナーを設定
    buttonParser.parseAllButtons(contentContainer);

    // プル・トゥ・リフレッシュ機能を無効化
    disablePullToRefresh();

    // 文字サイズ変更関数
    function changeFontSize(action) {
        const currentSize = parseFloat(getComputedStyle(contentContainer).fontSize);
        const newSize = action === 'increase' ? currentSize * 1.2 : currentSize * 0.8;
        contentContainer.style.fontSize = `${newSize}px`;
        
        // buttonタグの文字サイズも連動
        const buttons = contentContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.fontSize = `${newSize}px`;
        });
        
        // 文字サイズをクッキーに保存
        setCookie('guideFontSize', newSize);
    }

    /**
     * プル・トゥ・リフレッシュ機能を無効化
     */
    function disablePullToRefresh() {
        // CSSでオーバースクロールを無効化（より安全な方法）
        document.body.style.overscrollBehavior = 'none';
        document.documentElement.style.overscrollBehavior = 'none';
        
        // メタタグでビューポートを設定
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
        
        // より軽量なタッチイベント制御
        let startY = 0;
        let startTime = 0;
        
        document.addEventListener('touchstart', function(e) {
            // ボタン要素の場合は処理しない
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });

        document.addEventListener('touchmove', function(e) {
            // ボタン要素の場合は処理しない
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            
            const currentY = e.touches[0].clientY;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // ページの最上部で下方向へのスワイプのみを制御
            if (scrollTop === 0 && currentY > startY && (currentY - startY) > 50) {
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchend', function(e) {
            // ボタン要素の場合は処理しない
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // 短時間のタップは無視
            if (duration < 300) {
                return;
            }
        }, { passive: true });
    }
}