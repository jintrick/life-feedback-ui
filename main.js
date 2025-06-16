import { LifeFeedBackPage } from './LifeFeedBackPage.js'
import LifeUserTable from './LifeUserTable.js'

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
          position: static !important;
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
      /* ルートdiv */
      .feedback{
          margin-top: 0px;
          margin-left: 0px !important;
          width: auto !important;
          grid-column: 2;
      }
      /******************/
      /* 利用者IDテーブル */
      /* このスタイルはLifeUserTable#replaceCaptionの責務に移行しました */
      /******************/

      `

    function insertAdjacentCSS(snippet) {
        const style = document.createElement('style');
        style.textContent = snippet;
        document.documentElement.appendChild(style);
    }

    function main() {
        const life = new LifeFeedBackPage();
        const userTable = new LifeUserTable(life);
        userTable.replaceCaption();

        const feedbackRoot = document.querySelector('tableau-viz').shadowRoot;
        //フィードバック操作オブジェクトを初期化
        insertAdjacentCSS(CSS_SNIPPET);
        // enhanceIframe(feedbackRoot);

        //consoleデバッグ用
        window.life = life;
        window.userTable = userTable;

    }

    main();


})();
