export function FullscreenPane (options, langs, videoUISettings) {
                
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
    text.style.fontSize = '6vw';
    wrapper.appendChild(text);

    text.appendChild(document.createElement('span')).innerText = 'タッチしてシステムスタート';

    if(langs) {
        text.appendChild(buildLanguagesSelector(langs));
    }

    if(videoUISettings) {
        text.appendChild(buildVideoUISelector(videoUISettings));
    }

    const img = document.createElement('img');
    wrapper.appendChild(img);
    img.style.display = 'none';

    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    wrapper.appendChild(video);
    video.style.display = 'none';

    const onShow = options.onShow;
    const onClose = options.onClose;
    const onInitialClose = options.onInitialClose;
    let timer = null;
    let status = null;
    let isInitialClose = true;
    
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
        if(isInitialClose) {
            isInitialClose = false;
            if(langs) {
                for(let i = 0; i < langs.length; ) {
                    if(!document.getElementById("lang_" + langs[i]).checked) {
                        langs.splice(i, 1);
                    } else {
                        i++;
                    }
                }
            }
            if(videoUISettings) {
                videoUISettings.isOn = document.getElementById("videoui_ison").checked;
            }
            if(onInitialClose) {
                onInitialClose();
            }
        }

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

    const onVideoClick = () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
    this.setVideoUIEnabled = (isEnabled) => {
        if(isEnabled) {
            video.controls = true;
            video.ontouchstart = onVideoClick;
        } else {
            video.controls = false;
            video.ontouchstart = null;
        }
    }

    // フルスクリーンレイヤーのクリックで閉じる
    basePane.addEventListener('click', close, false);

}

function buildLanguagesSelector(langs) {
    const div = document.createElement('div');
    div.style.backgroundColor = '#555';
    div.style.fontSize = '5vw';
    div.style.margin = '3vw';
    div.style.padding = '1vw';
    div.innerText = '【表示言語】';

    langs.forEach(lang => {
        div.appendChild(buildCheckbox(lang, "lang_" + lang));
    });

    div.addEventListener('click', (e)=>{
        e.stopPropagation();
    }, false);

    return div;
}

function buildVideoUISelector(videoUISettings) {
    const div = document.createElement('div');
    div.style.backgroundColor = '#555';
    div.style.fontSize = '5vw';
    div.style.margin = '3vw';
    div.style.padding = '1vw';
    div.innerText = '【動画UI】';

    div.appendChild(buildCheckbox("UIを表示する", "videoui_ison", false));

    div.addEventListener('click', (e)=>{
        e.stopPropagation();
    }, false);

    return div;
}

function buildCheckbox(name, id, defaultValue = true) {
    const span = document.createElement('span');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.name = name;
    input.value = id;
    
    // クッキーから状態を読み込む
    const savedState = document.cookie.split(';')
        .find(c => c.trim().startsWith(id + '='));
    input.checked = savedState ? savedState.split('=')[1] === 'true' : defaultValue;
    
    input.style.width = '4vw';
    input.style.height = '4vw';
    
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = name;
    label.style.marginRight = '3vw';
    
    span.appendChild(input);
    span.appendChild(label);

    // クリックイベントでクッキーに保存
    input.addEventListener('change', () => {
        document.cookie = `${id}=${input.checked}; max-age=31536000; path=/`;
    });

    return span;
}