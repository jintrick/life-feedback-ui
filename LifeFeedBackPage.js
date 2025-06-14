const FEEDBACK_N_SERVICE = Object.freeze({
	'科学的介護推進体制加算': Object.freeze(['52', '16', '66']),
	'栄養マネジメント強化加算・栄養アセスメント加算': Object.freeze(['52']),
	'口腔衛生管理加算': Object.freeze(['52']),
	'口腔機能向上加算': Object.freeze(['16', '66']),
	'個別機能訓練加算': Object.freeze([]), // 老健対象外
	'リハビリテーションマネジメント加算等': Object.freeze(['52', '16', '66', '14', '64']),
	'短期集中リハビリテーション実施加算': Object.freeze(['52']),
	'褥瘡マネジメント加算': Object.freeze(['52']),
	'排せつ支援加算': Object.freeze(['52']),
	'自立支援促進加算': Object.freeze(['52']),
	'ADL維持等加算': Object.freeze([]), // 老健対象外
	'個別機能・栄養・口腔': Object.freeze([]),
	'リハビリテーション・栄養・口腔': Object.freeze(['52', '16', '66', '14', '64'])
});

const SERVICE_N_LABEL = Object.freeze({
	"52": "介護保健施設サービス", //介護保「健」のtypoがあるので、将来の訂正に注意！！
	"16": "通所リハ",
	"66": "介護予防通所リハ",
	"14": "訪問リハ",
	"64": "介護予防訪問リハ"
});

/**
 * tableau-viz > shadow-root 以下を操作するビジネスロジックを担当するモデル
 */
class LifeFeedBackPage extends EventTarget {
	/**
	 * https://life-web.mhlw.go.jp ドメインでのみ初期化可能
	 */
	constructor() {
		super();
		const url = new URL(document.URL);
		if (url.hostname !== 'life-web.mhlw.go.jp') {
			throw new LifeError(`life-web.mhlw.go.jp 以外では初期化できません：${url.href}`, url);
		}
		this.ownerDocument = document;
		this.observeSrc(() => { // ページ遷移が起こったら……
			this.adjustStyle(); // スタイル調整
			this.#comboBoxes = null; // コンボボックスのキャッシュをクリア
			// イベントを発行。コントローラー側でこのクラスのインスタンスにaddEventListenerすること
			this.dispatchEvent(new Event('src-loaded'));
		});
	}

	#STYLE_ELEMENT_ID = 'LifeFeedbackPage-style-2025-03-18';

	#intervalId = null; // this.observeSrcでコンテンツの遷移を監視するsetIntervalのID

	#comboBoxes = null; // サービス選択/ID選択用コンボボックスのキャッシュ

	/**
	 * tableau-viz > #shadow-root > iframe > #document
	 * @return {Document} - フィードバックページ本体のDocument
	 */
	get doc() {
		const shadowDoc = this.iframe?.contentDocument;
		if (!shadowDoc) {
			throw new LifeError(`シャドウDOMに到達できません`, this.ownerDocument);
		}
		return shadowDoc;
	}

	get iframe() {
		return this.ownerDocument.querySelector('tableau-viz')
			?.shadowRoot.querySelector('iframe');
	}

