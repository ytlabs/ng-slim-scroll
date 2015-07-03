## ng-slim-scroll

This project is AngularJS adaptation of [kamlekar's slim-scroll](https://github.com/venkateshwar/slim-scroll/) ,

All credits goes to [kamlekar](https://github.com/kamlekar). I have just tried to reimplement its work in angularjs.

## Demo

`demo.html` file contains example usage. [View demo](https://rawgit.com/ytlabs/ng-slim-scroll/master/index.html)

## Installation

```bash
$ bower install ng-slim-scroll
```

## Usage

1. Require `ng-slim-scroll.js` in your html file

```<script src="ng-slim-scroll.js"></script>```

2. Require base CSS style

  a. If you use less import `ng-slim-scroll.less` in your less file

  ```@import "ng-slim-scroll.less"```

  b. Else require `ng-slim-scroll.css` in your html file

  ```<link rel="stylesheet" href="ng-slim-scroll.css">```

3. Add module name 'ng-slim-scroll' to your apps dependencies

```js
var app = angular.module('yourApp', ['ngSlimScroll']);
```

4. Add `slim-scroll` or `data-slim-scroll` attribute to the element you want to add slim scroll

```<div data-slim-scroll data-options="options"> long long long text </div>```

If you want to provide options to slim scroll instance, as defined in original project, you can use options data field.



