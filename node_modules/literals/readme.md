# literals

module exports a function, which you call with an [acorn](https://npmjs.com/package/acorn) AST argument.

It returns an array of AST Literal objects.

```js
var literals = require('literals')
var acorn = require('acorn')

var ast = acorn.parse('var x = 1 * 2 + 3')

console.log(literals(ast))
```
