import 'swiper/css/bundle';
import Swiper from 'swiper';


export function mainSlides() {
    const swiperContainer = document.createElement('div');
    swiperContainer.classList.add('swiper-container');
    document.body.appendChild(swiperContainer);

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');
    swiperContainer.appendChild(swiperWrapper);

    // Get all images and videos from body and add them as slides
    Array.from(document.body.children).forEach(element => {
        if(element.tagName === 'IMG' || element.tagName === 'VIDEO') {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            slide.appendChild(element);
            swiperWrapper.appendChild(slide);

            if(element.tagName === 'VIDEO') {
                element.controls = true; // 動画再生UIを表示
                element.classList.add('slides-video');
                element.muted = true;
                element.loop = true;
                element.preload = 'auto';
                element.pause(); // 初期状態では停止
            }
        }
    });

    // Add navigation buttons
    const prevButton = document.createElement('div');
    prevButton.classList.add('swiper-button-prev');
    prevButton.style.color = '#aaa';
    prevButton.style.display = 'none'; // 初期状態で非表示
    swiperContainer.appendChild(prevButton);

    const nextButton = document.createElement('div');
    nextButton.classList.add('swiper-button-next'); 
    nextButton.style.color = '#aaa';
    nextButton.style.display = 'none'; // 初期状態で非表示
    swiperContainer.appendChild(nextButton);

    // Add scrollbar
    const scrollbar = document.createElement('div');
    scrollbar.classList.add('swiper-scrollbar');
    scrollbar.style.backgroundColor = 'rgba(170, 170, 170, 0.1)';
    scrollbar.style.height = '10px'; // スクロールバーの高さを10pxに設定
    scrollbar.style.display = 'none'; // 初期状態で非表示
    scrollbar.style.top = '5px'; // 上部に配置
    scrollbar.style.bottom = 'auto'; // デフォルトの下部配置を解除
    swiperContainer.appendChild(scrollbar);

    // Initialize Swiper
    const swiper = new Swiper(swiperContainer, {
        loop: false,
        centeredSlides: true,
        slidesPerView: "auto",
        spaceBetween: 30,
        autoplay: {
            delay: 5000,
            disableOnInteraction: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
            dragClass: 'swiper-scrollbar-drag',
            hide: false // スクロールバーを常に表示
        },
    });

    const scrollbarDrag = swiperContainer.querySelector('.swiper-scrollbar-drag');
    if (scrollbarDrag) {
        scrollbarDrag.style.backgroundColor = '#aaa';
        scrollbarDrag.style.height = '100%'; // ドラッグ部分の高さを100%に
    }

    let timer = null;

    // スライド切り替え時の処理を追加
    swiper.on('slideChange', function() {
        const activeSlide = swiper.slides[swiper.activeIndex];
        const activeVideo = activeSlide.querySelector('video');
        document.querySelectorAll('video').forEach(video => {
            if(video === activeVideo) {
                video.play();
            } else {
                video.pause();
            }
        });
    });

    swiper.on('touchStart', function() {
        if(timer) {
            clearTimeout(timer);
            timer = null;
        }
        swiper.autoplay.stop();
        // タッチ時にナビゲーションとスクロールバーを表示
        prevButton.style.display = 'block';
        nextButton.style.display = 'block';
        scrollbar.style.display = 'block';

        document.querySelectorAll('video').forEach(video => {
            video.muted = false;
            video.loop = false;
        });
    });

    swiper.on('touchEnd', function() {
        let delay = 60*1000; // Default delay
        const activeSlide = swiper.slides[swiper.activeIndex];
        const activeVideo = activeSlide.querySelector('video');
        if (activeVideo && !activeVideo.paused) {
            delay = ((activeVideo.duration - activeVideo.currentTime) * 1000) + 30000;
        }

        timer = setTimeout(() => {
            swiper.autoplay.start();
            // オートプレイ再開時にナビゲーションとスクロールバーを非表示
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
            scrollbar.style.display = 'none';
            timer = null;

            document.querySelectorAll('video').forEach(video => {
                video.muted = true;
                video.loop = true;
            });

            // autoplay再開時に現在のスライドが動画なら再生
            const activeSlide = swiper.slides[swiper.activeIndex];
            const video = activeSlide.querySelector('video');
            if(video) {
                video.play();
            }
        }, delay);
    });
}

/*
function buildInstructionText(basePane) {
    const textArray = [
        'スワイプでお好きなスライドをご覧ください',
        'Swipe to browse slides'
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

    basePane.appendChild(touchInstructionText);

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
*/
