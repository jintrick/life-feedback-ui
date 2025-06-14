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
      /* このスタイルはLifeUserTable#replaceCaptionの責務に移行しました */
      /******************/

      `

    const CSS_SNIPPET_IFRAME = `
    
      #dashboard-spacer{ /* iframe内部のレイアウト用div */
          /* reset */
          margin: 0 !important;
      }`;
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
        const life = new LifeFeedBackPage();
        const userTable = new LifeUserTable(life);
        if (!userTable) {
            alert('ユーザーテーブルが見つかりません。')
            return;
        }
        userTable.replaceCaption();

        const feedbackRoot = document.querySelector('tableau-viz').shadowRoot;
        //フィードバック操作オブジェクトを初期化
        insertAdjacentCSS(document, CSS_SNIPPET);
        enhanceIframe(feedbackRoot);

        window.life = life;
        window.userTable = userTable;

    }

    main();


})();
