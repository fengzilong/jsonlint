const jsonService = require( 'vscode-json-languageservice' )
const chalk = require( 'chalk' )
const locate = require( './locate' )

const jsonServiceHandle = jsonService.getLanguageService( {} )

function lint( text = '', options = {} ) {
  const {
    reporter = 'pretty',
    silent = false,
    allowComments = false
  } = options

  const textDocument = jsonService.TextDocument.create(
    Math.random() + '.json',
    'json',
    1,
    text
  )

  const parsed = jsonServiceHandle.parseJSONDocument( textDocument )

  const errors = parsed.syntaxErrors || []
  const comments = parsed.comments || []

  const result = {
    source: text,
    errors: normalizeErrors( errors, allowComments ? [] : comments ),
    comments: normalizeComments( comments ),
  }

  if ( reporter === 'pretty' ) {
    const reported = prettyReport( text, result )

    if ( !silent && ( result.errors.length > 0 ) ) {
      console.log()
      console.log( chalk.dim( '-'.repeat( 32 ) ) )
      const head = 'JSON SyntaxError: found ' +
        chalk.red.bold( result.errors.length ) + ' errors'
      console.log( head )
      console.log( reported )
      console.log()
      console.log( chalk.dim( '-'.repeat( 32 ) ) )
    }

    return reported
  }

  if ( reporter === 'json' ) {
    return result
  }

  return result
}

function normalizeErrors( errors = [], comments = [] ) {
  return errors.map( error => {
    return {
      line: error.range.start.line + 1,
      column: error.range.start.character + 1,
      message: error.message,
      severity: 'error',
    }
  } ).concat(
    comments.map( comment => {
      return {
        line: comment.start.line + 1,
        column: comment.start.character + 1,
        message: 'Comment is not allowed',
        severity: 'error'
      }
    } )
  )
}

function normalizeComments( comments = [] ) {
  return comments.map( comment => {
    return {
      start: {
        line: comment.start.line + 1,
        column: comment.start.character + 1,
      },
      end: {
        line: comment.end.line + 1,
        column: comment.end.character + 1,
      },
    }
  } )
}

function prettyReport( text, { errors = [] } = {} ) {
  if ( errors.length === 0 ) {
    return ''
  }

  return locate( text, errors )
}

module.exports = lint
