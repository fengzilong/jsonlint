# jsonlint

[![Node.js CI status](https://github.com/fengzilong/jsonlint/workflows/Node.js%20CI/badge.svg)](https://github.com/fengzilong/jsonlint/actions)
![npm downloads](https://img.shields.io/npm/dm/@biu/jsonlint)
[![npm](https://img.shields.io/npm/v/@biu/jsonlint.svg)](https://www.npmjs.com/package/@biu/jsonlint)

# Features

- ⚔️ Lint all errors at once
- 🌈Human-friendly, intuitive message to stdout
- 🚀Smaller than ESLint

# Screenshot

<img align="center" width="500px" src="./screenshot.jpg" />

# Installation

For NPM users

```bash
npm i @biu/jsonlint
```

for yarn users

```bash
yarn add @biu/jsonlint
```

# API

```js
const { lint, format } = require( '@biu/jsonlint' )

const result = lint( string, options )
const prettied = format( result )

console.log( result.codeframe )
// or
// console.log( prettied )
```

`result` looks like

```js
{
  source: '', // source code
  errors: [], // with keys: `{ line, column, message, severity }`
  comments: [], // with keys: `{ start: { line, column }, end: { line, column } }`
  codeframe: '', // codeframe with error locations
}
```

`prettied` looks like [Screenshot](#screenshot)

You can log message to stdout by using `console.log( result.codeframe )` or `console.log( prettied )`

### string

Type: `String`

### options.allowComments

By default it will report comments as error, if you want to remove comment from errors, just set `allowComments` to `true`

# Difference with `try/catch + JSON.parse`

`JSON.parse` is not fault tolerant, so it cannot continue after seeing first error, while in this library we use a fault tolerant parser inside to avoid this situation

# License

MIT
