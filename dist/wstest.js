/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/websocket-client-2.js":
/*!***********************************!*\
  !*** ./src/websocket-client-2.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class WebSocketClient {
    client = this;
    // コンストラクタ
    constructor(handlers = {}, port = 3000, reconnectDelay = 60000) {
        const host = window.location.host.split(':')[0]; // ホスト名からポート番号を除去
        this.url = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${host}:${port}`;
        this.ws = null;
        this.isConnected = false;
        this.handlers = handlers;
        this.reconnectDelay = reconnectDelay; // デフォルト60秒
        this.connect(); // コンストラクタで接続を開始
    }

    connect() {
        try {
            this.ws = new WebSocket(this.url);

            this.ws.onopen = () => {
                document.body.appendChild(document.createElement('div')).textContent = 'WebSocket接続が確立されました';
                this.isConnected = true;
            };

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    console.log(message);
                    
                    if (!message.command) { return; }
                    if (message.toPageTitle && message.toPageTitle !== document.title) { return; }
                    if (message.toPagePath && message.toPagePath !== window.location.pathname) { return; }

                    const handler = this.handlers[message.command];
                    if (handler) {
                        handler(this.client, message, message.from, message.pageTitle, message.pagePath);
                    }
                } catch (error) {
                    document.body.appendChild(document.createElement('div')).textContent = 'メッセージの解析に失敗しました:';
                }
            };

            this.ws.onclose = () => {
                document.body.appendChild(document.createElement('div')).textContent = 'WebSocket接続が切断されました';
                this.isConnected = false;
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                document.body.appendChild(document.createElement('div')).textContent = 'WebSocket接続エラー:' + JSON.stringify(error);
                this.attemptReconnect();
            };
        } catch (error) {
            document.body.appendChild(document.createElement('div')).textContent = 'WebSocket接続エラー:' + JSON.stringify(error);
            this.attemptReconnect();
        }
    }

    attemptReconnect() {
        setTimeout(() => this.connect(), this.reconnectDelay);
    }

    send(command, data = null, to = null, toPageTitle = null, toPagePath = null) {
        if (this.isConnected && this.ws && command) {
            try {
                const obj = {};
                obj.command = command;
                data && (obj.data = data);
                to && (obj.to = to);
                toPageTitle && (obj.toPageTitle = toPageTitle);
                toPagePath && (obj.toPagePath = toPagePath);
                obj.pageTitle = document.title;
                obj.pagePath = window.location.pathname;
                this.ws.send(JSON.stringify(obj));
            } catch (error) {
            }
        }
    }

    debug(command) {
        this.ws.send(JSON.stringify({ command: command, debug: true }));
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            this.isConnected = false;
        }
    }
}

// 使用例:
/*
const handlers = {
    'ping': (client, message, fromIP, pageTitle, pagePath) => {
        console.log('Pingを受信:', message, 'from:', fromIP, 'pageTitle:', pageTitle, 'pagePath:', pagePath);
    },
    'update': (client, message, fromIP, pageTitle, pagePath) => {
        console.log('更新メッセージを受信:', message, 'from:', fromIP, 'pageTitle:', pageTitle, 'pagePath:', pagePath);
    }
};

const wsClient = new WebSocketClient(handlers, 60000);

// メッセージの送信
wsClient.send({ command: 'ping', data: 'こんにちは' });

// 切断
// wsClient.disconnect();
*/

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WebSocketClient);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/wstest.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _websocket_client_2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./websocket-client-2 */ "./src/websocket-client-2.js");




