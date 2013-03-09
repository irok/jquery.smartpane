jquery.smartpane
================

任意のブロック要素をページのスクロールに合わせて動かすjQuery plugin


使い方
------

以下のタグをHTML内に書く。

    <script src="//code.jquery.com/jquery.min.js"></script>
    <script src="jquery.smartpane.min.js"></script>

スクロールに合わせて動かしたいブロック要素に、data-smartpane 属性を書く。

    <div data-smartpane="bottom">

指定できる値は以下の2つです。

* top
    * 画面上に張り付くように動きます。
* bottom
    * 画面下に張り付くように動きます。
* both
    * 下にスクロールするときは画面下に、上にスクロールするときは画面上に張り付くように動きます。

data-smartpane属性を指定する代わりに、jQueryのメソッドでも指定できます。

    <script>
    $(function(){
        $('.side-block').smartpane('both');
    });
    </script>


備考
----

要素のmarginや親要素のpaddingのことが考えられてません。
それらがなければうまく動きます。
