class LifeUserTable {
	/**
	 * 
	 * @param {LifeFeedBackPage} lifeFeedback 
	 */
	constructor(lifeFeedback) {
		const table = document.querySelector('table[role="table"]');
		if (!table)
			return null;
		this._table = table;
		this._filterStates = null;
		this.life = lifeFeedback;
		// lifeがiframeのsrcの変更を検知したときイベントを発行するので、そいつを捉えてViewを更新する
		this.life.addEventListener('src-loaded', e => {
			this.replaceCaption();
		});

		// 各ユーザー行 > イベントリスナーを登録
		// 各ユーザー行 > data-id, data-name, data-servicecode　属性を付与
		table.querySelectorAll('tbody > tr').forEach(tr => {

			const id = tr.querySelector('td:first-child').innerText;
			const name = tr.querySelector('td:last-child').innerText;
			const serviceCode = id.slice(-2);

			tr.addEventListener('click', this._onUserRowSelect);
			tr.setAttribute('data-id', id);
			tr.setAttribute('data-name', name);
			tr.setAttribute('data-servicecode', serviceCode);
		});

	}
	/**
	 * 
	 * @param {string} columnName - 列名
	 * @param {RegExp} regex - フィルターに使う正規表現
	 * @returns 
	 */
	filter(columnName, regex) {
		const self = this._table;

		const rows = self.rows;
		if (rows.length <= 1)
			return this;

		const headerRow = rows[0];
		const headers = Array.from(headerRow.cells).map(cell => cell.textContent.trim());
		const columnIndex = headers.indexOf(columnName);

		if (columnIndex === -1)
			throw new LifeError(`列 "${columnName}" が見つかりません`);

		// 各行のフィルター状態を記録するための Map
		self._filterStates = self._filterStates || new Map();

		// 現在のフィルターを保存
		self._filterStates.set(columnName, regex);

		Array.from(rows).slice(1).forEach(row => {
			// 全ての適用フィルターを確認
			let visible = true;
			for (const [col, reg] of self._filterStates.entries()) {
				const cellValue = row.cells[headers.indexOf(col)]?.textContent.trim() || "";
				if (!reg.test(cellValue)) {
					visible = false;
					break;
				}
			}
			row.style.display = visible ? 'table-row' : 'none';
		});
		return this;
	}

	replaceCaption() {
		const HTML_SNIPPET = `
		<style>
		/* ユーザーテーブルのルートdiv */
		.serviceUser-area{ 
			/* reset */
			position: static !important;
			width: auto !important;
			height: auto !important;
			
			grid-column: 1;
		}
		/* テーブルのコンテナdiv */
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
			/* セル共通 */
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
		/* 事業所番号と利用者は選択できません」を消す */
		app-feedback-check .careFacility-Id,
		app-feedback-check .notice{
			display: none;
		}
		
		/*******************************/
		/* ユーザースクリプトで挿入する要素 */
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
		<button class="goto-menu">フィードバックメニューに戻る</button>
		<fieldset>
		<legend>絞り込み</legend>
		<label>
		  <input type="radio" name="filter" value="52">
		  <span>入所 <small>[ID末尾52]</small></span>
		</label>
		<label>
		  <input type="radio" name="filter" value="16">
		  <span>通所 <small>[ID末尾16]</small></span>
		</label>
		<label>
		  <input type="radio" name="filter" value="66">
		  <span>介護予防通所 <small>[ID末尾66]</small></span>
		</label>
		<label>
		  <input type="radio" name="filter" value="14">
		  <span>訪問 <small>[ID末尾14]</small></span>
		</label>
		<label>
		  <input type="radio" name="filter" value="64">
		  <span>介護予防訪問 <small>[ID末尾64]</small></span>
		</label>
		<label>
		  <input type="text" name="username" placeholder="名前で絞り込み">
		</label>
		</fieldset>`;
		const doc = this._table.ownerDocument;
		const caption = doc.createElement('caption');
		caption.insertAdjacentHTML('afterbegin', HTML_SNIPPET);
		this._table.caption = caption;

		//各ラジオボタンをフィードバックと同期させ、イベントリスナをセット
		caption.querySelectorAll('input[name="filter"]').forEach(async (radio) => {

			// 現在のフィードバックページで無効なradioをdisabled
			const code_list = Object.keys(this.life.services(this.life.title));
			const serviceCode = radio.value;
			const label = radio.closest('label');

			if (code_list.includes(serviceCode)) {
				radio.disabled = false;
				label.classList.remove('disabled')
			} else {
				radio.disabled = true;
				label.classList.add('disabled');
				return;
			}

			//イベントリスナをセット
			radio.addEventListener('change', async (e) => {
				if (!radio.checked)
					return;
				//利用者表をサービス種類でフィルター
				this._table.filter('利用者ID', new RegExp(serviceCode + '$'));
				//「全サービス」が選択されたときは何もせず抜ける
				if (!serviceCode) return;
				//サービス種類のセレクトボックスを選択しておく
				try {
					await this.life.selectService(serviceCode);
				} catch (err) {
					toast(`${this.life.title}では、${this.life.services[serviceCode]} を選択できません`, 'warning');
				}
			});


		});

		//テキストフィールドのinputイベント
		caption.querySelector('input[name="username"]').addEventListener('input', e => {
			//利用者表を入力した氏名でフィルター
			this.filter('利用者氏名', new RegExp(`^${e.target.value}`));
		});

		//メニューに戻るボタンにイベントリスナをセット
		caption.querySelector('button.goto-mentu').addEventListener('click', e => {
			try {
				this.life.gotoMenu();
			} catch (err) {
				toast('メニューページのロードに失敗しました。LIFEの戻るボタンを探してください（下の方に隠れていることがあります）。', 'error');
			}
		});
	}

