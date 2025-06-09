// import Swiper JS
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Parallax } from 'swiper/modules';
// import Swiper styles
import 'swiper/css';
import './style.css';
import WebSocketClient from './websocket-client';


addEventListener("DOMContentLoaded", () => {

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


    window.document.body.style.backgroundColor = "black";

    
    // フルスクリーン動画レイヤーの作成
    const fullscreenLayer = document.createElement('div');
    fullscreenLayer.style.position = 'fixed';
    fullscreenLayer.style.top = '0';
    fullscreenLayer.style.left = '0';
    fullscreenLayer.style.width = '100%';
    fullscreenLayer.style.height = '100%';
    fullscreenLayer.style.backgroundColor = 'black';
    fullscreenLayer.style.display = 'none';
    fullscreenLayer.style.zIndex = '9999';

    const fullscreenVideo = document.createElement('video');
    fullscreenVideo.style.width = '100%';
    fullscreenVideo.style.height = '100%';
    fullscreenVideo.style.objectFit = 'contain';
    fullscreenVideo.preload = 'auto';
    fullscreenVideo.muted = true;
    fullscreenLayer.appendChild(fullscreenVideo);

    const closeFullscreen = () => {
        fullscreenVideo.pause();
        fullscreenLayer.style.display = 'none';
        swiper.autoplay.resume();
    };

    // フルスクリーンレイヤーのクリックで閉じる
    fullscreenLayer.addEventListener('click', closeFullscreen);

    // ビデオ終了時にも同じ処理を実行
    fullscreenVideo.addEventListener('ended', closeFullscreen);

    const swiperContainer = document.createElement('div');
    swiperContainer.className = 'swiper';
    window.document.body.appendChild(swiperContainer);

    const swiperWrapper = document.createElement('div');
    swiperWrapper.className = 'swiper-wrapper';
    swiperContainer.appendChild(swiperWrapper);

    document.querySelectorAll('.video-container').forEach(container => {
        container.className = 'swiper-slide';
        container.style.width = 640;
        container.style.height = 360;
        container.style.position = 'relative'; // Add position relative for overlay positioning
        swiperWrapper.appendChild(container);

        // Create video element
        const video = container.querySelector('video');
        video.style.width = '100%';
        video.style.display = 'block';
        video.preload = 'auto';
        video.muted = true;
        video.autoplay = true;
        video.playsInline = true;
        video.loop = true;
        video.pause();
        // Add video to slide div
        container.appendChild(video);

        // Add semi-transparent overlay
        // Create overlay for background dimming
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(1, 1, 1, 0.5)'; // 50% transparent black
        container.appendChild(overlay);

        // Create title with parallax effect
        const title = container.querySelector('.video-title');
        if (title) {
            title.style.position = 'absolute';
            title.style.width = '100%';
            title.style.top = '50%';
            title.style.color = '#fff';
            title.style.fontSize = '24px';
            title.setAttribute('data-swiper-parallax-opacity', '0.5'); // Add parallax attribute
            container.appendChild(title);
        }

        // Add click detection layer
        const clickLayer = document.createElement('div');
        clickLayer.style.position = 'absolute';
        clickLayer.style.top = '0';
        clickLayer.style.left = '0';
        clickLayer.style.width = '100%';
        clickLayer.style.height = '100%';
        clickLayer.style.cursor = 'pointer';
        clickLayer.style.backgroundColor = 'transparent'; // Make fully transparent
        
        clickLayer.addEventListener('click', () => {
            startFullscreenVideo(video.src);
        });
        
        container.appendChild(clickLayer);

        document.body.appendChild(fullscreenLayer);
    });

    
    const swiper = new Swiper('.swiper', {
        modules: [Navigation, Pagination, Autoplay, Parallax],
        loop: false, //ループ
        centeredSlides: true, // アクティブなスライドを中央にする
        slidesPerView: "auto",// autoにする
        spaceBetween: 120, // スライド間の距離
        autoplay: {
            delay: 5000,
        },
        speed: 2000,
        parallax:true,
        on: {
            slideChangeTransitionStart: pauseVideoPreview,
            autoplayPause: pauseVideoPreview,
            afterInit: resumeVideoPreview,
            slideChangeTransitionEnd: resumeVideoPreview,
            autoplayResume: resumeVideoPreview
        },
    });


    const updateSwiperPosition = () => {
        document.querySelector('.swiper').style.transform = `translateY(${Math.floor(-(window.screenY + window.outerHeight - window.innerHeight)/ 2)}px)`;
    };
    updateSwiperPosition();
    window.addEventListener('resize', updateSwiperPosition);

    /*
    swiper.onAny((p1,p2,p3) => {
        if(p1 !== 'autoplayTimeLeft') {
            console.log(p1,p3);
        }
    });
    */

    function startFullscreenVideo(src) {
        fullscreenVideo.src = src;
        fullscreenVideo.muted = false;
        fullscreenLayer.style.display = 'block';
        fullscreenVideo.play();

        swiper.autoplay.pause();
    }

    function resumeVideoPreview(swiper) {
        const video = swiper.slides[swiper.activeIndex].querySelector('video');
        video.muted = true;
        video.play();
    };

    function pauseVideoPreview(swiper) {
        swiper.slides.forEach(slide => {
            const video = slide.querySelector('video');
            video.pause();
            video.muted = true;
        });
    };
    

});




