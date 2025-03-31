//import {*} from './prototyep.js'
//import {LifeFeedBackPage} from './LifeFeedBackPage.js'
//カスタムスクリプトの文脈ではwindow.LifeFeedBackPageに事前にセットしておくとか。

(() => {

   const CSS_SNIPPET = `
      /* root */
      html,body{
          /* 最後までスクロールできない問題を解決 */
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
      }
      /* header */
      .header-page{
          /* 最上部のナビゲーションをスクロールに追随させない */
          position: static !important; /* "fixed" fixed! */
      }
      /* rapper layouted */
      .app-component[_ngcontent-ng-c2883769184]{
          display: block !important;
      }
      .main-component{
          grid-area: none !important;
          margin-top: 0px !important;
      }  
      /* コンテナボックス */
      .content-area{
          display: grid;
          grid-template-columns: 250px 1fr; /* 左300px右可変に分割 */
      }
      .feedback{ /* ルートdiv */
          /* reset */
          margin-top: 0px;
          margin-left: 0px !important;
          width: auto !important;
          grid-column: 2;
      }
      /******************/
      /* 利用者IDテーブル */
      /******************/
      .serviceUser-area{ /* ルートdiv */
          /* reset */
          position: static !important;
          width: auto !important;
          height: auto !important;
          
          grid-column: 1;
      }
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
      caption{
        text-align:left;
        line-height:1.5;
      }`

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

   const CSS_SNIPPET_IFRAME = `
    
      #dashboard-spacer{ /* iframe内部のレイアウト用div */
          /* reset */
          margin: 0 !important;
      }`;



   function replaceCaption(snippet) {
      const table = document.querySelector('table');
      const caption = document.createElement('caption');
      const life = new LifeFeedBackPage();

      //HTML構築
      caption.insertAdjacentHTML('afterbegin', snippet);
      table.caption = caption;

      //各ラジオボタンをフィードバックと同期させ、イベントリスナをセット
      caption.querySelectorAll('input[name="filter"]').forEach(async (radio) => {
         //イベントリスナをセット
         radio.addEventListener('change', (e) => {
            if (e.target.checked) {
               const serviceCode = radio.value
               //利用者表をサービス種類でフィルター
               table.filter('利用者ID', new RegExp(serviceCode + '$'));
               //「全サービス」が選択されたときは何もせず抜ける
               if (!serviceCode) return;
               //サービス種類のセレクトボックスを選択しておく
               life.selectService(serviceCode).catch(err => {
                  alert(`現在のフィードバックページでは、${life.services[serviceCode]} を選択できませんでした： ${life.title}`)
               });
            }
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
         table.filter('利用者氏名', new RegExp("^" + e.target.value));
      });
   }

   function enhanceTable() {
      //利用者IDにクリックイベントを追加する（実際はその行全体）

      const table = document.querySelector('table');
      //既にイベントが定義されていたら抜ける（classで判定）
      const className = 'enhanced-by-mcc-sys'
      if (table.classList.contains(className))
         return;

      table.querySelectorAll('tbody > tr').forEach(tr => {
         tr.addEventListener('click', async function (e) {
            const userid = this.querySelector('td:first-child').innerText;
            const username = this.querySelector('td:last-child').innerText;
            const servicecode = userid.slice(-2);
            const life = new LifeFeedBackPage();
            //サービス種類を選択
            try {
               await life.selectService(servicecode);
            } catch (e) {
               console.error("ユーザー行のクリックでサービスが選択できませんでした", e)
               return;
            }
            try {
               await life.selectUser(userid);
            } catch (e) {
               console.error("ユーザー行のクリックでサービスは選択されましたが、ドロップダウンの選択に失敗しました", e);
               navigator.clipboard.writeText(userid).then(() => {
                  alert(`${username}様のデータは見つかりませんでしたが、IDをコピーしました。前方一致検索欄に貼り付けたのち、ドロップダウンを選択してください。`);
               }).catch((e) => {
                  alert(`${username}様のデータは見つかりませんでした。IDを手動でコピーして前方一致検索欄に貼り付けたのち、ドロップダウンを選択してください`);
                  console.error("コピー失敗", e)
               });
            }
         });
      });
      table.classList.add(className);

   }

   function enhanceIframe(shadowRoot) {
      //iframeの内容が変わるのを監視して、①CSSを挿入し直す、②frameset内をリフレッシュする
      let iframe;
      let intervalId;
      try {
         iframe = shadowRoot.querySelector('iframe');
         //初回のCSS挿入
         insertAdjacentCSS(iframe.contentDocument, CSS_SNIPPET_IFRAME);
         //iframeの内容が変化したときに実行するコールバック関数を仕込む（変化はインターバルで監視）
         intervalId = iframe.observeSrc(() => {
            insertAdjacentCSS(iframe.contentDocument, CSS_SNIPPET_IFRAME);
            replaceCaption(HTML_SNIPPET);
         });
      } catch (err) {
         clearInterval(intervalId);
      }
   }

   function insertAdjacentCSS(doc, snippet) {
      const style = doc.createElement('style');
      style.textContent = snippet;
      doc.documentElement.appendChild(style);
   }

   function main() {
      const userTable = new LifeUserTable();
      if (!userTable) {
         alert('ユーザーテーブルが見つかりません。')
         return;
      }
      userTable.replaceCaption();
      
      const feedbackRoot = document.querySelector('tableau-viz').shadowRoot;
      //フィードバック操作オブジェクトを初期化
      insertAdjacentCSS(document, CSS_SNIPPET);
      replaceCaption(HTML_SNIPPET);
      enhanceTable(userTable);
      enhanceIframe(feedbackRoot);
   }

   main();


})();
