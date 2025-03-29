class LifeUserTable {
	constructor(){
		const table = document.querySelector('table[role="table"]');
		if (!table)
			return null;
		this._table = entityTable
		this._filterStates = null;
	}

	filter(columnName, regex) {
		const self = this._table;
	    if (!(regex instanceof RegExp))
	      throw new TypeError('第2引数は正規表現オブジェクトである必要があります');
	  
	    const rows = self.rows;
	    if (rows.length <= 1)
			return this;
	  
	    const headerRow = rows[0];
	    const headers = Array.from(headerRow.cells).map(cell => cell.textContent.trim());
	    const columnIndex = headers.indexOf(columnName);
	    
	    if (columnIndex === -1)
	      throw new Error(`列 "${columnName}" が見つかりません`);
	  
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

	replaceCaption(){
		const HTML_SNIPPET = `
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
		  <input type="radio" name="filter" value="">
		  <span>全サービス</span>
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
	        //イベントリスナをセット
	        radio.addEventListener('change', (e) => {
				if (!radio.checked)
					return;
				const serviceCode = radio.value
				//利用者表をサービス種類でフィルター
				this._table.filter('利用者ID', new RegExp(serviceCode + '$'));
				//「全サービス」が選択されたときは何もせず抜ける
				if (!serviceCode) return;
				//サービス種類のセレクトボックスを選択しておく
				life.initialize().selectService(serviceCode).catch(err => {
					alert(`現在のフィードバックページでは、${life.services[serviceCode]} を選択できませんでした： ${life.title}`)
				});
			});

	        //サービス選択メニューと同期（存在しないサービスは選択できないようにしておく）
			const comboBoxes = life.comboBoxes;
			if (comboBoxes) {
				try {
					const df = await comboBoxes.services.loadItems();
					const serviceName = life.services[radio.value];
					radio.disabled = !df.querySelector(`[title^="${serviceName}"`);
				} catch (err) {
					console.error(`ラジオボタンはサービス選択メニューとの同期に失敗しました（サービス種類コード：${radio.value}）`, err)
				}
			}
		});

		//テキストフィールドのinputイベント
		caption.querySelector('input[name="username"]').addEventListener('input', e => {
			//利用者表を入力した氏名でフィルター
			this.filter('利用者氏名', new RegExp("^${e.target.value}"));
		});
	}
}
