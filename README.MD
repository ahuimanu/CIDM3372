# CIDM3372

CSS and JavaScript

## CSS

[CSS in Depth by Keith J. Grant](https://www.manning.com/books/css-in-depth)

[CSS Book code respository](https://github.com/CSSInDepth/css-in-depth)

### Chapters 1 - 3

Basics and Box Model

### Chapters 4 - 8

Mastering layout

#### Chapter 4 - Floats

Floats were originally intended to mimic text flowing around a container (usually an image).

They were the only viable tool for flexible layouts for a long time.

#### Chapter 5 - Flexbox

How containers allow for growing and shrinking.

#### Chapter 6 - Grid

Using grid to more precisely divide and specify page-wide layout.

#### Chapter 7 - Positioning

Within containers, further positioning of elements.

#### Chapter 8 - Responsive Design

Exercising more control over layout in response to viewport/device properties.

## JS

[JavaScript: The Definitive Guide, 7th Edition by David Flanagan](https://www.oreilly.com/library/view/javascript-the-definitive/9781491952016/)

[JS Book code repository](https://github.com/davidflanagan/jstdg7)

# Chapter 2 Basics and Running Code

Javascript is typically run within a browser as the browser hosts scripts.  Therefore, for basic coding, we have a few options:

* Create an HTML page an then code within it to use the browser
* Use the browser's [Developer Tools](https://developers.google.com/web/tools/chrome-devtools/) to run JS code in the console there
* Use [NodeJS](https://nodejs.org/en/)

I will demonstrate each.

## Language Basics: Lexical Structures

There are some JavaScript basics in terms of structure that are easy to work through.

### Comments

A comment is any content in a script or page that you don't have interpreted/read by the browser.  They are for documenting code and making notes.

``` javascript
// This is a single-line comment. 
/* This is also a comment */ 

/** 
  * This is a multi-line comment. The extra * characters at the start of 
  * each line are not a required part of the syntax; they just look cool! 
  */
```

### Literal Values

We can **hard code** values into our JS code as well

``` javascript
12 // The number twelve 
1.2 // The number one point two 
"hello world" // A string of text 
'Hi' // Another string 
true // A Boolean value 
false // The other Boolean value 
null // Absence of an object

```

