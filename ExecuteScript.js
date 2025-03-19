function ExecuteScript() {



HTMLTableElement.prototype.filter = function(columnName, regex) {
    if (!(regex instanceof RegExp)) {
      throw new TypeError('第2引数は正規表現オブジェクトである必要があります');
    }
  
    const rows = this.rows;
    if (rows.length <= 1) return this;
  
    const headerRow = rows[0];
    const headers = Array.from(headerRow.cells).map(cell => cell.textContent.trim());
    const columnIndex = headers.indexOf(columnName);
    
    if (columnIndex === -1) {
      throw new Error(`列 "${columnName}" が見つかりません`);
    }
  
    // 各行のフィルター状態を記録するための Map
    this._filterStates = this._filterStates || new Map();
  
    // 現在のフィルターを保存
    this._filterStates.set(columnName, regex);
  
    Array.from(rows).slice(1).forEach(row => {
      // 全ての適用フィルターを確認
      let visible = true;
      for (const [col, reg] of this._filterStates.entries()) {
        const cellValue = row.cells[headers.indexOf(col)]?.textContent.trim() || "";
        if (!reg.test(cellValue)) {
          visible = false;
          break;
        }
      }
      row.style.display = visible ? 'table-row' : 'none';
    });
  
    return this;
  };
  
  
  function main(){
    const d = document;
    const HTML_INPUTS = `
    <style>
      label{
        display:block;
      }
      caption{
        text-align:left;
        line-height:1.5;
      }
    </style>
    <label>
      <input type="radio" name="filter" value="52">
      <span>入所</span>
    </label>
    <label>
      <input type="radio" name="filter" value="16">
      <span>通所</span>
    </label>
    <label>
      <input type="radio" name="filter" value="66">
      <span>通所（要支援）</span>
    </label>
    <label>
      <input type="radio" name="filter" value="">
      <span>フィルター解除</span>
    </label>
    `;

    const table = d.querySelector('table');
    const caption = d.createElement('caption');

    caption.insertAdjacentHTML('afterbegin', HTML_INPUTS);
    table.caption = caption;

    caption.querySelectorAll('input[name="filter"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          table.filter('利用者ID', new RegExp(radio.value + '$'))
        }
      });
    });
}

main();


}