	/**
	 * @return {HTMLStyleElement} - 追加したstyle要素
	 */
	get style() { // 追加されたスタイル要素を取得
		const doc = this.doc;
		let style = doc.getElementById(this.#STYLE_ELEMENT_ID);
		if (!style)
			style = this.adjustStyle();
		return style;
	}

	/**
	 * @return {object} - {services: <LifeComboBox>, users: <LifeComboBox>}
	 */
	get comboBoxes() {
		if (this.#comboBoxes)
			return this.#comboBoxes;

		let comboBoxes = this.doc.querySelectorAll('span[role="combobox"]');
		if (!comboBoxes.length)
			return null;
		comboBoxes = Array.from(comboBoxes);

		const servicesBox = comboBoxes[0];
		if (!servicesBox)
			throw new LifeError(`サービス種類コンボボックスの参照に失敗：`, this.doc);

		const usersBox = comboBoxes[1];
		if (!usersBox)
			throw new LifeError(`ユーザーIDコンボボックスの参照に失敗`, this.doc);

		comboBoxes = {
			services: new LifeComboBox(servicesBox, "services"),
			users: new LifeComboBox(usersBox, "users")
		};
		this.#comboBoxes = comboBoxes;
		return comboBoxes;
	}

	/**
	 * @returns {string|undefined} - フィードバックページのタイトル, ロード未完了時やフィードバックページ以外はundefined
	 */
	get title() {
		const el = this.doc.querySelector('.tabZone-title');
		return el?.innerText.split('利用者')[0].trim(); // 'フィードバック名\s?利用者フィードバック'
	}
	/**
	 * @return {string|undefined} - 事業所番号
	 */
	get careFacilityId() {
		const tableau = this.ownerDocument.querySelector('tableau-viz');
		return tableau?.querySelector('viz-parameter[name="自事業所番号"]')?.getAttribute('value');
	}
	/**
	 * @returns {string|undefined} - 現在選択されているサービス種類のコード, 未選択時undefined
	 */
	get currentService() {
		const span = this.comboBoxes.services.currentItem;

		if (!span) debugger;

		const foundKey = Object.keys(SERVICE_N_LABEL)
			.find(key => span.innerText.startsWith(SERVICE_N_LABEL[key]))
		return foundKey ? foundKey : null;
	}

	/**
	 * @retruns {LifeUserId|null} - 現在選択されているユーザーID, 未選択時null
	 */
	get currentUserId() {
		const span = this.comboBoxes.users.currentItem;

		if (!span) debugger;

		const text = span.innerText;
		try {
			return new LifeUserId(text);
		} catch (err) {
			return null;
		}
	}
	/**
	 * 指定したフィードバックが利用可能なサービス一覧を取得する { service_code: servive_label }
	 * @param {string|null} feedBackName - フィードバック名（"科学的介護推進体制加算"、etc.）
	 * @return {object} - {service_code: service_label, ..}
	 */
	services(feedBackName) {
		if (!feedBackName) return SERVICE_N_LABEL;

		const code_list = FEEDBACK_N_SERVICE[feedBackName];
		return Object.fromEntries(
			Object.entries(SERVICE_N_LABEL).filter(([key]) => code_list.includes(key))
		);
	}

	/**
	 * サービス種類の選択をエミュレートする
	 * @param {string} serviceCode 
	 * @returns {Promise<boolean>} - 選択の成否
	 */
	async selectService(serviceCode) {
		// 既にサービスが選択されていれば何もしない
		if (this.currentService === serviceCode)
			return true;

		let a; // クリックしたいターゲット要素

		// 既にドロップダウンしている場合（=> 稀だろう）
		const serviceName = SERVICE_N_LABEL[serviceCode];
		a = this.doc.querySelector('a[title^="${serviceName}"]');
		if (a) {
			a.click();
			return true;
		}
		// ドロップダウンしていなければアイテム達をロード
		const nl = await this.comboBoxes.services.loadItems();
		for (a of nl) {
			if (a.textContent.trim().startsWith(serviceName)) {
				a.click();
				return true;
			}
		}
		// サービスがドロップダウンに存在しなかったので、コンボボックスを畳む
		this.comboBoxes.services.collapseItems();
		return false;
	}

	/**
	 * 利用者（表示上はID）の選択をエミュレートする
	 * @param {LifeUserId} userId
	 * @returns {Promise<boolean>} - 選択の成否
	 */
	async selectUser(userId) {
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
		for (a of nl) {
			if (a.textContent.trim() == userId) {
				console.assert(a.textContent.trim() === userId.toString(), "==演算子でのuserIdの比較が失敗してるかも");
				a.click();
				return true;
			}
		}
		// ユーザーIDがドロップダウンに存在しなかったので、コンボボックスを畳む
		this.comboBoxes.users.collapseItems();
		return false;
	}

	/**
	 * #shadow-root以下のスタイルを微調整（cf.ユーザーテーブルのスタイル調整はLifeUserTableの責務）
	 * @returns {HTMLStyleElement} - 挿入した（あるいは既存の）style要素
	 */
	adjustStyle() {
		const doc = this.doc;
		let style = doc.getElementById("this.#STYLE_ELEMENT_ID")
		if (style)
			return style;
		const CSS_SNIPPET = `
#dashboard-spacer{ /* iframe内部のレイアウト用div */
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
	 */
	observeSrc(callback, intervalMs = 500) {
		// 監視の重複を排除
		this.disconnect();

		//iframe.contentWindow.location.hrefの変化を監視
		const iframe = this.ownerDocument.querySelector('tableau-viz')
			?.shadowRoot
			?.querySelector('iframe');
		if (!iframe) {
			throw new LifeError(`iframeを参照できません`, this.ownerDocument);
		}

		let lastUrl = iframe.contentWindow.location.href;

		const id = setInterval(() => {
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
	 */
	disconnect() {
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
	 */
	gotoMenu() {
		const careFacilityId = this.careFacilityId;
		if (!careFacilityId) {
			throw new LifeError('事業所番号の取得に失敗しました');
		}
		const url = `https://life-web.mhlw.go.jp/tableau/views/feedback_menu/sheet1?%3Alinktarget=_self&%3Aembed=yes&%E8%87%AA%E4%BA%8B%E6%A5%AD%E6%89%80%E7%95%AA%E5%8F%B7=${careFacilityId}&:customViews=no#1`;

		const iframe = this.iframe;
		if (!iframe) {
			throw new LifeError('iframeの参照に失敗しました');
		}
		iframe.src = url;
	}

}

/**
 * コンボボックスを抽象化
 * LifeFeedBackPage#comboBoxesで使用される
 */
class LifeComboBox {
	/**
	 * @param {HTMLSpanElement} containerDiv - LIFEのfuckin'フロントエンドが生成する謎のspan要素（コンボアイテムのコンテナ）
	 * @param {string} name - コンボボックスの名前（service, user, その他）
	 */
	constructor(containerDiv, name) {
		this._container = containerDiv;
		this.doc = containerDiv.ownerDocument;
		this.name = name;

	}

	/**
	 * @return {HTMLSpanElement} - 現在選択されているコンボアイテム
	 */
	get currentItem() {
		return this._container.querySelector('span.tabComboBoxName');
	}

	/**
	 * LIFEのfuckin'フロントエンドが生成するコンボアイテムのリスト
	 * まだDOMに存在していなければnull
	 * @returns {NodeList|null} - コンボアイテムを含むノードリスト[a, a, a, ...]。
	 */
	_getComboItems() {
		const nl = this.doc.querySelectorAll('a[title]');
		if (!nl.length) return null;
		return nl;
	}

	/**
	 * コンボアイテムをロードする
	 * @returns {Promise<NodeList>} - [a, a, a, ..]
	 */
	loadItems() { // will return NodeList [a, a, a, ...] or reject error
		const callback = (resolve, reject) => {
			const observer = new MutationObserver(mutations => {
				for (const m of mutations) {
					if (m.type !== 'childList') continue;

					const comboItems = this._getComboItems();

					if (!comboItems) continue;

					observer.disconnect();
					resolve(comboItems);
					break;
				}
			});
			//監視開始（body要素のlastChildあたりにコンボアイテムが出現するので、監視範囲が無駄に広くなる……）
			observer.observe(this.doc.body, { childList: true });
			try {
				this.click(); // クリックイベントを発生させるとコンボアイテムが生成され、observerがそれを捉える
			} catch (err) {
				observer.disconnect();
				reject(new LifeError(
					`イベントの発火でエラーが生じたためDOM監視を停止しました at LifeFeedBackPage#loadItems.${this.name}`,
					this
				));
			}
			//タイムアウト処理
			setTimeout(() => {
				observer.disconnect();
				// reject(new LifeError('ドロップダウン処理がタイムアウトしたためDOM監視を停止しました'));
			}, 1500);
		};
		return new Promise(callback);
	}

	/**
	 * コンボボックスを畳む
	 */
	collapseItems() {
		// isTrustedでほとんどのエミュレートを封じられているので、仕方なく最初のアイテムのclickを呼んでいる
		const comboItems = this._getComboItems(); // [a, a, a, ..]
		if (!comboItems) return;
		comboItems[0].click(); // a.click();は何故かisTrustedが解除されておりエミュレート可能
	}

	/**
	 * ユーザーのコンボボックス上におけるクリック動作をエミュレート
	 */
	click() {
		['mousedown', 'mouseup'].forEach(key => this._container.dispatchEvent(new MouseEvent(key, {
			bubbles: true,
			cancelable: true,
			view: window
		})));
	}
}

class LifeUserId {
	/**
	 * 
	 * @param {string} id_string - LIFE仕様のユーザーID（8桁）
	 */
	constructor(id_string) {
		if (/^\d{8}$/.test(id_string.trim()) === false) {
			throw new LifeError("不正なIDです。IDとして与えられた文字列: ", id_string);
		}
		this._idString = id_string;
	}

	toString() {
		return this._idString;
	}
	/**
	 * 
	 * @param {LifeUserId} userId 
	 * @returns {boolean} - 同一性
	 */
	equals(userId) {
		return this._idString === userId._idString;
	}
	/**
	 * IDのうち、サービス種類コードを除いた部分
	 */
	get userCode() {
		return this._idString.slice(0, 6);
	}
	/**
	 * サービス種類コードを抜き出す
	 */
	get serviceCode() {
		return this._idString.slice(-2);
	}
}

class LifeError extends Error {
	constructor(message, faultyObject) {
		super(message);
		this.faultyObject = faultyObject;
	}
}





window.LifeFeedBackPage = LifeFeedBackPage;
window.LifeUserId = LifeUserId;
