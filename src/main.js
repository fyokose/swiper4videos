import { mainPlayer } from './main_player.js';
import { mainSlides } from './main_slides.js';
import { mainGuide } from './main_guide.js';

addEventListener("DOMContentLoaded", () => {
    if(document.body.classList.contains('player')) {
        mainPlayer(); 
    }else if(document.body.classList.contains('slides')) {
        mainSlides();
    }else if(document.body.classList.contains('guide')) {
        mainGuide();
    }
    
});




