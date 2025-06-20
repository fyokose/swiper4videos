// import Swiper JS

import { PreviewPane } from './preview-pane.js';
import { FullscreenPane } from './fullscreen-pane.js';
import WebSocketClient from './websocket-client';
import './style.css';


addEventListener("DOMContentLoaded", () => {
    if(document.querySelectorAll('.contents-container').length === 0) {
        return;
    }

    // WebSocketClientのインスタンスを作成
    const wsClient = new WebSocketClient({
        'playVideo': (client, message, from, pageTitle, pagePath) => {
            const currentSrc = message.data.src ? message.data.src : previewPane.currentSrc();
            if(currentSrc) {
                if(currentSrc.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    fullscreenPane.showImage(currentSrc);
                } else {
                    fullscreenPane.playVideo(currentSrc);
                }
            }
        },
        'getVisibilityState': (client, message, from) => {
            console.log('可視性状態を受信:', message);
            client.send('returnVisibilityState', {'state': document.visibilityState}, from);
        }
    });
    // WebSocketClientのインスタンスをグローバル変数に格納
    window.wsClient = wsClient;

    const previewPane = new PreviewPane({
        onClick: (src) => {
            const currentSrc = previewPane.currentSrc();
            if(currentSrc) {
                if(currentSrc.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    fullscreenPane.showImage(currentSrc);
                } else {
                    fullscreenPane.playVideo(currentSrc);
                }
            }
        }
    });

    const fullscreenPane = new FullscreenPane({
        onShow: () => {
            previewPane.pause();
        },
        onClose: () => {
            previewPane.resume();
        }
    });

    
});




