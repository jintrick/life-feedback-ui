class LifeFeedBackPage {
	// カスタム要素 > shadow-root > iframe > document以下を操作する責務を負う
	constructor() {
		const url = new URL(document.URL);
		if (url.hostname !== 'life-web.mhlw.go.jp') {
			throw new LifeError(`LifeFeedBackPage以外では初期化できません：${url.href}`, url);
		}
		this.ownerDocument = document;
		this.observeSrc(() => { // ページ遷移が起こったら……
			this.adjustStyle(); // スタイル調整
			this.#comboBoxes = null; // コンボボックスのキャッシュをクリア
			// 止めるには、this.disconnect()
		});
	}

	#SERVICES = {
		"52": "介護保健施設サービス", //介護保「健」のtypoがあるので、将来の訂正に注意！！
		"16": "通所リハ",
		"66": "介護予防通所リハ",
		"14": "訪問リハ",
		"64": "介護予防訪問リハ"
	};

	#STYLE_ELEMENT_ID = 'LifeFeedbackPage-style-2025-03-18';

	#intervalId = null; // this.observeSrcでコンテンツの遷移を監視するsetIntervalのID

	#comboBoxes = null; // サービス選択/ID選択用コンボボックスのキャッシュ

	get doc() { // フィードバックページのDocument
		// document.getElementById('tabZonId180');
		const shadowDoc = this.ownerDocument.querySelector('tableau-viz')
			?.shadowRoot.querySelector('iframe')
			?.contentDocument;
		if (!shadowDoc) {
			debugger;
			throw new LifeError(`シャドウDOMに到達できません`, this.ownerDocument);
		}
		return shadowDoc;
	}

	get style() { // 追加されたスタイル要素を取得
		const doc = this.doc;
		let style = doc.getElementById(this.#STYLE_ELEMENT_ID);
		if (!style)
			style = this.adjustStyle();
		return style;
	}

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

	get services() {
		return this.#SERVICES;
	}

	get title() { //フィードバックページのタイトル or undefined
		const el = this.doc.querySelector('.tabZone-title');
		if (!el) debugger;
		return el?.innerText;
	}

	get currentService() { //現在選択されているサービス種類のコードを返す or undefined
		const span = this.comboBoxes.services.querySelector('span.tabComboBoxName');

		if (!span) debugger;

		const foundKey = Object.keys(this.#SERVICES)
			.find(key => span.innerText.startsWith(this.#SERVICES[key]))
		if (foundKey)
			return foundKey;
	}

	get currentUserId() { //現在選択されているユーザーIDを返す or undefined
		const span = this.comboBoxes.users.querySelector('span.tabComboBoxName');

		if (!span) debugger;

		const text = span.innerText;
		if (/^\d{8}$/.test(text))
			return text;
	}

	get intervalId() {
		return this.#intervalId;
	}

	selectService(serviceCode) {
		return new Promise((resolve, reject) => {
			let serviceItem;
			const shadowDoc = this.doc;
			const getServiceItem = () => shadowDoc.querySelector(`a[title^="${this.#SERVICES[serviceCode]}"]`);
			if (this.currentService === serviceCode)
				resolve();
			//既にドロップダウンされていた場合は、サービスを選択して即解決！
			if (serviceItem = getServiceItem()) {
				serviceItem.click();
				resolve();
			}

			//ドロップダウン監視オブジェクトを初期化
			const observer = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					if (mutation.type !== 'childList') continue;
					serviceItem = getServiceItem();
					if (serviceItem) {
						serviceItem.click(); //クリックイベント発火でOK
						observer.disconnect();
						resolve();
						break;
					}
				}
			});

			// ドロップダウン監視を開始
			observer.observe(shadowDoc.body, { childList: true });
			try {
				// コンボボックスのイベントを発火
				this.comboBoxes.services.click();
			} catch (err) {
				observer.disconnect();
				// reject
				reject(new LifeError(
					"イベントの発火でエラーが生じたため、DOM監視を停止しました at LifeFeedBackPage#comboBoxes.services",
					this.comboBoxes.services));
			}
			// タイムアウト処理
			setTimeout(() => {
				observer.disconnect();
				// reject
				reject(new LifeError(
					`サービス(${serviceCode})の選択がタイムアウトしたため、DOM監視を停止しました at LifeFeedBackPage#doc`,
					shadowDoc
				));
			}, 2000);
		});
	}

	selectUser(userId) {
		return new Promise((resolve, reject) => {

			let userItem;
			const getUserItem = () => this.doc.querySelector(`a[title^="${userId}"]`);
			// 既に選択されていれば即解決
			if (this.currentUserId === userId)
				resolve();
			//既にドロップダウンされていた場合は、サービスを選択して解決！
			if (userItem = getUserItem()) {
				userItem.click();
				resolve();
			}

			// ドロップダウン監視オブジェクトを初期化
			const observer = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					if (mutation.type !== 'childList') continue;
					const userItem = getUserItem();
					if (userItem) {
						userItem.click(); //クリックイベント発火でOK
						observer.disconnect();
						//resolve
						return resolve();
					}
				}
			});
			// ドロップダウン監視を開始
			observer.observe(this.doc.body, { childList: true, subtree: true });

			try {
				// コンボボックスのイベントを発火
				this.comboBoxes.users.click();
			} catch (err) {
				observer.disconnect();
				// reject
				reject(new Error("イベントの発火でエラーが生じたため、DOM監視を停止しました", err));
			}
			// タイムアウト処理
			setTimeout(() => {
				observer.disconnect();
				// reject
				reject(new Error(`ユーザーID「${userId}」の選択がタイムアウトしたため、DOM監視を停止しました`));
			}, 2000);
		});
	}


	adjustStyle() {
		// #shadow-root以下のスタイルを微調整（cf.ユーザーテーブルのスタイル調整はLifeUserTableの責務）
		// 挿入した（あるいは既存の）style要素を返す
		const doc = this.doc;
		let style = doc.getElementById("this.#STYLE_ELEMENT_ID")
		if (style)
			return style;
		const CSS_SNIPPET = `
#dashboard-spacer{ /* iframe内部のレイアウト用div */
  /* reset */
  margin: 0 !important;
}`;
		style = doc.createElement('style');
		style.id = this.#STYLE_ELEMENT_ID;
		style.textContent = CSS_SNIPPET;
		doc.documentElement.appendChild(style);
		return style;
	}

	observeSrc(callback, intervalMs = 500) {
		//コンテンツのページ遷移を監視し、callback
		//iframe.contentWindow.location.hrefの変化を監視
		//setIntervalのIDを返す

		this.disconnect(); // 監視の重複を排除

		const iframe = this.ownerDocument.querySelector('tableau-viz')
			?.shadowRoot
			?.querySelector('iframe');
		if (!iframe) {
			debugger;
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

	disconnect() {
		// このクラスで管理しているsetIntervalをクリアする
		const id = this.#intervalId;
		if (id) {
			clearInterval(id);
			this.#intervalId = null;
		}
	}

}

class LifeComboBox {
	// コンボボックスの操作に関する責務を負う
	constructor(containerDiv, name) {
		this._container = containerDiv;
		this.doc = containerDiv.ownerDocument;
		this.name = name;
	}

	loadItems() { // will return NodeList [a, a, a, ...] or reject error
		const callback = (resolve, reject) => {
			const observer = new MutationObserver(mutations => {
				for (const m of mutations) {
					if (m.type !== 'childList') {
						debugger;
						continue;
					}
					const df = this.doc.createDocumentFragment();
					m.addedNodes.forEach(node => df.appendChild(node));

					const comboItems = df.querySelectorAll('a[title]');

					if (!comboItems.length) {
						debugger; //
						continue;
					}

					resolve(comboItems);
					break;
				}
			});
			//監視開始
			observer.observe(this.doc.body, { childList: true, subtree: true });
			try {
				this.click();
			} catch (err) {
				observer.disconnect();
				reject(new LifeError(
					`イベントの発火でエラーが生じたためDOM監視を停止しました at LFBP#comboBoxes.${this.name}`,
					this
				));
			}
			//タイムアウト処理
			setTimeout(() => {
				observer.disconnect();
				reject(new LifeError('ドロップダウン処理がタイムアウトしたためDOM監視を停止しました'));
			}, 1500);
		};
		return new Promise(callback);
	}

	click() {
		['mousedown', 'mouseup'].forEach(key => this._container.dispatchEvent(new MouseEvent(key)));
	}
}

class LifeError extends Error {
	constructor(message, faultyObject) {
		super(message);
		this.faultyObject = faultyObject;
		console.error(`${message}:`);
		console.error(faultyObject);
	}
}


window.LifeFeedBackPage = LifeFeedBackPage;
const life = new LifeFeedBackPage();