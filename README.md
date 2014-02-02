# jquery.smartpane

任意のブロック要素をページのスクロールに合わせて動かすjQuery plugin


## 使い方

以下のタグをHTML内に書く。

```html
<script src="//code.jquery.com/jquery.min.js"></script>
<script src="jquery.smartpane.min.js"></script>
```

スクロールに合わせて動かしたいブロック要素に、data-smartpane 属性を書く。

```html
<div data-smartpane="bottom">
```

指定できる値は以下の3つです。

- top
 - 画面上に張り付くように動きます。
- bottom
 - 画面下に張り付くように動きます。
- both
 - 下にスクロールするときは画面下に、上にスクロールするときは画面上に張り付くように動きます。

data-smartpane属性を指定する代わりに、jQueryのメソッドでも指定できます。

```javascript
$(function(){
    $('.side-block').smartpane('bottom');
});
```

ページ上部に固定表示されるヘッダーがある場合は、fixedHeaderメソッドでヘッダーのIDを指定してください。

```javascript
$.smartpane.fixedHeader('#headerId');
```

## 注意

- 要素のmarginや親要素のpaddingのことが考えられてません。
- スクロールの途中でpositionをfixedにするため、左側のカラムで使う場合は調整が必要です。

