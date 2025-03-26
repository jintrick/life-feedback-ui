//import {LifeFeedBackPage} from './LifeFeedBackPage.js'
//カスタムスクリプトの文脈ではwindow.LifeFeedBackPageに事前にセットしておくとか。

function main(){
  const HTML_SNIPPET = `
    <style>
      label{
        display:block;
      }
      caption{
        text-align:left;
        line-height:1.5;
      }
      input[name="username"]{
        font-size: 1em;
        padding: 0.5em;
        margin-top: 0.5em;
      }
      small{
        color: gray;
      }
    </style>
    <fieldset>
      <legend>絞り込み</legend>
      <label>
        <input type="radio" name="filter" value="52">
        <span>入所 <small>[ID:******52]</small></span>
      </label>
      <label>
        <input type="radio" name="filter" value="16">
        <span>通所 <small>[ID******16]</small></span>
      </label>
      <label>
        <input type="radio" name="filter" value="66">
        <span>介護予防通所 <small>[ID:******66]</small></span>
      </label>
      <label>
        <input type="radio" name="filter" value="14">
        <span>訪問 <small>[ID:******14]</small></span>
      </label>
      <label>
        <input type="radio" name="filter" value="64">
        <span>介護予防訪問 <small>[ID:******64]</small></span>
      </label>
      <label>
        <input type="radio" name="filter" value="">
        <span>全サービス</span>
      </label>
      <label>
        <input type="text" name="username" placeholder="名前で絞り込み">
      </label>
    </fieldset>`;

  const d = document;
  const table = d.querySelector('table');
  const caption = d.createElement('caption');
  const life = new LifeFeedBackPage();

  caption.insertAdjacentHTML('afterbegin', HTML_SNIPPET);
  table.caption = caption;

  //radioボタンのchangeイベント
  caption.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change',e => {
      if (e.target.checked) {
        const serviceCode = radio.value
        //利用者表をサービス種類でフィルター
        table.filter('利用者ID', new RegExp(serviceCode + '$'));
        //「全サービス」が選択されたときは何もせず抜ける
        if (!serviceCode) return;
        //フィードバック操作オブジェクトを初期化
        const life = new LifeFeedBackPage();
        //サービス種類のセレクトボックスを選択しておく
        life.selectService(serviceCode).catch(err => {
          alert(`現在のフィードバックページでは、${life.services[serviceCode]} を選択できませんでした： ${life.title}`)
        });
      }
    });
  });

  //テキストフィールドのinputイベント
  caption.querySelector('input[name="username"]').addEventListener('input',e => {
    //利用者表を入力した氏名でフィルター
    table.filter('利用者氏名', new RegExp("^" + e.target.value));
  });

  //tr要素のクリックイベント
  table.querySelectorAll('tbody > tr').forEach(tr => {
    tr.addEventListener('click', async function(e){
      const userid = this.querySelector('td:first-child').innerText;
      const username = this.querySelector('td:last-child').innerText;
      const servicecode = userid.slice(-2);
      //フィードバック操作オブジェクトを初期化
      const life = new LifeFeedBackPage();
      //サービス種類を選択
      try {
        await life.selectService(servicecode);
      } catch (err) {
        alert(``)
        return;
      }
      life.selectUser(userid).catch(err => {
        navigator.clipboard.writeText(userid).then(() => {
          alert(`${username}様のデータは見つかりませんでしたが、IDをコピーしました。前方一致検索欄に貼り付けたのち、ドロップダウンを選択してください。`);
        }).catch((err) => {
          console.error("コピーに失敗しました");
        });
      });
    });
  });
}
