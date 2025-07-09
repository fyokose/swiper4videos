Marked - Markdown Parser
========================

[Marked] lets you convert [Markdown] into HTML.  Markdown is a simple text format whose goal is to be very easy to read and write, even when not converted to HTML.  This demo page will let you type anything you like and see how it gets converted.  Live.  No more waiting around.

How To Use The Demo
-------------------

1. Type in stuff on the left.
2. See the live updates on the right.

That's it.  Pretty simple.  There's also a drop-down option above to switch between various views:

- **Preview:**  A live display of the generated HTML as it would render in a browser.
- **HTML Source:**  The generated HTML before your browser makes it pretty.
- **Lexer Data:**  What [marked] uses internally, in case you like gory stuff like this.
- **Quick Reference:**  A brief run-down of how to format things using markdown.

Why Markdown?
-------------

## Button Command Examples

Click the buttons below to display videos or images on other clients:

<button width="15" command="show /www/a on 'presentation PC'"></button>
<button width="15" command="show image on tablet"></button>
<button width="15" command="show video on monitor1 from 00:30 until 02:15"></button>
<button width="15" command="show video on 'tablet A' from 01:00 with pause"></button>
<button width="15" command="show intro on display1 from 00:00 until 01:30 with pause"></button>
<button width="15" command="stop on presentationPC"></button>
<button command="invalid command"></button>
<button command="play video on monitor1"></button>
<button command="pause presentation PC"></button>

## Button Size Examples

Buttons with custom sizes (width and height in character units):

<button command="show sample video on presentation PC" width="5" height="1">短いボタン</button>
<button command="show product image on display tablet" width="15" height="2">2行のボタン</button>
<button command="show promotion video on monitor1" width="25" height="1">長いボタン</button>
<button command="stop presentation PC" width="10" height="1">停止</button>

## Text Overflow Examples

Buttons with text that overflows the specified size:

<button command="show sample video on presentation PC" width="5" height="1">とても長いテキストが入ったボタン</button>
<button command="show product image on display tablet" width="8" height="1">長いテキスト</button>
<button command="show promotion video on monitor1" width="12" height="2">このボタンは2行の高さで長いテキストを表示します</button>
<button command="stop presentation PC" width="3" height="1">停止ボタン</button>

It's easy.  It's not overly bloated, unlike HTML.  Also, as the creator of [markdown] says,

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

Ready to start writing?  Either start changing stuff on the left or
[clear everything](/demo/?text=) with a simple click.

[Marked]: https://github.com/markedjs/marked/
[Markdown]: http://daringfireball.net/projects/markdown/

| TH | TH |
| ---- | ---- |
| TD | TD |
| TD | TD |


