class LifeFeedBackPage {
	constructor() {
		this.initialize();
	}

	#SERVICES = {
		"52": "介護保健施設サービス", //介護保「健」のtypoがあるので、将来の訂正に注意！！
		"16": "通所リハ",
		"66": "介護予防通所リハ",
		"14": "訪問リハ",
		"64": "介護予防訪問リハ"
	};

	get comboBoxes() {
		const comboBoxes = this.doc.querySelectorAll('span[role="combobox"]');
		if (!comboBoxes.length) return null;
		return {
			services: new LifeComboBox(comboBoxes[0]),
			users: new LifeComboBox(comboBoxes[1])
		};
	}

	get services() {
		return this.#SERVICES;
	}

	get title() { //フィードバックページのタイトル or undefined
		return this.doc.querySelector('.tabZone-title')?.innerText;
	}

	get currentService() { //現在選択されているサービス種類のコードを返す or undefined
		for (const span of this.doc.querySelectorAll('span')) {
			const foundKey = Object.keys(this.#SERVICES)
				.find(key => span.innerText.startsWith(this.#SERVICES[key]))
			if (foundKey)
				return foundKey;
		}
	}

	get currentUserId() { //現在選択されているユーザーIDを返す or undefined
		for (const span of this.doc.querySelectorAll('span')) {
			const text = span.innerText;
			if (/^\d{8}$/.test(text))
				return text;
		}
	}

	initialize() {
		const tableau = document.querySelector('tableau-viz');
		this.doc = !tableau ? document : tableau.shadowRoot.querySelector('iframe').contentDocument;

		const url = new URL(this.doc.URL);
		if (url.hostname !== 'life-web.mhlw.go.jp' || url.pathname.slice(0, 15) !== '/tableau/views/') {
			throw new Error(`LifeFeedBackPage以外では初期化できません：${url.href}`);
		}

		return this;
	}

	selectService(serviceCode) {
		return new Promise((resolve, reject) => {
			let serviceItem;
			const getServiceItem = () => this.doc.querySelector(`a[title^="${this.#SERVICES[serviceCode]}"]`);
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
			observer.observe(this.doc.body, { childList: true });
			try {
				// コンボボックスのイベントを発火
				this.comboBoxes.services.click();
			} catch (err) {
				observer.disconnect();
				// reject
				reject(new Error("イベントの発火でエラーが生じたため、DOM監視を停止しました", err));
			}
			// タイムアウト処理
			setTimeout(() => {
				observer.disconnect();
				// reject
				reject(new Error(`サービス(${serviceCode})の選択がタイムアウトしたため、DOM監視を停止しました`));
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


}

class LifeComboBox {
	constructor(containerDiv) {
		this._container = containerDiv;
		this.doc = containerDiv.ownerDocument;
	}
	loadItems() { //will return DocumentFragement of Items, or reject
		const callback = (resolve, reject) => {
			const observer = new MutationObserver(mutations => {
				for (const m of mutations) {
					if (m.type !== 'childList') continue;
					const serviceItems = this.doc.querySelectorAll('a[title]'); //死んだノードリスト
					if (!serviceItems.length) continue;
					const df = this.doc.createDocumentFragment();
					serviceItems.forEach(item => df.appendChild(item));
					resolve(df);
					break;
				}
			});
			//監視開始
			observer.observe(this.doc.body, { childList: true });
			try {
				this.click();
			} catch (err) {
				observer.disconnect();
				reject(new Error('イベントの発火でエラーが生じたためDOM監視を停止しました'));
			}
			//タイムアウト処理
			setTimeout(() => {
				observer.disconnect();
				reject(new Error('ドロップダウン処理がタイムアウトしたためDOM監視を停止しました'));
			}, 1500);
		};
		return new Promise(callback);
	}
	click() {
		['mousedown', 'mouseup'].forEach(key => this._container.dispatchEvent(new MouseEvent(key)));
	}
}

window.LifeFeedBackPage = LifeFeedBackPage;