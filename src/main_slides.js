import 'swiper/css/bundle';
import Swiper from 'swiper';


export function mainSlides() {
    const swiperContainer = document.createElement('div');
    swiperContainer.classList.add('swiper-container');
    document.body.appendChild(swiperContainer);

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');
    swiperContainer.appendChild(swiperWrapper);

    // Get all images from body and add them as slides
    const images = document.body.querySelectorAll('img');
    images.forEach(img => {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');
        slide.appendChild(img);
        swiperWrapper.appendChild(slide);
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
    scrollbar.style.display = 'none'; // 初期状態で非表示
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

    // スクロールバーのドラッグ部分を青色に
    const scrollbarDrag = swiperContainer.querySelector('.swiper-scrollbar-drag');
    if (scrollbarDrag) {
        scrollbarDrag.style.backgroundColor = '#aaa';
        scrollbarDrag.style.height = '100%'; // ドラッグ部分の高さを100%に
    }

    let timer = null;
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
    });
    swiper.on('touchEnd', function() {
        timer = setTimeout(() => {
            swiper.autoplay.start();
            // オートプレイ再開時にナビゲーションとスクロールバーを非表示
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
            scrollbar.style.display = 'none';
            timer = null;
        }, 60*1000);
    });
}