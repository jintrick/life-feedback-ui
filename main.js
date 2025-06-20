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

    let elementObserver = null;
    const targetSelector = 'table[role="table"]' // ロードを待つ必要のある要素のセレクター

    let spaObserver = null;
    const targetPathName = '/feedback-check'; // ビルドを実行するパス

    function insertAdjacentCSS(snippet) {
        const style = document.createElement('style');
        style.textContent = snippet;
        document.documentElement.appendChild(style);
    }

    function waitForRequiredElement(callback) {
        // すでにロードされていればコールバックを実行して抜ける
        const element = document.querySelector(targetSelector);
        if (element) {
            callback();
            return;
        }
        // 既存のobserverがあれば切断
        if (elementObserver) {
            elementObserver.disconnect();
        }
        // MutationObserver定義
        elementObserver = new MutationObserver(() => {
            const element = document.querySelector(targetSelector);
            if (element) {
                callback();
                // ビルドが終わったら不要なobserverを切断
                elementObserver.disconnect();
                elementObserver = null;
            }
        });
        // 監視を開始
        elementObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function build() {

        insertAdjacentCSS(CSS_SNIPPET);

        const life = new LifeFeedBackPage();
        const userTable = new LifeUserTable(life);
        userTable.replaceCaption();

        // デバッグ用
        window.life = life;
        window.userTable = userTable;

    }

    function waitForPageTransition(callback) {
        // 実行時すでにURLが https://life-web.mhlw.go.jp/feedback-check ならビルドを実行して抜ける
        if (location.pathname === targetPathName) {
            callback(build);
            return;
        }

        // SPA遷移を監視
        spaObserver = new MutationObserver(() => {
            if (location.pathname === targetPathName) {
                callback(build);
                // ビルドが終わったら不要なobserverを切断
                spaObserver.disconnect();
                spaObserver = null;
            }
        });

        spaObserver.observe(document, {
            childList: true,
            subtree: true
        });
    }

    function main() {
        // 初期ページロード時の処理
        waitForPageTransition(() => waitForRequiredElement(build));
    }

    main();

})();
