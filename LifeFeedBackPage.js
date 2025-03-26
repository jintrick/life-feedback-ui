class LifeFeedBackPage {
	constructor() {
		const tableau = document.querySelector('tableau-viz');
		this.doc = !tableau? document : tableau.shadowRoot.querySelector('iframe').contentDocument;

		const url = new URL(this.doc.URL);
		if (url.hostname !== 'life-web.mhlw.go.jp' || url.pathname.slice(0, 15) !== '/tableau/views/') {
			throw new Error(`LifeFeedBackPage以外では初期化できません：${url.href}`);
		}

		const comboBoxes = this.doc.querySelectorAll('span[role="combobox"]');
		this.comboBoxes = {
			services: comboBoxes[0],
			users: comboBoxes[1]
		};
	}
	
	#SERVICES = {
		"52": "介護保健施設サービス", //介護保「健」のtypoがあるので、将来の訂正に注意！！
		"16": "通所リハ",
		"66": "介護予防通所リハ",
		"14": "訪問リハ",
		"64": "介護予防訪問リハ"
	};

	get services(){
		return this.#SERVICES;
	}

	get title(){
		return this.doc.querySelector('.tabZone-title')?.innerText;
	}

	get currentService(){ //現在選択されているサービス種類のコードを返す or undefined
		for (const span of this.doc.querySelectorAll('span')) {
			const foundKey = Object.keys(this.#SERVICES)
				.find(key => span.innerText.startsWith(this.#SERVICES[key]))
			if (foundKey) 
				return foundKey;
		}
	}

	get currentUserId(){ //現在選択されているユーザーIDを返す or undefined
		for (const span of this.doc.querySelectorAll('span')) {
			const text = span.innerText;
			if (/^\d{8}$/.test(text)) 
				return text;
		}
	}

	selectService(serviceCode) { return new Promise((resolve, reject) => {
		let serviceItem;
		const getServiceItem = () => this.doc.querySelector(`a[title^="${this.#SERVICES[serviceCode]}"]`);
		if (this.currentService === serviceCode)
			resolve();
		//既にドロップダウンされていた場合は、サービスを選択して即解決！
		if (serviceItem = getServiceItem()){
			serviceItem.click();
			resolve();
		}

		//ドロップダウンメニュー生成を監視する
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

		// DOM監視を開始
		observer.observe(this.doc.body, { childList: true });
		try {
			// コンボボックスのイベントを発火
			console.log('fire!! [comboBoxces.services]');
			['mousedown', 'mouseup'].forEach(key => {
				this.comboBoxes.services.dispatchEvent(new MouseEvent(key));
			});
		} catch (err) {
			observer.disconnect();
			reject(new Error("イベントの発火でエラーが生じたため、DOM監視を停止しました", err));
		}
		// タイムアウト処理
		setTimeout(() => {
			observer.disconnect();
			//reject
			reject(new Error(`サービス(${serviceCode})の選択がタイムアウトしたため、DOM監視を停止しました`));
		}, 2000);
	});}

	selectUser(userId) { return new Promise((resolve, reject) => {
		//will reject NotFoundError
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type !== 'childList') continue;
				const userItem = this.doc.querySelector(`a[title^="${userId}"]`);
				if (userItem) {
					userItem.click(); //クリックイベント発火でOK
					observer.disconnect();
					//resolve
					return resolve();
				}
			}
		});
		// DOM監視を監視
		observer.observe(this.doc.body, { childList: true, subtree: true });

		try{
			// コンボボックスのイベントを発火
			['mousedown', 'mouseup'].forEach(key => {
				this.comboBoxes.users.dispatchEvent(new MouseEvent(key));
			});
		} catch (err) {
			reject(new Error("イベントの発火でエラーが生じたため、DOM監視を停止しました", err));
		}
		// タイムアウト処理
		setTimeout(() => {
			observer.disconnect();

			//reject
			reject(new NotFoundError(`ユーザーID「${userId}」の選択がタイムアウトしました`));
		}, 2000);
	});}
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

window.LifeFeedBackPage = LifeFeedBackPage