import { PreviewPane } from './preview-pane.js';
import { FullscreenPane } from './fullscreen-pane.js';
import WebSocketClient from './websocket-client';
import './style.css';


export function mainPlayer() {
    // WebSocketClientのインスタンスを作成
    const wsClient = new WebSocketClient(
        (msg) => {
            if (msg.command === "playVideo") {
                const currentSrc = msg.options?.src ? msg.options.src : previewPane.currentSrc();
                if(currentSrc) {
                    fullscreenPane.show(currentSrc);
                }
            } else if (msg.command === 'getVisibilityState') {
                client.send('returnVisibilityState', {'state': document.visibilityState});
            }
        }
    );
    // WebSocketClientのインスタンスをグローバル変数に格納
    window.wsClient = wsClient;

    const previewPane = new PreviewPane({
        onClick: (sorces) => {
            fullscreenPane.show(sorces);
        }
    });

    const langs = previewPane.getLanguages();
    const videoUISettings = {isOn: false};

    const fullscreenPane = new FullscreenPane({
        onShow: () => {
            previewPane.pause();
        },
        onClose: () => {
            previewPane.resume();
        },
        onInitialClose: () => {
            previewPane.getLanguages().forEach(lang => {
                    if(langs.indexOf(lang) === -1) {
                    previewPane.deleteContentsByLanguage(lang);
                }
            });
            if(videoUISettings.isOn) {
                fullscreenPane.setVideoUIEnabled(true);
            }
        }
    }, langs.length <= 1 ? null : langs, videoUISettings);
    
}