	/**
	 * 
	 * @param {Event} e - input[type="radio"] が選択された際のイベント
	 */
	_onServiceRadioSelect = async (e) => {
		const radio = e.currentTarget;
		if (!radio.checked)
			return;
		const serviceCode = radio.value;
		if (!serviceCode)
			return;
		//利用者表をサービス種類でフィルター
		this._table.filter('利用者ID', new RegExp(serviceCode + '$'));

		//サービス種類のセレクトボックスを選択しておく
		try {
			await this.life.selectService(serviceCode);
		} catch (err) {
			toast(`${this.life.title}では、${this.life.services[serviceCode]} を選択できません`, 'warning');
		}
	};

	/**
	 * テーブルのユーザー行がクリックされたときのイベントリスナー
	 * @param {Event} e - Table Rowがクリックされた際のイベント
	 * @returns 
	 */
	_onUserRowSelect = async (e) => {
		const tr = e.currentTarget;
		const userid = new LifeUserId(tr.dataset.id); //tr.querySelector('td:first-child').innerText;
		const username = tr.dataset.name; // tr.querySelector('td:last-child').innerText;
		const serviceCode = userid.serviceCode;

		//サービス種類を選択
		try {
			const serviceSelected = await this.life.selectService(serviceCode);
			if (!serviceSelected) {
				console.warn("ユーザー行のクリックでサービスが選択肢にありませんでした");
			}
		} catch (err) {
			console.error("ユーザー行のクリックでサービス選択中にエラーが生じました", err);
			return;
		}

		try {
			// life.selectUserが成功したら行を選択状態にする
			const userSelected = await this.life.selectUser(userid);
			if (userSelected) {
				tr.selectExclusively(); // 自分だけ選択状態にする
				toast(`${username}様の選択が完了しました`);
			} else {
				// ユーザーが見つからなかった
				tr.unselectAllSiblings(); // 自分含めすべての行を非選択状態にする
				toast(`${username}様のデータは見つかりませんでした`, 'warning');
			}

		} catch (err) {
			console.error("ユーザー行のクリックでサービスは選択されましたが、ドロップダウンの選択に失敗しました", err);
			toast(`${userid}の選択に失敗しました`, 'warning');
		}
	}

}

if (!window.toast) {
	window.toast = (message) => {
		alert(message);
	}
}

window.LifeUserTable = LifeUserTable;