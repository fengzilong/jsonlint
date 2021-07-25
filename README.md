# jsonlint

[![Node.js CI status](https://github.com/fengzilong/jsonlint/workflows/Node.js%20CI/badge.svg)](https://github.com/fengzilong/jsonlint/actions) [![npm](https://img.shields.io/npm/v/@biu/jsonlint.svg)](https://www.npmjs.com/package/@biu/jsonlint)

lint your json, report all errors at once

<img align="center" width="400px" src="./screenshot.jpg" />

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
const lint = require( '@biu/jsonlint' )

lint( string, options )
```

### string

Type: `String`

json string

### options.reporter

Type: `String`

Default: `'pretty'`

Values: `'pretty' | 'json'`

If you use `json` reporter, the return value looks like:

```js
{
  source: '', // source code
  errors: [], // with keys: `{ line, column, message, severity }`
  comments: [], // with keys: `{ start: { line, column }, end: { line, column } }`
}
```

### options.silent

Type: `Boolean`

Default: `false`

By default it will log all errors to your console when using `pretty` reporter, if you want to disable this behavior, set `silent` to `true`

### options.allowComments

By default it will report comment errors(in standard json syntax, comments is not allowed), if you want comment errors to be ignored, set `allowComments` to `true`


# Why not try/catch + JSON.parse

`JSON.parse` is not fault tolerant, so it cannot continue after seeing first error, while we use a fault tolerant parser inside to avoid this situation

# License

MIT
