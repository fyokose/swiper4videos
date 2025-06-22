import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Parallax } from 'swiper/modules';
import 'swiper/css/bundle';
import { ContentsContainer } from './contents-container.js';


export function PreviewPane (options) {

    const instructionText = buildInstructionText();
    
    const basePane = document.createElement('div');
    basePane.classList.add('base-pane');

    const swiperContainer = document.createElement('div');
    swiperContainer.classList.add('swiper-container');
    basePane.appendChild(swiperContainer);

    const swiperWrapper = document.createElement('div');
    swiperWrapper.className = 'swiper-wrapper';
    swiperContainer.appendChild(swiperWrapper);

    document.querySelectorAll('.contents-container').forEach(container => {
        const controller = new ContentsContainer(container, {
            onClick: (src) => {
                if(onClick) {
                    onClick(controller.getSources());
                }
            }
        });
        container.classList.add('swiper-slide');
        container.style.position = 'relative';
        container.controller = controller;
        swiperWrapper.appendChild(container);
    });

    
    
    window.document.body.appendChild(basePane);

    const swiper = new Swiper(swiperContainer, {
        modules: [Navigation, Pagination, Autoplay, Parallax],
        loop: false, //ループ
        centeredSlides: true, // アクティブなスライドを中央にする
        slidesPerView: "auto",// autoにする
        spaceBetween: 120, // スライド間の距離
        autoplay: {
            delay: 10000,
        },
        speed: 2000,
        parallax:true,
    });

    const onClick = options.onClick;

    this.resume = () => {
        instructionText.resume();
        if(swiper.slides.length >= 2) {
            swiper.autoplay.start();
        }else if(swiper.slides.length === 1){
            swiper.slides[0].controller.resume();
        }
    };

    this.pause = () => {
        instructionText.pause();
        if(swiper.slides.length >= 2) {
            swiper.autoplay.stop();
        }else if(swiper.slides.length === 1){
            swiper.slides[0].controller.pause();
        }
    };

    this.currentSrc = () => {
        return swiper.slides[swiper.activeIndex].controller.currentSrc();
    };

    const resumeSlidePreview = () => {
        swiper.slides[swiper.activeIndex].controller.resume();
    }
    const pauseSlidePreview = () => {
        swiper.slides.forEach(slide => {
            slide.controller.pause();
        });
    }

    swiper.on('autoplayStart', resumeSlidePreview);
    swiper.on('slideChangeTransitionEnd', () => { if(swiper.autoplay.running) { resumeSlidePreview(); } });
    swiper.on('autoplayStop', pauseSlidePreview);
    swiper.on('slideChangeTransitionStart', pauseSlidePreview);

    swiper.autoplay.stop();
}

function buildInstructionText() {
    const textArray = [
        'タッチで再生',
        'Touch to play'
    ];
    // Create touch instruction text element
    const touchInstructionText = document.createElement('div');
    touchInstructionText.style.position = 'absolute';
    touchInstructionText.style.bottom = '5vh';
    touchInstructionText.style.left = '50%';
    touchInstructionText.style.transform = 'translateX(-50%)';
    touchInstructionText.style.color = '#aaa';
    touchInstructionText.style.fontSize = '5vw';
    touchInstructionText.style.width = '50vw';
    touchInstructionText.style.zIndex = '1000';
    touchInstructionText.style.textAlign = 'center';
    touchInstructionText.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
    touchInstructionText.style.transition = 'opacity 1s';
    touchInstructionText.style.opacity = '1';
    
    // Toggle between texts in array with fade after 3 blinks
    let currentIndex = 0;
    let blinkCount = 0;
    
    const blink = () => {
        // Fade out
        touchInstructionText.style.opacity = '0';
        
        setTimeout(() => {
            if (blinkCount < 2) {
                // Just blink same text
                touchInstructionText.style.opacity = '1';
                blinkCount++;
            } else {
                // After 3rd blink, switch text and reset count
                currentIndex = (currentIndex + 1) % textArray.length;
                touchInstructionText.textContent = textArray[currentIndex];
                touchInstructionText.style.opacity = '1';
                blinkCount = 0;
            }
        }, 1000);
    };

    // Initial text
    touchInstructionText.textContent = textArray[0];

    document.body.appendChild(touchInstructionText);

    let timer = null;
    return {
        resume: () => {
            if(timer) {
                clearInterval(timer);
                timer = null;
            }
            timer = setInterval(blink, 2000);
        },
        pause: () => {
            if(timer) {
                clearInterval(timer);
                timer = null;
            }
        }
    };
}