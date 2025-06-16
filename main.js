//@@import { LifeFeedBackPage } from './LifeFeedBackPage.js'
//@@import LifeUserTable from './LifeUserTable.js'

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

    function waitForRequiredElement(callback) {

        // ロードを待つ必要のある要素のセレクター
        const targetSelector = 'table[role="table"]'

        // すでにロードされていればコールバックを実行して抜ける
        const element = document.querySelector(targetSelector);
        if (element) {
            callback();
            return;
        }
        // MutationObserver定義
        const observer = new MutationObserver(() => {
            const element = document.querySelector(targetSelector);
            if (element) {
                observer.disconnect();
                callback();
            }
        });
        // 監視を開始
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function main() {
        insertAdjacentCSS(CSS_SNIPPET);

        const life = new LifeFeedBackPage();
        const userTable = new LifeUserTable(life);
        userTable.replaceCaption();

        const feedbackRoot = document.querySelector('tableau-viz').shadowRoot;

        //consoleデバッグ用
        window.life = life;
        window.userTable = userTable;

    }

    waitForRequiredElement(callBack);

})();
