// alertの代替として使えるtoast関数を提供する
/**
 * @param {string} message - ポップアップするメッセージ
 * @param {'error'|'warning'|'success'} type - それぞれエラー、警告、成功を示唆する表示上のフレーバーを提供する
 * @param {number} duration - 消えるまでの時間（ミリ秒）
 */
window.toast = (message, type = 'default', duration = 1500) => {
    getToastDiv().addToast(message, type, duration);
};

/**
 * 初期化され、DOMに接続されたToastDivインスタンスを確実に得る
 * @returns {ToastDiv}
 */
const getToastDiv = () => {
    if (!toastDiv_) {
        toastDiv_ = new ToastDiv();
    }
    if (!toastDiv_.isConnected) {
        toastDiv_.connect(document.body);
    }
    return toastDiv_;
};


let toastDiv_ = null;

// カスタム要素の定義
class ToastDiv extends HTMLElement {
    constructor() {
        super();

        // シャドウDOMを作成してスタイルを隔離
        const shadow = this.attachShadow({ mode: 'open' });

        // スタイルを定義
        const style = document.createElement('style');
        style.textContent = `
                    :host {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 10000;
                        pointer-events: none;
                    }
                    
                    .toast {
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: .5em 1em;
                        border-radius: 16px;
                        margin-bottom: 15px;
                        max-width: 300px;
                        word-wrap: break-word;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                        transform: scale(0.3);
                        opacity: 0;
                        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                        pointer-events: auto;
                        backdrop-filter: blur(15px);
                        border: 2px solid rgba(255, 255, 255, 0.2);
                    }
                    
                    .toast.show {
                        transform: scale(1);
                        opacity: 1;
                    }
                    
                    .toast.hide {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    
                    .toast.error {
                        background: rgba(239, 68, 68, 0.9);
                        border-color: rgba(255, 255, 255, 0.2);
                    }
                    
                    .toast.success {
                        background: rgba(34, 197, 94, 0.9);
                        border-color: rgba(255, 255, 255, 0.2);
                    }
                    
                    .toast.warning {
                        background: rgba(245, 158, 11, 0.9);
                        border-color: rgba(255, 255, 255, 0.2);
                    }
                    
                    .toast-message {
                        font-size: 14px;
                        line-height: 1.4;
                        margin: 0;
                    }
                `;

        shadow.appendChild(style);

        // コンテナを作成
        this.container = document.createElement('div');
        shadow.appendChild(this.container);
    }

    connect(domConnector) {
        if (this.isConnected) return;
        domConnector.appendChild(this);
    }
    /**
     * 
     * @param {string} message 
     * @param {'error'|'success'|'warning'|'default'} [type='default'] - メッセージの種類
     * @param {number} [duration=1500] - 表示時間（ミリ秒）
     */
    addToast(message, type = 'default', duration = 1500) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const messageEl = document.createElement('p');
        messageEl.className = 'toast-message';
        messageEl.textContent = message;
        toast.appendChild(messageEl);

        this.container.appendChild(toast);

        // アニメーション開始
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // 自動削除
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');

            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }
}

customElements.define('toast-div', ToastDiv);

