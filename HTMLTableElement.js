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



