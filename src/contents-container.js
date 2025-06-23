import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

export function ContentsContainer(rootElement, options) {

    const sorces = [];
    const contentsCount = rootElement.querySelectorAll('video, img').length;

    const lang = rootElement.getAttribute('lang');

    if(contentsCount === 0) {
        return;
    } else if(contentsCount === 1) {
        const element = rootElement.querySelector('video, img');
        if(element && element.tagName === 'VIDEO') {
            rootElement.appendChild(initVideoPreview(element));
            sorces.push({src: element.src, type: 'video'});
        } else if(element && element.tagName === 'IMG') {
            rootElement.appendChild(initImage(element));
            sorces.push({src: element.src, type: 'image', time: parseTimeAttribute(element)});
        }
    } else {
        const swiperContainer = document.createElement('div');
        swiperContainer.classList.add('swiper-container');
        rootElement.appendChild(swiperContainer);

        const swiperWrapper = document.createElement('div');
        swiperWrapper.classList.add('swiper-wrapper');
        swiperContainer.appendChild(swiperWrapper);

        const contents = rootElement.querySelectorAll('video, img');
        contents.forEach(content => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            if(content.tagName === 'VIDEO') {
                initVideo(content);
                sorces.push({src: content.src, type: 'video'});
            } else if(content.tagName === 'IMG') {
                initImage(content);
                sorces.push({src: content.src, type: 'image', time: parseTimeAttribute(content)});
            }
            slide.appendChild(content);
            swiperWrapper.appendChild(slide);
        });

        this.swiper = new Swiper(swiperContainer, {
            effect: 'fade',
            loop: true,
            autoplay: {
                delay: 3000,
            },
            allowTouchMove: false, // ユーザのタッチ操作を無効化
            keyboard: {
                enabled: false // キーボード操作を無効化
            },
            mousewheel: {
                enabled: false // マウスホイール操作を無効化
            }
        });
        const swiper = this.swiper;
        swiper.autoplay.stop();

        const resumeSlidePreview = () => {
            const video = swiper.slides[swiper.activeIndex].querySelector('video');
            if(video) {
                video.play();
            }
        }
        const pauseSlidePreview = () => {
            rootElement.querySelectorAll('video').forEach(video => {
                video.pause();
            });
        }

        swiper.on('autoplayStart', resumeSlidePreview);
        swiper.on('slideChangeTransitionEnd', () => { if(swiper.autoplay.running) { resumeSlidePreview(); } });
        swiper.on('slideChangeTransitionStart', pauseSlidePreview);

    }

    const swiper = this.swiper;

    // Add semi-transparent overlay
    // Create overlay for background dimming
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(1, 1, 1, 0.5)'; // 50% transparent black
    overlay.style.zIndex = '100'; // スライドより上、タイトルより下
    rootElement.appendChild(overlay);

    // Create title with parallax effect
    const title = rootElement.querySelector('.container-title');
    if(title) {
        initTitle(title);
        rootElement.appendChild(title);
    }

    if(options) {
        const onClick = options.onClick;
        rootElement.addEventListener('click', (event) => {
            event.stopPropagation();
            if (onClick) {
                onClick(sorces);
            }
        }, false);
    }

    this.resume = () => {
        if(swiper) {
            swiper.autoplay.start();
            return;
        }

        const previewer = rootElement.querySelector('.video-previewer');
        if(previewer) {
            playVideoIntervalPreview(previewer);
        }
    }

    this.pause = () => {
        stopVideoIntervalPreview();

        if(swiper) {
            swiper.autoplay.stop();
        }

        rootElement.querySelectorAll('video').forEach(video => {
            video.pause();
        });
    }

    this.getSources = () => {
        return sorces;
    }

    let intervalPreviewHandle = null;
    let intervalpreviewer = null;
    let inPreview = false;
    
    function playVideoIntervalPreview(previewer) {
        inPreview = true;
        intervalpreviewer = previewer;

        
        const videos = previewer.querySelectorAll('video');
        if (videos.length !== 2) return;

        let currentVideo = videos[0];
        let nextVideo = videos[1];
        
        // Set initial state
        currentVideo.style.opacity = '1';
        nextVideo.style.opacity = '0';
        currentVideo.style.transition = 'opacity 1s ease-in-out';
        nextVideo.style.transition = 'opacity 1s ease-in-out';
        
        const switchVideos = () => {
            // Prepare next video
            nextVideo.currentTime = currentVideo.currentTime + 10;
            if (nextVideo.currentTime > nextVideo.duration - 0.1) {
                nextVideo.currentTime = nextVideo.currentTime - (nextVideo.duration - 0.1);
            }
            
            // Start playing next video before fade
            nextVideo.play();
            
            // Fade transition
            currentVideo.style.opacity = '0';
            nextVideo.style.opacity = '1';
            
            // After transition completes
            if(!inPreview) return;
            intervalPreviewHandle = setTimeout(() => {
                currentVideo.pause();
                
                // Swap references
                const temp = currentVideo;
                currentVideo = nextVideo;
                nextVideo = temp;
                
                // Schedule next switch
                if(!inPreview) return;
                intervalPreviewHandle = setTimeout(switchVideos, 4000);
            }, 1000);
        };

        // Start first video
        currentVideo.play();
        switchVideos();
    }

    function stopVideoIntervalPreview() {
        inPreview = false;
        if (intervalpreviewer) {
            intervalpreviewer.querySelectorAll('video').forEach(video => {
                video.pause();
            });
        }
        if (intervalPreviewHandle) {
            clearTimeout(intervalPreviewHandle);
            intervalPreviewHandle = null;
        }
        intervalpreviewer = null;
    }

}


function initVideo(element) {
    if (!element) return;
    element.style.width = '100%';
    element.style.display = 'block';
    element.preload = 'auto';
    element.muted = true;
    element.autoplay = false;
    element.playsInline = true;
    element.loop = true;
    element.pause();
    return element;
}

function initVideoPreview(element) {
    if (!element) return;
    const clonedElement = element.cloneNode(true);
    initVideo(element);
    initVideo(clonedElement);

    const container = document.createElement('div');
    container.classList.add('video-previewer');
    container.appendChild(element);
    container.appendChild(clonedElement);
    return container;
}

function initImage(element) {
    if (!element) return;
}

function initTitle(element) {
    if (!element) return;
    element.style.position = 'absolute';
    element.style.width = '100%';
    element.style.top = '50%';
    element.style.color = '#fff';
    element.style.fontSize = '24px';
    element.setAttribute('data-swiper-parallax-opacity', '0.5'); // Add parallax attribute
}

function parseTimeAttribute(element) {
    if (element) {
        const time = element.getAttribute('time');
        if(time) {
            return Math.round(parseFloat(time) * 1000);
        }
    }
    return null;
}
