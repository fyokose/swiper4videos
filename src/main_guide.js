import { Marked } from "marked";
import WebSocketClient from './websocket-client.js';


export async function mainGuide() {
    const marked = new Marked();

    document.documentElement.style.backgroundColor = "white";
    document.body.style.display = "inherit";
    
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

    
    const response = await fetch("sample_guide.md");
    const markdown = await response.text();
    console.log(markdown);
    const html = marked.parse(markdown);
    console.log(html);
    document.body.innerHTML = html;
}