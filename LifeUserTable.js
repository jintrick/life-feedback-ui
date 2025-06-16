import { LifeFeedBackPage, LifeUserId, LifeError } from './LifeFeedBackPage.js';
import toast from './ToastDiv.js';

/**
 * FHD未満の環境では右側に隠れてしまっている利用者テーブルを左側に寄せて
 * 利用者選択用のGUIとして利用するためのラッパー（シングルトン）
 */
class LifeUserTable {
	/**
	 * 
	 * @param {LifeFeedBackPage} lifeFeedback 
	 */
	constructor(lifeFeedback) {
		const table = document.querySelector('table[role="table"]');
		if (!table) {
			throw new LifeError('table[role="table"]が見つからないため、LifeUserTableを初期化できません。');
		}
		this._table = table;
		this._filterStates = null;
		this.life = lifeFeedback;

		// LifeFeedBackPageがiframeのsrcの変更を検知したときイベントを発行するので、そいつを捉えてViewを更新する
		this.life.addEventListener('src-loaded', e => this.replaceCaption());

		// 各ユーザー行 > イベントリスナーを登録
		// 各ユーザー行 > data-id, data-name, data-servicecode　属性を付与
		table.querySelectorAll('tbody > tr').forEach(tr => {

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
			 */
			get() {
				return this.classList.contains('disabled');
			},
			/**
			 * @param {boolean} value - disabled
			 */
			set(value) {
				this.classList.toggle('disabled', value);
				Array.from(this.children).forEach(controller => {
					controller.disabled = value
				});
			}
		});

		/**
		 * テーブル行を排他的に選択する
		 * @param {boolean} select - true: 選択, false: 非選択（全解除）
		 */
		HTMLTableRowElement.prototype.selectExclusively = function (select) {
			const tbody = this.parentNode; // 誤ってthead/tfootでデータが定義されていてもOK

			// 万が一重複していたときのために、only-selectedクラスのtrを全部走査する
			tbody.querySelectorAll('tr.only-selected').forEach(row =>
				row.classList.remove('only-selected')
			);
			if (select)
				this.classList.add('only-selected');
		};

	}
	/**
	 * 
	 * @param {string} columnName - フィルター対象の列名
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

		// 各列のフィルター状態を記録するための Map
		self._filterStates = self._filterStates || new Map();

		// 現在の列フィルターを保存
		self._filterStates.set(columnName, regex);

		Array.from(rows).slice(1).forEach(row => {
			// すべての列フィルターを適用
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
	}
	/**
	 * 高機能Captionに置き換える
	 * 便宜上CaptionにViewコントローラーGUIを配置する
	 */
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
		<legend>利用者テーブルを絞り込む</legend>
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

		//各ラジオボタンをフィードバックと同期させ、イベントリスナーをセット
		const available_codes = Object.keys(this.life.availableServices);

		caption.querySelectorAll('input[name="filter"]').forEach(async (radio) => {
			// 現在のフィードバックページで無効なradioを「ラベルごと」disabled！
			const serviceCode = radio.value;
			const isServiceAvailable = available_codes.includes(serviceCode);
			radio.closest('label').disabled = !isServiceAvailable;
			if (isServiceAvailable)
				// ラジオボタンにイベントリスナーをセット
				radio.addEventListener('change', this._onServiceRadioSelect);
		});

		//ユーザー名の入力欄にイベントリスナーをセット
		caption.querySelector('input[name="username"]').addEventListener('input', this._onInputUserName);

		//メニューに戻るボタンにイベントリスナーをセット
		caption.querySelector('button.goto-menu').addEventListener('click', this._onClickGotoMenuButton);
	}
	/**
	 * ユーザーテーブルの本体の表示および属性を初期化（フィルター解除 + 行選択解除など）
	 */
	refreshBody() {
		const table = this._table;
		//フィルター解除
		table.tHead.querySelectorAll('td').forEach(td => {
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
	 */
	_onSrcLoaded = (e) => {
		this.replaceCaption();
		this.refreshBody();
	};
	/**
	 * メニューに戻るボタンがクリックされたときのイベントリスナー
	 * @param {Event} e - targetはbutton.goto-menu
	 */
	_onClickGotoMenuButton = (e) => {
		try {
			this.life.gotoMenu();
		} catch (err) {
			if (err instanceof LifeError) {
				toast('メニューページのロードに失敗しました。LIFEの戻るボタンを探してください（下の方に隠れていることがあります）。', 'error');
			} else {
				throw err;
			}
		}
	};
	/**
	 * ユーザー名入力欄に入力されたときのイベントリスナー
	 * @param {Event} e - targetはinput[name="username"]
	 */
	_onInputUserName = (e) => {
		//利用者表を氏名でフィルター
		this.filter('利用者氏名', new RegExp(`^${e.target.value}`));
	};
	/**
	 * サービス種類のラジオボタンが選択されたときのイベントリスナー
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
		this.filter('利用者ID', new RegExp(serviceCode + '$'));

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
	 */
	_onUserRowSelect = async (e) => {
		const tr = e.currentTarget;
		const life = this.life;
		const userid = new LifeUserId(tr.dataset.id);
		const username = tr.dataset.name;
		const serviceCode = userid.serviceCode;

		//サービス種類を選択
		const currentService = life.currentService;
		if (currentService === null) {
			toast('利用者を選択する前に、利用者テーブルをサービス種類で絞り込んでください。', 'warning');
			return;
		} else if (currentService !== serviceCode) {
			toast('現在選択されているサービスと、利用者のサービスが一致しません。', 'error');
			return;
		}
		try {
			// life.selectUserが成功したら行を選択状態にする
			const userSelected = await life.selectUser(userid);
			if (userSelected) {
				tr.selectExclusively(true); // 自分だけ選択状態にする
				toast(`${username}様の選択が完了しました`, 'success');
			} else {
				// ユーザーが見つからなかった
				tr.selectExclusively(false); // 自分含めすべての行を非選択状態にする
				toast(`${username}様のデータは見つかりませんでした`);
			}

		} catch (err) {
			console.error("ユーザー行のクリックでサービスは選択されましたが、ドロップダウンの選択に失敗しました", err);
			toast(`${userid}の選択に失敗しました`, 'warning');
		}
	};

}



export default LifeUserTable;

/* @if ENV=development */
if (!window.toast) {
	window.toast = (message) => {
		alert(message);
	}
}
window.LifeUserTable = LifeUserTable;
/* @endif */