addEventListener("DOMContentLoaded", () => {
    // WebSocketClientのインスタンスを作成
    const wsClient = new _websocket_client_2__WEBPACK_IMPORTED_MODULE_0__["default"]({
        'playVideo': (client, message, from, pageTitle, pagePath) => {
            const currentSrc = message.data.src ? message.data.src : previewPane.currentSrc();
            if(currentSrc) {
                if(currentSrc.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    fullscreenPane.showImage(currentSrc);
                } else {
                    fullscreenPane.playVideo(currentSrc);
                }
            }
        },
        'getVisibilityState': (client, message, from) => {
            console.log('可視性状態を受信:', message);
            client.send('returnVisibilityState', {'state': document.visibilityState}, from);
        }
    });
    // WebSocketClientのインスタンスをグローバル変数に格納
    window.wsClient = wsClient;

});





})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3N0ZXN0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLHlEQUF5RDtBQUN6RCxzQkFBc0IsdURBQXVELElBQUksS0FBSyxHQUFHLEtBQUs7QUFDOUY7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QztBQUM1Qyx5RkFBeUY7QUFDekYsaUdBQWlHO0FBQ2pHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQywrQkFBK0I7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixnQ0FBZ0M7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFlLGVBQWU7Ozs7OztVQzlHOUI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05BO0FBQ21EO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLDJEQUFlO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxrREFBa0Qsa0NBQWtDO0FBQ3BGO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3N3aXBlcjR2aWRlb3MvLi9zcmMvd2Vic29ja2V0LWNsaWVudC0yLmpzIiwid2VicGFjazovL3N3aXBlcjR2aWRlb3Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc3dpcGVyNHZpZGVvcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc3dpcGVyNHZpZGVvcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3N3aXBlcjR2aWRlb3Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zd2lwZXI0dmlkZW9zLy4vc3JjL3dzdGVzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBXZWJTb2NrZXRDbGllbnQge1xyXG4gICAgY2xpZW50ID0gdGhpcztcclxuICAgIC8vIOOCs+ODs+OCueODiOODqeOCr+OCv1xyXG4gICAgY29uc3RydWN0b3IoaGFuZGxlcnMgPSB7fSwgcG9ydCA9IDMwMDAsIHJlY29ubmVjdERlbGF5ID0gNjAwMDApIHtcclxuICAgICAgICBjb25zdCBob3N0ID0gd2luZG93LmxvY2F0aW9uLmhvc3Quc3BsaXQoJzonKVswXTsgLy8g44Ob44K544OI5ZCN44GL44KJ44Od44O844OI55Wq5Y+344KS6Zmk5Y67XHJcbiAgICAgICAgdGhpcy51cmwgPSBgJHt3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwczonID8gJ3dzczonIDogJ3dzOid9Ly8ke2hvc3R9OiR7cG9ydH1gO1xyXG4gICAgICAgIHRoaXMud3MgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmhhbmRsZXJzID0gaGFuZGxlcnM7XHJcbiAgICAgICAgdGhpcy5yZWNvbm5lY3REZWxheSA9IHJlY29ubmVjdERlbGF5OyAvLyDjg4fjg5Xjgqnjg6vjg4g2MOenklxyXG4gICAgICAgIHRoaXMuY29ubmVjdCgpOyAvLyDjgrPjg7Pjgrnjg4jjg6njgq/jgr/jgafmjqXntprjgpLplovlp4tcclxuICAgIH1cclxuXHJcbiAgICBjb25uZWN0KCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KHRoaXMudXJsKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud3Mub25vcGVuID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSkudGV4dENvbnRlbnQgPSAnV2ViU29ja2V05o6l57aa44GM56K656uL44GV44KM44G+44GX44GfJztcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5vbm1lc3NhZ2UgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtZXNzYWdlLmNvbW1hbmQpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UudG9QYWdlVGl0bGUgJiYgbWVzc2FnZS50b1BhZ2VUaXRsZSAhPT0gZG9jdW1lbnQudGl0bGUpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UudG9QYWdlUGF0aCAmJiBtZXNzYWdlLnRvUGFnZVBhdGggIT09IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSkgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IHRoaXMuaGFuZGxlcnNbbWVzc2FnZS5jb21tYW5kXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKHRoaXMuY2xpZW50LCBtZXNzYWdlLCBtZXNzYWdlLmZyb20sIG1lc3NhZ2UucGFnZVRpdGxlLCBtZXNzYWdlLnBhZ2VQYXRoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpLnRleHRDb250ZW50ID0gJ+ODoeODg+OCu+ODvOOCuOOBruino+aekOOBq+WkseaVl+OBl+OBvuOBl+OBnzonO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5vbmNsb3NlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSkudGV4dENvbnRlbnQgPSAnV2ViU29ja2V05o6l57aa44GM5YiH5pat44GV44KM44G+44GX44GfJztcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXR0ZW1wdFJlY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy53cy5vbmVycm9yID0gKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKS50ZXh0Q29udGVudCA9ICdXZWJTb2NrZXTmjqXntprjgqjjg6njg7w6JyArIEpTT04uc3RyaW5naWZ5KGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXR0ZW1wdFJlY29ubmVjdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpLnRleHRDb250ZW50ID0gJ1dlYlNvY2tldOaOpee2muOCqOODqeODvDonICsgSlNPTi5zdHJpbmdpZnkoZXJyb3IpO1xyXG4gICAgICAgICAgICB0aGlzLmF0dGVtcHRSZWNvbm5lY3QoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXR0ZW1wdFJlY29ubmVjdCgpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuY29ubmVjdCgpLCB0aGlzLnJlY29ubmVjdERlbGF5KTtcclxuICAgIH1cclxuXHJcbiAgICBzZW5kKGNvbW1hbmQsIGRhdGEgPSBudWxsLCB0byA9IG51bGwsIHRvUGFnZVRpdGxlID0gbnVsbCwgdG9QYWdlUGF0aCA9IG51bGwpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCAmJiB0aGlzLndzICYmIGNvbW1hbmQpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9iaiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgb2JqLmNvbW1hbmQgPSBjb21tYW5kO1xyXG4gICAgICAgICAgICAgICAgZGF0YSAmJiAob2JqLmRhdGEgPSBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHRvICYmIChvYmoudG8gPSB0byk7XHJcbiAgICAgICAgICAgICAgICB0b1BhZ2VUaXRsZSAmJiAob2JqLnRvUGFnZVRpdGxlID0gdG9QYWdlVGl0bGUpO1xyXG4gICAgICAgICAgICAgICAgdG9QYWdlUGF0aCAmJiAob2JqLnRvUGFnZVBhdGggPSB0b1BhZ2VQYXRoKTtcclxuICAgICAgICAgICAgICAgIG9iai5wYWdlVGl0bGUgPSBkb2N1bWVudC50aXRsZTtcclxuICAgICAgICAgICAgICAgIG9iai5wYWdlUGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuICAgICAgICAgICAgICAgIHRoaXMud3Muc2VuZChKU09OLnN0cmluZ2lmeShvYmopKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWJ1Zyhjb21tYW5kKSB7XHJcbiAgICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KHsgY29tbWFuZDogY29tbWFuZCwgZGVidWc6IHRydWUgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMud3MpIHtcclxuICAgICAgICAgICAgdGhpcy53cy5jbG9zZSgpO1xyXG4gICAgICAgICAgICB0aGlzLndzID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8g5L2/55So5L6LOlxyXG4vKlxyXG5jb25zdCBoYW5kbGVycyA9IHtcclxuICAgICdwaW5nJzogKGNsaWVudCwgbWVzc2FnZSwgZnJvbUlQLCBwYWdlVGl0bGUsIHBhZ2VQYXRoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1BpbmfjgpLlj5fkv6E6JywgbWVzc2FnZSwgJ2Zyb206JywgZnJvbUlQLCAncGFnZVRpdGxlOicsIHBhZ2VUaXRsZSwgJ3BhZ2VQYXRoOicsIHBhZ2VQYXRoKTtcclxuICAgIH0sXHJcbiAgICAndXBkYXRlJzogKGNsaWVudCwgbWVzc2FnZSwgZnJvbUlQLCBwYWdlVGl0bGUsIHBhZ2VQYXRoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ+abtOaWsOODoeODg+OCu+ODvOOCuOOCkuWPl+S/oTonLCBtZXNzYWdlLCAnZnJvbTonLCBmcm9tSVAsICdwYWdlVGl0bGU6JywgcGFnZVRpdGxlLCAncGFnZVBhdGg6JywgcGFnZVBhdGgpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3Qgd3NDbGllbnQgPSBuZXcgV2ViU29ja2V0Q2xpZW50KGhhbmRsZXJzLCA2MDAwMCk7XHJcblxyXG4vLyDjg6Hjg4Pjgrvjg7zjgrjjga7pgIHkv6Fcclxud3NDbGllbnQuc2VuZCh7IGNvbW1hbmQ6ICdwaW5nJywgZGF0YTogJ+OBk+OCk+OBq+OBoeOBrycgfSk7XHJcblxyXG4vLyDliIfmlq1cclxuLy8gd3NDbGllbnQuZGlzY29ubmVjdCgpO1xyXG4qL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgV2ViU29ja2V0Q2xpZW50OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiXHJcbmltcG9ydCBXZWJTb2NrZXRDbGllbnQgZnJvbSAnLi93ZWJzb2NrZXQtY2xpZW50LTInO1xyXG5cclxuXHJcbmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcclxuICAgIC8vIFdlYlNvY2tldENsaWVudOOBruOCpOODs+OCueOCv+ODs+OCueOCkuS9nOaIkFxyXG4gICAgY29uc3Qgd3NDbGllbnQgPSBuZXcgV2ViU29ja2V0Q2xpZW50KHtcclxuICAgICAgICAncGxheVZpZGVvJzogKGNsaWVudCwgbWVzc2FnZSwgZnJvbSwgcGFnZVRpdGxlLCBwYWdlUGF0aCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50U3JjID0gbWVzc2FnZS5kYXRhLnNyYyA/IG1lc3NhZ2UuZGF0YS5zcmMgOiBwcmV2aWV3UGFuZS5jdXJyZW50U3JjKCk7XHJcbiAgICAgICAgICAgIGlmKGN1cnJlbnRTcmMpIHtcclxuICAgICAgICAgICAgICAgIGlmKGN1cnJlbnRTcmMubWF0Y2goL1xcLihqcGd8anBlZ3xwbmd8Z2lmKSQvaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBmdWxsc2NyZWVuUGFuZS5zaG93SW1hZ2UoY3VycmVudFNyYyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bGxzY3JlZW5QYW5lLnBsYXlWaWRlbyhjdXJyZW50U3JjKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJ2dldFZpc2liaWxpdHlTdGF0ZSc6IChjbGllbnQsIG1lc3NhZ2UsIGZyb20pID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ+WPr+imluaAp+eKtuaFi+OCkuWPl+S/oTonLCBtZXNzYWdlKTtcclxuICAgICAgICAgICAgY2xpZW50LnNlbmQoJ3JldHVyblZpc2liaWxpdHlTdGF0ZScsIHsnc3RhdGUnOiBkb2N1bWVudC52aXNpYmlsaXR5U3RhdGV9LCBmcm9tKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIFdlYlNvY2tldENsaWVudOOBruOCpOODs+OCueOCv+ODs+OCueOCkuOCsOODreODvOODkOODq+WkieaVsOOBq+agvOe0jVxyXG4gICAgd2luZG93LndzQ2xpZW50ID0gd3NDbGllbnQ7XHJcblxyXG59KTtcclxuXHJcblxyXG5cclxuXHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==