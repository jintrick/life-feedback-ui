(() => {
const $457097b8657e7022$var$FEEDBACK_N_SERVICE = Object.freeze({
    "\u79D1\u5B66\u7684\u4ECB\u8B77\u63A8\u9032\u4F53\u5236\u52A0\u7B97": Object.freeze([
        '52',
        '16',
        '66'
    ]),
    "\u6804\u990A\u30DE\u30CD\u30B8\u30E1\u30F3\u30C8\u5F37\u5316\u52A0\u7B97\u30FB\u6804\u990A\u30A2\u30BB\u30B9\u30E1\u30F3\u30C8\u52A0\u7B97": Object.freeze([
        '52'
    ]),
    "\u53E3\u8154\u885B\u751F\u7BA1\u7406\u52A0\u7B97": Object.freeze([
        '52'
    ]),
    "\u53E3\u8154\u6A5F\u80FD\u5411\u4E0A\u52A0\u7B97": Object.freeze([
        '16',
        '66'
    ]),
    "\u500B\u5225\u6A5F\u80FD\u8A13\u7DF4\u52A0\u7B97": Object.freeze([]),
    "\u30EA\u30CF\u30D3\u30EA\u30C6\u30FC\u30B7\u30E7\u30F3\u30DE\u30CD\u30B8\u30E1\u30F3\u30C8\u52A0\u7B97\u7B49": Object.freeze([
        '52',
        '16',
        '66',
        '14',
        '64'
    ]),
    "\u77ED\u671F\u96C6\u4E2D\u30EA\u30CF\u30D3\u30EA\u30C6\u30FC\u30B7\u30E7\u30F3\u5B9F\u65BD\u52A0\u7B97": Object.freeze([
        '52'
    ]),
    "\u8925\u7621\u30DE\u30CD\u30B8\u30E1\u30F3\u30C8\u52A0\u7B97": Object.freeze([
        '52'
    ]),
    "\u6392\u305B\u3064\u652F\u63F4\u52A0\u7B97": Object.freeze([
        '52'
    ]),
    "\u81EA\u7ACB\u652F\u63F4\u4FC3\u9032\u52A0\u7B97": Object.freeze([
        '52'
    ]),
    "ADL\u7DAD\u6301\u7B49\u52A0\u7B97": Object.freeze([]),
    "\u500B\u5225\u6A5F\u80FD\u30FB\u6804\u990A\u30FB\u53E3\u8154": Object.freeze([]),
    "\u30EA\u30CF\u30D3\u30EA\u30C6\u30FC\u30B7\u30E7\u30F3\u30FB\u6804\u990A\u30FB\u53E3\u8154": Object.freeze([
        '52',
        '16',
        '66',
        '14',
        '64'
    ])
});
const $457097b8657e7022$var$SERVICE_N_LABEL = Object.freeze({
    "52": "\u4ECB\u8B77\u4FDD\u5065\u65BD\u8A2D\u30B5\u30FC\u30D3\u30B9",
    "16": "\u901A\u6240\u30EA\u30CF",
    "66": "\u4ECB\u8B77\u4E88\u9632\u901A\u6240\u30EA\u30CF",
    "14": "\u8A2A\u554F\u30EA\u30CF",
    "64": "\u4ECB\u8B77\u4E88\u9632\u8A2A\u554F\u30EA\u30CF"
});
/**
 * tableau-viz 以下を操作するビジネスロジックを担当するモデル
 */ class $457097b8657e7022$export$4a03f2d02d318682 extends EventTarget {
    /**
	 * https://life-web.mhlw.go.jp/* でのみ初期化可能
	 */ constructor(){
        super();
        const url = new URL(document.URL);
        if (url.hostname !== 'life-web.mhlw.go.jp') throw new $457097b8657e7022$export$1ab263a1fcc72b0a(`life-web.mhlw.go.jp \u{4EE5}\u{5916}\u{3067}\u{306F}\u{521D}\u{671F}\u{5316}\u{3067}\u{304D}\u{307E}\u{305B}\u{3093}\u{FF1A}${url.href}`, url);
        this.ownerDocument = document;
        this.observeSrc(()=>{
            this.adjustStyle(); // スタイル調整
            this.#comboBoxes = null; // コンボボックスのキャッシュをクリア
            // イベントを発行。コントローラー側でこのクラスのインスタンスにaddEventListenerすること
            this.dispatchEvent(new Event('src-loaded'));
        });
    }
    #STYLE_ELEMENT_ID = 'LifeFeedbackPage-style-2025-03-18';
    #intervalId = null;
    #comboBoxes = null;
    /**
	 * tableau-viz > #shadow-root > iframe > #document
	 * @return {Document} - フィードバックページ本体のDocument
	 */ get doc() {
        const shadowDoc = this.iframe?.contentDocument;
        if (!shadowDoc) throw new $457097b8657e7022$export$1ab263a1fcc72b0a(`\u{30B7}\u{30E3}\u{30C9}\u{30A6}DOM\u{306B}\u{5230}\u{9054}\u{3067}\u{304D}\u{307E}\u{305B}\u{3093}`, this.ownerDocument);
        return shadowDoc;
    }
    get iframe() {
        return this.ownerDocument.querySelector('tableau-viz')?.shadowRoot.querySelector('iframe');
    }
    /**
	 * @return {HTMLStyleElement} - 追加したstyle要素
	 */ get style() {
        const doc = this.doc;
        let style = doc.getElementById(this.#STYLE_ELEMENT_ID);
        if (!style) style = this.adjustStyle();
        return style;
    }
    /**
	 * @return {object} - {services: <LifeComboBox>, users: <LifeComboBox>}
	 */ get comboBoxes() {
        if (this.#comboBoxes) return this.#comboBoxes;
        let comboBoxes = this.doc.querySelectorAll('span[role="combobox"]');
        if (!comboBoxes.length) return null;
        comboBoxes = Array.from(comboBoxes);
        const servicesBox = comboBoxes[0];
        if (!servicesBox) throw new $457097b8657e7022$export$1ab263a1fcc72b0a(`\u{30B5}\u{30FC}\u{30D3}\u{30B9}\u{7A2E}\u{985E}\u{30B3}\u{30F3}\u{30DC}\u{30DC}\u{30C3}\u{30AF}\u{30B9}\u{306E}\u{53C2}\u{7167}\u{306B}\u{5931}\u{6557}\u{FF1A}`, this.doc);
        const usersBox = comboBoxes[1];
        if (!usersBox) throw new $457097b8657e7022$export$1ab263a1fcc72b0a(`\u{30E6}\u{30FC}\u{30B6}\u{30FC}ID\u{30B3}\u{30F3}\u{30DC}\u{30DC}\u{30C3}\u{30AF}\u{30B9}\u{306E}\u{53C2}\u{7167}\u{306B}\u{5931}\u{6557}`, this.doc);
        comboBoxes = {
            services: new $457097b8657e7022$var$LifeComboBox(servicesBox, "services"),
            users: new $457097b8657e7022$var$LifeComboBox(usersBox, "users")
        };
        this.#comboBoxes = comboBoxes;
        return comboBoxes;
    }
    /**
	 * フィードバックページのタイトル
	 * ロード未完了時やフィードバックページ以外はundefined
	 * @returns {string|undefined}
	 */ get title() {
        const el = this.doc.querySelector('.tabZone-title');
        return el?.innerText.split("\u5229\u7528\u8005")[0].trim(); // 'フィードバック名\s?利用者フィードバック'
    }
    /**
	 * 事業所番号
	 * @return {string|undefined}
	 */ get careFacilityId() {
        const tableau = this.ownerDocument.querySelector('tableau-viz');
        return tableau?.querySelector('viz-parameter[name="\u81EA\u4E8B\u696D\u6240\u756A\u53F7"]')?.getAttribute('value');
    }
    /**
	 * 現在選択されているサービス種類のコード
	 * 未選択時: null
	 * @returns {string|null}
	 */ get currentService() {
        const span = this.comboBoxes.services.currentItem;
        const foundKey = Object.keys($457097b8657e7022$var$SERVICE_N_LABEL).find((key)=>span.innerText.startsWith($457097b8657e7022$var$SERVICE_N_LABEL[key]));
        return foundKey ? foundKey : null;
    }
    /**
	 * 現在選択されているユーザーID
	 * 未選択時: null
	 * @retruns {LifeUserId|null}
	 */ get currentUserId() {
        const span = this.comboBoxes.users.currentItem;
        const text = span.innerText;
        try {
            return new $457097b8657e7022$export$3e09aba409ca88ca(text);
        } catch (err) {
            return null;
        }
    }
    /**
	 * 選択肢として選択可能なサービス
	 * {サービスコード: サービス名, ..}
	 * @returns {Object}
	 */ get availableServices() {
        return this.services(this.title);
    }
    /**
	 * 指定したフィードバックが利用可能なサービス一覧を取得する
	 * {サービスコード: サービス名, ..}
	 * @param {string} feedBackName - フィードバック名（"科学的介護推進体制加算"、etc.）
	 * @return {object} - {service_code: service_label, ..}
	 */ services(feedBackName = '') {
        if (!feedBackName) return $457097b8657e7022$var$SERVICE_N_LABEL;
        const code_list = $457097b8657e7022$var$FEEDBACK_N_SERVICE[feedBackName];
        return Object.fromEntries(Object.entries($457097b8657e7022$var$SERVICE_N_LABEL).filter(([key])=>code_list.includes(key)));
    }
    /**
	 * サービス種類の選択をエミュレートする
	 * @param {string} serviceCode 
	 * @returns {Promise<boolean>} - 選択の成否
	 */ async selectService(serviceCode) {
        // 既にサービスが選択されていれば何もしない
        if (this.currentService === serviceCode) return true;
        let a; // クリックしたいターゲット要素
        // 既にドロップダウンしている場合（=> 稀だろう）
        const serviceName = $457097b8657e7022$var$SERVICE_N_LABEL[serviceCode];
        a = this.doc.querySelector('a[title^="${serviceName}"]');
        if (a) {
            a.click();
            return true;
        }
        // ドロップダウンしていなければアイテム達をロード
        const nl = await this.comboBoxes.services.loadItems();
        for (a of nl)if (a.textContent.trim().startsWith(serviceName)) {
            a.click();
            return true;
        }
        // サービスがドロップダウンに存在しなかったので、コンボボックスを畳む
        this.comboBoxes.services.collapseItems();
        return false;
    }
    /**
	 * 利用者（表示上はID）の選択をエミュレートする
	 * @param {LifeUserId} userId - ユーザーID
	 * @returns {Promise<boolean>} - 選択の成否
	 */ async selectUser(userId) {
        // 既に利用者IDが選択されていれば何もしない
        if (this.currentUserId?.equals(userId)) return true;
        // IDに該当するサービスが選択されていなければ、選択しておく
        const serviceCode = userId.serviceCode;
        if (this.currentService !== serviceCode) await this.selectService(serviceCode);
        let a; // クリックしたいターゲット要素
        //既にドロップダウンしている場合（=> 稀だろう）
        a = this.doc.querySelector('a[title="${userId}"]');
        if (a) {
            a.click();
            return true;
        }
        // ドロップダウンしていなければアイテム達をロード
        const nl = await this.comboBoxes.users.loadItems();
        for (a of nl)if (a.textContent.trim() == userId) {
            console.assert(a.textContent.trim() === userId.toString(), "==\u6F14\u7B97\u5B50\u3067\u306EuserId\u306E\u6BD4\u8F03\u304C\u5931\u6557\u3057\u3066\u308B\u304B\u3082");
            a.click();
            return true;
        }
        // ユーザーIDがドロップダウンに存在しなかったので、コンボボックスを畳む
        this.comboBoxes.users.collapseItems();
        return false;
    }
    /**
	 * #shadow-root以下のスタイルを微調整（cf.ユーザーテーブルのスタイル調整はLifeUserTableの責務）
	 * @returns {HTMLStyleElement} - 挿入した（あるいは既存の）style要素
	 */ adjustStyle() {
        const doc = this.doc;
        let style = doc.getElementById("this.#STYLE_ELEMENT_ID");
        if (style) return style;
        const CSS_SNIPPET = `
#dashboard-spacer{ /* iframe\u{5185}\u{90E8}\u{306E}\u{30EC}\u{30A4}\u{30A2}\u{30A6}\u{30C8}\u{7528}div */
  margin: 0 !important;
}`;
        style = doc.createElement('style');
        style.id = this.#STYLE_ELEMENT_ID;
        style.textContent = CSS_SNIPPET;
        doc.documentElement.appendChild(style);
        return style;
    }
    /**
	 * コンテンツのページ遷移を監視する
	 * @param {Function} callback - ページ遷移時に実行するコールバック
	 * @param {number} intervalMs - ポーリング間隔（ミリ秒）
	 * @returns {number} - 解除に必要なID（clearIntervalで使用）
	 */ observeSrc(callback, intervalMs = 500) {
        // 監視の重複を排除
        this.disconnect();
        //iframe.contentWindow.location.hrefの変化を監視
        const iframe = this.ownerDocument.querySelector('tableau-viz')?.shadowRoot?.querySelector('iframe');
        if (!iframe) throw new $457097b8657e7022$export$1ab263a1fcc72b0a(`iframe\u{3092}\u{53C2}\u{7167}\u{3067}\u{304D}\u{307E}\u{305B}\u{3093}`, this.ownerDocument);
        let lastUrl = iframe.contentWindow.location.href;
        const id = setInterval(()=>{
            let currentUrl;
            try {
                currentUrl = iframe.contentWindow.location.href;
            } catch (err) {
                debugger;
                clearInterval(id);
                return;
            }
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl; //更新
                callback();
            }
        }, intervalMs);
        this.#intervalId = id;
        return id;
    }
    /**
	 * このクラスで管理しているsetIntervalをクリアする
	 */ disconnect() {
        const id = this.#intervalId;
        if (id) {
            clearInterval(id);
            this.#intervalId = null;
        }
    }
    /**
	 * フィードバックメニューに戻る
	 * LIFEのfuckin'フロントエンドが吐いたボタンは下の方に消えてしまうので……
	 * throws {LifeError} - 事業所番号取得失敗時 / iframe参照失敗時
	 */ gotoMenu() {
        const careFacilityId = this.careFacilityId;
        if (!careFacilityId) throw new $457097b8657e7022$export$1ab263a1fcc72b0a("\u4E8B\u696D\u6240\u756A\u53F7\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
        const url = `https://life-web.mhlw.go.jp/tableau/views/feedback_menu/sheet1?%3Alinktarget=_self&%3Aembed=yes&%E8%87%AA%E4%BA%8B%E6%A5%AD%E6%89%80%E7%95%AA%E5%8F%B7=${careFacilityId}&:customViews=no#1`;
        const iframe = this.iframe;
        if (!iframe) throw new $457097b8657e7022$export$1ab263a1fcc72b0a("iframe\u306E\u53C2\u7167\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
        iframe.src = url;
    }
}
/**
 * コンボボックスを抽象化
 * LifeFeedBackPage#comboBoxesで使用される
 */ class $457097b8657e7022$var$LifeComboBox {
    /**
	 * @param {HTMLSpanElement} containerDiv - LIFEのfuckin'フロントエンドが生成する謎のspan要素（コンボアイテムのコンテナ）
	 * @param {string} name - コンボボックスの名前（service, user, その他）
	 */ constructor(containerDiv, name){
        this._container = containerDiv;
        this.doc = containerDiv.ownerDocument;
        this.name = name;
    }
    /**
	 * @return {HTMLSpanElement} - 現在選択されているコンボアイテム
	 */ get currentItem() {
        return this._container.querySelector('span.tabComboBoxName');
    }
    /**
	 * LIFEのfuckin'フロントエンドが生成するコンボアイテムのリスト
	 * まだDOMに存在していなければnull
	 * @returns {NodeList|null} - コンボアイテムを含むノードリスト[a, a, a, ...]。
	 */ _getComboItems() {
        const nl = this.doc.querySelectorAll('a[title]');
        if (!nl.length) return null;
        return nl;
    }
    /**
	 * コンボアイテムをロードする
	 * @returns {Promise<NodeList>} - [a, a, a, ..]
	 */ loadItems() {
        const callback = (resolve, reject)=>{
            const observer = new MutationObserver((mutations)=>{
                for (const m of mutations){
                    if (m.type !== 'childList') continue;
                    const comboItems = this._getComboItems();
                    if (!comboItems) continue;
                    observer.disconnect();
                    resolve(comboItems);
                    break;
                }
            });
            //監視開始（body要素のlastChildあたりにコンボアイテムが出現するので、監視範囲が無駄に広くなる……）
            observer.observe(this.doc.body, {
                childList: true
            });
            try {
                this.click(); // クリックイベントを発生させるとコンボアイテムが生成され、observerがそれを捉える
            } catch (err) {
                observer.disconnect();
                reject(new $457097b8657e7022$export$1ab263a1fcc72b0a(`\u{30A4}\u{30D9}\u{30F3}\u{30C8}\u{306E}\u{767A}\u{706B}\u{3067}\u{30A8}\u{30E9}\u{30FC}\u{304C}\u{751F}\u{3058}\u{305F}\u{305F}\u{3081}DOM\u{76E3}\u{8996}\u{3092}\u{505C}\u{6B62}\u{3057}\u{307E}\u{3057}\u{305F} at LifeFeedBackPage#loadItems.${this.name}`, this));
            }
            //タイムアウト処理
            setTimeout(()=>{
                observer.disconnect();
            // reject(new LifeError('ドロップダウン処理がタイムアウトしたためDOM監視を停止しました'));
            }, 1500);
        };
        return new Promise(callback);
    }
    /**
	 * コンボボックスを畳む
	 */ collapseItems() {
        // isTrustedでほとんどのエミュレートを封じられているので、仕方なく最初のアイテムのclickを呼んでいる
        const comboItems = this._getComboItems(); // [a, a, a, ..]
        if (!comboItems) return;
        comboItems[0].click(); // a.click();は何故かisTrustedが解除されておりエミュレート可能
    }
    /**
	 * ユーザーのコンボボックス上におけるクリック動作をエミュレート
	 */ click() {
        [
            'mousedown',
            'mouseup'
        ].forEach((key)=>this._container.dispatchEvent(new MouseEvent(key, {
                bubbles: true,
                cancelable: true,
                view: window
            })));
    }
}
class $457097b8657e7022$export$3e09aba409ca88ca {
    /**
	 * 
	 * @param {string} id_string - LIFE仕様のユーザーID（8桁）
	 */ constructor(id_string){
        if (/^\d{8}$/.test(id_string.trim()) === false) throw new $457097b8657e7022$export$1ab263a1fcc72b0a("\u4E0D\u6B63\u306AID\u3067\u3059\u3002ID\u3068\u3057\u3066\u4E0E\u3048\u3089\u308C\u305F\u6587\u5B57\u5217: ", id_string);
        this._idString = id_string;
    }
    toString() {
        return this._idString;
    }
    /**
	 * 
	 * @param {LifeUserId} userId 
	 * @returns {boolean} - 同一性
	 */ equals(userId) {
        return this._idString === userId._idString;
    }
    /**
	 * IDのうち、サービス種類コードを除いた部分
	 * @returns {string}
	 */ get userCode() {
        return this._idString.slice(0, 6);
    }
    /**
	 * サービス種類コードを抜き出す
	 * @returns {string}
	 */ get serviceCode() {
        return this._idString.slice(-2);
    }
}
class $457097b8657e7022$export$1ab263a1fcc72b0a extends Error {
    constructor(message, faultyObject){
        super(message);
        this.faultyObject = faultyObject;
    }
}
/* @if ENV=development */ window.LifeFeedBackPage = $457097b8657e7022$export$4a03f2d02d318682;
window.LifeUserId = $457097b8657e7022$export$3e09aba409ca88ca;
window.LifeError = $457097b8657e7022$export$1ab263a1fcc72b0a; /* @endif */ 



// alertの代替として使えるtoast関数を提供する
/**
 * @param {string} message - ポップアップするメッセージ
 * @param {'error'|'warning'|'success'} type - それぞれエラー、警告、成功を示唆する表示上のフレーバーを提供する
 * @param {number} duration - 消えるまでの時間（ミリ秒）
 */ function $1736a0e800540d33$var$toast(message, type = 'default', duration = 1500) {
    $1736a0e800540d33$var$getToastDiv().addToast(message, type, duration);
}
const $1736a0e800540d33$var$DURATION_DEFAULT = 2000;
/**
 * 初期化され、DOMに接続されたToastDivインスタンスを確実に得る
 * @returns {ToastDiv}
 */ const $1736a0e800540d33$var$getToastDiv = ()=>{
    if (!$1736a0e800540d33$var$toastDiv_) $1736a0e800540d33$var$toastDiv_ = new $1736a0e800540d33$var$ToastDiv();
    if (!$1736a0e800540d33$var$toastDiv_.isConnected) $1736a0e800540d33$var$toastDiv_.connect(document.body);
    return $1736a0e800540d33$var$toastDiv_;
};
let $1736a0e800540d33$var$toastDiv_ = null;
// カスタム要素の定義
class $1736a0e800540d33$var$ToastDiv extends HTMLElement {
    constructor(){
        super();
        // シャドウDOMを作成してスタイルを隔離
        const shadow = this.attachShadow({
            mode: 'open'
        });
        // スタイルを定義
        const style = document.createElement('style');
        style.textContent = `
                    :host {
                        position: fixed;
                        top: 40%;
                        left: 40%;
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
                        font-size: 18px;
                        line-height: 1.2;
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
     * @param {number} [duration=DURATION_DEFAULT] - 表示時間（ミリ秒）
     */ addToast(message, type = 'default', duration = $1736a0e800540d33$var$DURATION_DEFAULT) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const messageEl = document.createElement('p');
        messageEl.className = 'toast-message';
        messageEl.textContent = message;
        toast.appendChild(messageEl);
        this.container.appendChild(toast);
        // アニメーション開始
        requestAnimationFrame(()=>{
            toast.classList.add('show');
        });
        // 自動削除
        setTimeout(()=>{
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(()=>{
                toast.remove();
            }, 300);
        }, duration);
    }
}
customElements.define('toast-div', $1736a0e800540d33$var$ToastDiv);
var $1736a0e800540d33$export$2e2bcd8739ae039 = $1736a0e800540d33$var$toast;
/* @if ENV=development */ window.toast = $1736a0e800540d33$var$toast; /* @endif */ 


/**
 * FHD未満の環境では右側に隠れてしまっている利用者テーブルを左側に寄せて
 * 利用者選択用のGUIとして利用するためのラッパー（シングルトン）
 */ class $3a8ec0e263d79bdf$var$LifeUserTable {
    /**
	 * 
	 * @param {LifeFeedBackPage} lifeFeedback 
	 */ constructor(lifeFeedback){
        const table = document.querySelector('table[role="table"]');
        if (!table) throw new (0, $457097b8657e7022$export$1ab263a1fcc72b0a)('table[role="table"]\u304C\u898B\u3064\u304B\u3089\u306A\u3044\u305F\u3081\u3001LifeUserTable\u3092\u521D\u671F\u5316\u3067\u304D\u307E\u305B\u3093\u3002');
        this._table = table;
        this._filterStates = null;
        this.life = lifeFeedback;
        // LifeFeedBackPageがiframeのsrcの変更を検知したときイベントを発行するので、そいつを捉えてViewを更新する
        this.life.addEventListener('src-loaded', (e)=>this.replaceCaption());
        // 各ユーザー行 > イベントリスナーを登録
        // 各ユーザー行 > data-id, data-name, data-servicecode　属性を付与
        table.querySelectorAll('tbody > tr').forEach((tr)=>{
            const id = tr.querySelector('td:first-child').innerText;
            const name = tr.querySelector('td:last-child').innerText;
            const serviceCode = id.slice(-2);
            tr.addEventListener('click', this._onUserRowSelect);
            tr.setAttribute('data-id', id);
            tr.setAttribute('data-name', name);
        });
        Object.defineProperty(HTMLLabelElement.prototype, "disabled", {
            /**
			 * @return {boolean} - disabled
			 */ get () {
                return this.classList.contains('disabled');
            },
            /**
			 * @param {boolean} value - disabled
			 */ set (value) {
                this.classList.toggle('disabled', value);
                Array.from(this.children).forEach((controller)=>{
                    controller.disabled = value;
                });
            }
        });
        /**
		 * テーブル行を排他的に選択する
		 * @param {boolean} select - true: 選択, false: 非選択（全解除）
		 */ HTMLTableRowElement.prototype.selectExclusively = function(select) {
            const tbody = this.parentNode; // 誤ってthead/tfootでデータが定義されていてもOK
            // 万が一重複していたときのために、only-selectedクラスのtrを全部走査する
            tbody.querySelectorAll('tr.only-selected').forEach((row)=>row.classList.remove('only-selected'));
            if (select) this.classList.add('only-selected');
        };
    }
    /**
	 * 
	 * @param {string} columnName - フィルター対象の列名
	 * @param {RegExp} regex - フィルターに使う正規表現
	 * @returns 
	 */ filter(columnName, regex) {
        const self = this._table;
        const rows = self.rows;
        if (rows.length <= 1) return this;
        const headerRow = rows[0];
        const headers = Array.from(headerRow.cells).map((cell)=>cell.textContent.trim());
        const columnIndex = headers.indexOf(columnName);
        if (columnIndex === -1) throw new (0, $457097b8657e7022$export$1ab263a1fcc72b0a)(`\u{5217} "${columnName}" \u{304C}\u{898B}\u{3064}\u{304B}\u{308A}\u{307E}\u{305B}\u{3093}`);
        // 各列のフィルター状態を記録するための Map
        self._filterStates = self._filterStates || new Map();
        // 現在の列フィルターを保存
        self._filterStates.set(columnName, regex);
        Array.from(rows).slice(1).forEach((row)=>{
            // すべての列フィルターを適用
            let visible = true;
            for (const [col, reg] of self._filterStates.entries()){
                const cellValue = row.cells[headers.indexOf(col)]?.textContent.trim() || "";
                if (!reg.test(cellValue)) {
                    visible = false;
                    break;
                }
            }
            row.style.display = visible ? 'table-row' : 'none';
        });
    }
    /**
	 * 高機能Captionに置き換える
	 * 便宜上CaptionにViewコントローラーGUIを配置する
	 */ replaceCaption() {
        const HTML_SNIPPET = `
		<style>
		/* \u{30E6}\u{30FC}\u{30B6}\u{30FC}\u{30C6}\u{30FC}\u{30D6}\u{30EB}\u{306E}\u{30EB}\u{30FC}\u{30C8}div */
		.serviceUser-area{ 
			/* reset */
			position: static !important;
			width: auto !important;
			height: auto !important;
			
			grid-column: 1;
		}
		/* \u{30C6}\u{30FC}\u{30D6}\u{30EB}\u{306E}\u{30B3}\u{30F3}\u{30C6}\u{30CA}div */
		.serviceUser-table{ 
			overflow-x: auto !important;
			height: auto !important;
			width: auto !important;
		}
		/* table header */
		.mat-mdc-header-row{
			height: auto !important;
			font-size: medium !important;
		}
		
		/* tr */
		thead .mat-column-serviceUserId,  
		thead .mat-column-serviceUserName{
			font-size: small !important;
			width: auto !important;
			height: auto !important;
		}
		.mdc-data-table__row{
			height: auto !important;
		}
		.only-selected{
			background-color: rgb(255, 255, 172) !important;
			font-weight: bold;
		}
		/* td, th */
		.mat-mdc-cell{
			/* \u{30BB}\u{30EB}\u{5171}\u{901A} */
			padding: .3em !important;
			line-height: 1.0 !important;
		}
		tbody .mat-column-serviceUserId,  
		tbody .mat-column-serviceUserName{
			font-size: medium !important;
			width: auto !important;
			height: auto !important;
			text-align: left !important;
			cursor: default;
		}
		tbody > tr:hover{
			background-color: #eee;
		}
		.mat-mdc-header-cell{
			height: 20px !important;
		}
		/* \u{4E8B}\u{696D}\u{6240}\u{756A}\u{53F7}\u{3068}\u{5229}\u{7528}\u{8005}\u{306F}\u{9078}\u{629E}\u{3067}\u{304D}\u{307E}\u{305B}\u{3093}\u{300D}\u{3092}\u{6D88}\u{3059} */
		app-feedback-check .careFacility-Id,
		app-feedback-check .notice{
			display: none;
		}
		
		/*******************************/
		/* \u{30E6}\u{30FC}\u{30B6}\u{30FC}\u{30B9}\u{30AF}\u{30EA}\u{30D7}\u{30C8}\u{3067}\u{633F}\u{5165}\u{3059}\u{308B}\u{8981}\u{7D20} */
		/*******************************/
		input[name="username"]{
			font-size: medium;
			padding: 4px 4px;
			margin-top: 0.5em;
		}
		small{
			color: gray;
		}
		fieldset{
			background-color: rgba(0, 72, 179, 0.15);
			margin: 2px;
		}
		fieldset label{
			font-size: medium;
		}
		legend{
			font-size: small;
		}
		label{
			display:block;
		}
		label.disabled{
			opacity: 0.6;
		}
		caption{
			text-align:left;
			line-height:1.5;
		}
		</style>
		<button class="goto-menu">\u{30D5}\u{30A3}\u{30FC}\u{30C9}\u{30D0}\u{30C3}\u{30AF}\u{30E1}\u{30CB}\u{30E5}\u{30FC}\u{306B}\u{623B}\u{308B}</button>
		<fieldset>
		<legend>\u{5229}\u{7528}\u{8005}\u{30C6}\u{30FC}\u{30D6}\u{30EB}\u{3092}\u{7D5E}\u{308A}\u{8FBC}\u{3080}</legend>
		<label>
		  <input type="radio" name="filter" value="52">
		  <span>\u{5165}\u{6240} <small>[ID\u{672B}\u{5C3E}52]</small></span>
		</label>
		<label>
		  <input type="radio" name="filter" value="16">
		  <span>\u{901A}\u{6240} <small>[ID\u{672B}\u{5C3E}16]</small></span>
		</label>
		<label>
		  <input type="radio" name="filter" value="66">
		  <span>\u{4ECB}\u{8B77}\u{4E88}\u{9632}\u{901A}\u{6240} <small>[ID\u{672B}\u{5C3E}66]</small></span>
		</label>
		<label>
		  <input type="radio" name="filter" value="14">
		  <span>\u{8A2A}\u{554F} <small>[ID\u{672B}\u{5C3E}14]</small></span>
		</label>
		<label>
		  <input type="radio" name="filter" value="64">
		  <span>\u{4ECB}\u{8B77}\u{4E88}\u{9632}\u{8A2A}\u{554F} <small>[ID\u{672B}\u{5C3E}64]</small></span>
		</label>
		<label>
		  <input type="text" name="username" placeholder="\u{540D}\u{524D}\u{3067}\u{7D5E}\u{308A}\u{8FBC}\u{307F}">
		</label>
		</fieldset>`;
        const doc = this._table.ownerDocument;
        const caption = doc.createElement('caption');
        caption.insertAdjacentHTML('afterbegin', HTML_SNIPPET);
        this._table.caption = caption;
        //各ラジオボタンをフィードバックと同期させ、イベントリスナーをセット
        const available_codes = Object.keys(this.life.availableServices);
        caption.querySelectorAll('input[name="filter"]').forEach(async (radio)=>{
            // 現在のフィードバックページで無効なradioを「ラベルごと」disabled！
            const serviceCode = radio.value;
            const isServiceAvailable = available_codes.includes(serviceCode);
            radio.closest('label').disabled = !isServiceAvailable;
            if (isServiceAvailable) // ラジオボタンにイベントリスナーをセット
            radio.addEventListener('change', this._onServiceRadioSelect);
        });
        //ユーザー名の入力欄にイベントリスナーをセット
        caption.querySelector('input[name="username"]').addEventListener('input', this._onInputUserName);
        //メニューに戻るボタンにイベントリスナーをセット
        caption.querySelector('button.goto-menu').addEventListener('click', this._onClickGotoMenuButton);
    }
    /**
	 * ユーザーテーブルの本体の表示および属性を初期化（フィルター解除 + 行選択解除など）
	 */ refreshBody() {
        const table = this._table;
        //フィルター解除
        table.tHead.querySelectorAll('td').forEach((td)=>{
            const title = td.textContent.trim();
            this.filter(title, "");
        });
        // 行選択解除
        const tr = table.tBodies[0].rows[0];
        tr.selectExclusively(false);
    }
    /**
	 * Lifeのiframe.srcが書き換えられた時のイベントリスナー
	 * @param {Event} e - targetはLifeFeedBackPageインスタンス
	 */ _onSrcLoaded = (e)=>{
        this.replaceCaption();
        this.refreshBody();
    };
    /**
	 * メニューに戻るボタンがクリックされたときのイベントリスナー
	 * @param {Event} e - targetはbutton.goto-menu
	 */ _onClickGotoMenuButton = (e)=>{
        try {
            this.life.gotoMenu();
        } catch (err) {
            if (err instanceof (0, $457097b8657e7022$export$1ab263a1fcc72b0a)) (0, $1736a0e800540d33$export$2e2bcd8739ae039)("\u30E1\u30CB\u30E5\u30FC\u30DA\u30FC\u30B8\u306E\u30ED\u30FC\u30C9\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002LIFE\u306E\u623B\u308B\u30DC\u30BF\u30F3\u3092\u63A2\u3057\u3066\u304F\u3060\u3055\u3044\uFF08\u4E0B\u306E\u65B9\u306B\u96A0\u308C\u3066\u3044\u308B\u3053\u3068\u304C\u3042\u308A\u307E\u3059\uFF09\u3002", 'error');
            else throw err;
        }
    };
    /**
	 * ユーザー名入力欄に入力されたときのイベントリスナー
	 * @param {Event} e - targetはinput[name="username"]
	 */ _onInputUserName = (e)=>{
        //利用者表を氏名でフィルター
        this.filter("\u5229\u7528\u8005\u6C0F\u540D", new RegExp(`^${e.target.value}`));
    };
    /**
	 * サービス種類のラジオボタンが選択されたときのイベントリスナー
	 * @param {Event} e - input[type="radio"] が選択された際のイベント
	 */ _onServiceRadioSelect = async (e)=>{
        const radio = e.currentTarget;
        if (!radio.checked) return;
        const serviceCode = radio.value;
        if (!serviceCode) return;
        //利用者表をサービス種類でフィルター
        this.filter("\u5229\u7528\u8005ID", new RegExp(serviceCode + '$'));
        //サービス種類のセレクトボックスを選択しておく
        try {
            await this.life.selectService(serviceCode);
        } catch (err) {
            (0, $1736a0e800540d33$export$2e2bcd8739ae039)(`${this.life.title}\u{3067}\u{306F}\u{3001}${this.life.services[serviceCode]} \u{3092}\u{9078}\u{629E}\u{3067}\u{304D}\u{307E}\u{305B}\u{3093}`, 'warning');
        }
    };
    /**
	 * テーブルのユーザー行がクリックされたときのイベントリスナー
	 * @param {Event} e - Table Rowがクリックされた際のイベント
	 */ _onUserRowSelect = async (e)=>{
        const tr = e.currentTarget;
        const life = this.life;
        const userid = new (0, $457097b8657e7022$export$3e09aba409ca88ca)(tr.dataset.id);
        const username = tr.dataset.name;
        const serviceCode = userid.serviceCode;
        //サービス種類を選択
        const currentService = life.currentService;
        if (currentService === null) {
            (0, $1736a0e800540d33$export$2e2bcd8739ae039)("\u5229\u7528\u8005\u3092\u9078\u629E\u3059\u308B\u524D\u306B\u3001\u5229\u7528\u8005\u30C6\u30FC\u30D6\u30EB\u3092\u30B5\u30FC\u30D3\u30B9\u7A2E\u985E\u3067\u7D5E\u308A\u8FBC\u3093\u3067\u304F\u3060\u3055\u3044\u3002", 'warning');
            return;
        } else if (currentService !== serviceCode) {
            (0, $1736a0e800540d33$export$2e2bcd8739ae039)("\u73FE\u5728\u9078\u629E\u3055\u308C\u3066\u3044\u308B\u30B5\u30FC\u30D3\u30B9\u3068\u3001\u5229\u7528\u8005\u306E\u30B5\u30FC\u30D3\u30B9\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002", 'error');
            return;
        }
        try {
            // life.selectUserが成功したら行を選択状態にする
            const userSelected = await life.selectUser(userid);
            if (userSelected) {
                tr.selectExclusively(true); // 自分だけ選択状態にする
                (0, $1736a0e800540d33$export$2e2bcd8739ae039)(`${username}\u{69D8}\u{306E}\u{9078}\u{629E}\u{304C}\u{5B8C}\u{4E86}\u{3057}\u{307E}\u{3057}\u{305F}`, 'success');
            } else {
                // ユーザーが見つからなかった
                tr.selectExclusively(false); // 自分含めすべての行を非選択状態にする
                (0, $1736a0e800540d33$export$2e2bcd8739ae039)(`${username}\u{69D8}\u{306E}\u{30C7}\u{30FC}\u{30BF}\u{306F}\u{898B}\u{3064}\u{304B}\u{308A}\u{307E}\u{305B}\u{3093}\u{3067}\u{3057}\u{305F}`);
            }
        } catch (err) {
            console.error("\u30E6\u30FC\u30B6\u30FC\u884C\u306E\u30AF\u30EA\u30C3\u30AF\u3067\u30B5\u30FC\u30D3\u30B9\u306F\u9078\u629E\u3055\u308C\u307E\u3057\u305F\u304C\u3001\u30C9\u30ED\u30C3\u30D7\u30C0\u30A6\u30F3\u306E\u9078\u629E\u306B\u5931\u6557\u3057\u307E\u3057\u305F", err);
            (0, $1736a0e800540d33$export$2e2bcd8739ae039)(`${userid}\u{306E}\u{9078}\u{629E}\u{306B}\u{5931}\u{6557}\u{3057}\u{307E}\u{3057}\u{305F}`, 'warning');
        }
    };
}
var $3a8ec0e263d79bdf$export$2e2bcd8739ae039 = $3a8ec0e263d79bdf$var$LifeUserTable;
/* @if ENV=development */ if (!window.toast) window.toast = (message)=>{
    alert(message);
};
window.LifeUserTable = $3a8ec0e263d79bdf$var$LifeUserTable; /* @endif */ 


(()=>{
    const CSS_SNIPPET = `
      /* root */
      html,body{
          /* \u{6700}\u{5F8C}\u{307E}\u{3067}\u{30B9}\u{30AF}\u{30ED}\u{30FC}\u{30EB}\u{3067}\u{304D}\u{306A}\u{3044}\u{554F}\u{984C}\u{3092}\u{89E3}\u{6C7A} */
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
      }
      /* header */
      .header-page{
          /* \u{6700}\u{4E0A}\u{90E8}\u{306E}\u{30CA}\u{30D3}\u{30B2}\u{30FC}\u{30B7}\u{30E7}\u{30F3}\u{3092}\u{30B9}\u{30AF}\u{30ED}\u{30FC}\u{30EB}\u{306B}\u{8FFD}\u{968F}\u{3055}\u{305B}\u{306A}\u{3044} */
          position: static !important;
      }
      /* rapper layouted */
      .app-component[_ngcontent-ng-c2883769184]{
          display: block !important;
      }
      .main-component{
          grid-area: none !important;
          margin-top: 0px !important;
      }  
      /* \u{30B3}\u{30F3}\u{30C6}\u{30CA}\u{30DC}\u{30C3}\u{30AF}\u{30B9} */
      .content-area{
          display: grid;
          grid-template-columns: 250px 1fr; /* \u{5DE6}300px\u{53F3}\u{53EF}\u{5909}\u{306B}\u{5206}\u{5272} */
      }
      /* \u{30EB}\u{30FC}\u{30C8}div */
      .feedback{
          margin-top: 0px;
          margin-left: 0px !important;
          width: auto !important;
          grid-column: 2;
      }
      /******************/
      /* \u{5229}\u{7528}\u{8005}ID\u{30C6}\u{30FC}\u{30D6}\u{30EB} */
      /* \u{3053}\u{306E}\u{30B9}\u{30BF}\u{30A4}\u{30EB}\u{306F}LifeUserTable#replaceCaption\u{306E}\u{8CAC}\u{52D9}\u{306B}\u{79FB}\u{884C}\u{3057}\u{307E}\u{3057}\u{305F} */
      /******************/

      `;
    function insertAdjacentCSS(snippet) {
        const style = document.createElement('style');
        style.textContent = snippet;
        document.documentElement.appendChild(style);
    }
    function main() {
        const life = new (0, $457097b8657e7022$export$4a03f2d02d318682)();
        const userTable = new (0, $3a8ec0e263d79bdf$export$2e2bcd8739ae039)(life);
        userTable.replaceCaption();
        const feedbackRoot = document.querySelector('tableau-viz').shadowRoot;
        //フィードバック操作オブジェクトを初期化
        insertAdjacentCSS(CSS_SNIPPET);
        // enhanceIframe(feedbackRoot);
        //consoleデバッグ用
        window.life = life;
        window.userTable = userTable;
    }
    main();
})();

})();
//# sourceMappingURL=main.js.map
