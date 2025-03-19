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