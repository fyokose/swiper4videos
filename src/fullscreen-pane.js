export function FullscreenPane (options) {
                
    // フルスクリーン動画レイヤーの作成
    const basePane = document.createElement('div');
    basePane.classList.add('base-pane');
    basePane.style.zIndex = '9999';
    basePane.style.opacity = '1';
    basePane.style.transition = 'opacity 0.5s ease-in-out';
    document.body.appendChild(basePane);

    const wrapper = document.createElement('div');
    wrapper.classList.add('fullscreen-wrapper');
    basePane.appendChild(wrapper);

    const text = document.createElement('div');
    text.style.backgroundColor = 'black';
    text.style.color = 'white';
    text.innerText = 'タッチしてシステムスタート';
    text.style.fontSize = '100px';
    wrapper.appendChild(text);

    const img = document.createElement('img');
    wrapper.appendChild(img);

    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    wrapper.appendChild(video);

    const onShow = options.onShow;
    const onClose = options.onClose;
    let timer = null;
    let status = null;
    
    const show = (sorces, isMuted = false) => {
        if(sorces.length === 0) {
            return;
        } else if(Array.isArray(sorces)) {
            sorces = sorces.map(src => {
                if(typeof src === 'string') {
                    return {src: src};
                } else if(typeof src === 'object') {
                    return src;
                }
            });
        } else if(typeof sorces === 'string') {
            const type = sorces.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'video';
            sorces = [{src: sorces, type: type}];
        }

        basePane.style.display = 'block';
        timer = setTimeout(() => {
            basePane.style.opacity = '1';
            timer = setTimeout(() => {
                wrapper.requestFullscreen({ navigationUI: "hide" });
                showArrayContents(sorces, 0, isMuted);
            }, 500);
        }, 0);

        if (onShow) {
            onShow();
        }
    }

    const close = () => {
        if(status) {
            status.isRunning = false;
            status = null;
        }

        if(!video.paused) {
            video.pause();
        }

        if(timer) {
            clearTimeout(timer);
            timer = null;
        }

        if(document.fullscreenElement) {
            document.exitFullscreen();
        }

        basePane.style.opacity = '0';
        timer = setTimeout(() => {
            img.style.display = 'none';
            text.style.display = 'none';
            video.style.display = 'none';

            basePane.style.display = 'none';
            timer = null;
        }, 500);

        if (onClose) {
            onClose();
        }
    }

    const showArrayContents = (sorces, index, isMuted = false) => {
        if(index >= sorces.length) {
            close();
            return;
        }

        const src = sorces[index].src;
        const type = sorces[index].type;
        const onEnded = () => { showArrayContents(sorces, index + 1, isMuted); };
        if(type === 'image') {
            const time = sorces[index].time;
            showImage(src, time, onEnded);
        } else if(type === 'video') {
            playVideo(src, isMuted, onEnded);
        } else {
            close();
        }
    }

    const showImage = (src, time, onEnded) => {
        img.src = src;
        img.style.display = null;
        img.style.opacity = '0';
        text.style.display = 'none';
        video.style.display = 'none';

        if(typeof time != 'number') { time = 10*1000 }

        if(timer) {
            clearTimeout(timer);
            timer = null;
        }
        
        const thisStatus = { isRunning: true };
        status = thisStatus;

        fadeIn(img, () => {
            if (thisStatus.isRunning) {
                timer = setTimeout(() => {
                    fadeOut(img, onEnded);
                }, time);
            }
        });
    }

    const playVideo = (src, isMuted, onEnded) => {
        video.src = src;
        video.muted = isMuted;

        video.onended = () => {
            fadeOut(video, onEnded);
        };

        const thisStatus = { isRunning: true };
        status = thisStatus;

        fadeIn(video, () => {
            if (thisStatus.isRunning) {
                video.play();
            }
        });
    }

    async function fadeIn(element, handler) {
        video.style.display = 'none';
        img.style.display = 'none';
        text.style.display = 'none';
        element.style.transition = 'none';
        await wait(0);
        element.style.opacity = '0';
        element.style.display = null;
        await wait(10);
        element.style.transition = 'opacity 1s ease-in-out';
        await wait(0);
        element.style.opacity = '1';
        await wait(1000);
        handler();
    }

    async function fadeOut(element, handler) {
        element.style.transition = 'opacity 1s ease-in-out';
        await wait(0);
        element.style.opacity = '0';
        await wait(1000);
        element.style.display = 'none';
        handler();
    }

    async function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    this.show = show;
    this.close = close;

    this.pauseVideo = () => {
        video.pause();
    }

    this.resumeVideo = () => {
        video.play();
    }

    // フルスクリーンレイヤーのクリックで閉じる
    basePane.addEventListener('click', close, true);

}
