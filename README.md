# life-feedback-ui

このプロジェクトは、LIFEの利用者フィードバックのインターフェイスを改善するカスタムスクリプトを開発することを目的としています。

## 機能

- 利用者一覧のフィルター（実装済み）
- 利用者IDのコピー（未実装）

## インストール方法

- ブックマークレットとして使う
- Power Automate for Desktopのカスタムスクリプトとして使う

### ブックマークレットとして使う

1. scriptlet.txtをダウンロードし、中身をコピーします。
2. [お気に入り](edge://favorites/) を開きます。
3. お気に入りの追加、をクリックします
4. URLに、1でコピーしたスクリプトを貼り付けます。名前は例えば「LIFE利用者フィードバック++」などとしておきましょう
5. 保存、をクリックします
6. LIFEの利用者フィードバックページにて、右にスクロールすると利用者IDと利用者氏名のテーブルが表示されいるのを確認し、登録したブックマークをクリックします
7. 利用者IDの特定を助けるUIが生成されます

### Power Automate for Desktopのカスタムスクリプトとして使う

1. ExecuteScript.jsをダウンロードし、テキストエディタなどで開き、コードをコピーします
2. Poewr Automate for Desktopのフローアクション「WebページでJavascript関数を実行」にコピーしたコードを貼り付けます。この際、プレースホルダー的に入力されている関数は消して上書きします。