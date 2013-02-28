jquery.smartpane
================

任意のブロック要素をページのスクロールに合わせて動かすjQuery plugin


## 使い方

以下のタグをHTML内に書く。

    <script src="//code.jquery.com/jquery.min.js"></script>
    <script src="jquery.smartpane.min.js"></script>

スクロールに合わせて動かしたいブロック要素に、data-smartpane 属性を書く。

    <div id="right-column" data-smartpane="bottom">

指定できる値は以下の2つです。

* top
    * 画面上部に張り付くように動きます。
* bottom
    * 画面下部に張り付くように動きます。

