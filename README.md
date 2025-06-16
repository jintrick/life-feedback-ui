# life-feedback-ui

このプロジェクトは、LIFEの利用者フィードバックのインターフェイスを改善するカスタムスクリプトを開発することを目的としています。

## 機能

- 利用者一覧のフィルター（実装済み）
- サービス種類の選択（実装済み）
- フィードバックメニューに戻るボタンの提供（実装済み）

## インストール方法

- Tampermonkeyスクリプトとして使う
- ブックマークレットとして使う
- コードスニペットとして使う
- Power Automate for Desktopのカスタムスクリプトとして使う

### Tampermonkeyスクリプトとして使う

1. Chrome拡張、Tampermonkeyをインストールします
2. ./dist/main.js の内容をコピーしてTampermonkeyスクリプトに登録します
3. LIFEフィードバックページを開きます

### ブックマークレットとして使う

※この方法はスクリプトサイズの肥大に伴い陳腐化しました

### コードスニペットとして使う

1. LIFEフィードバック参照ページにてDevtoolsを開きます
2. LifeUserTable.js, LifeFeedBackPage.js, ToastDiv.js, main.jsをそれぞれ……ソースタブでスニペットに追加します
3. それぞれを実行します（main.jsは最後に）

### Power Automate for Desktopのカスタムスクリプトとして使う

1. ExecuteScript.jsをダウンロードし、テキストエディタなどで開き、コードをコピーします
2. Poewr Automate for Desktopのフローアクション「WebページでJavascript関数を実行」にコピーしたコードを貼り付けます。この際、プレースホルダー的に入力されている関数は消して上書きします。
