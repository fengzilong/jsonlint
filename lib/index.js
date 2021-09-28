const jsonService = require( 'vscode-json-languageservice' )
const colors = require( 'nanocolors' )
const locate = require( './locate' )

const jsonServiceHandle = jsonService.getLanguageService( {} )

function lint( text = '', options = {} ) {
  const { allowComments = false } = options

  const textDocument = jsonService.TextDocument.create(
    Math.random() + '.json',
    'json',
    1,
    text
  )

  const parsed = jsonServiceHandle.parseJSONDocument( textDocument )

  const comments = parsed.comments || []
  const errors = normalizeErrors(
    parsed.syntaxErrors || [],
    allowComments ? [] : comments
  )

  const result = {
    source: text,
    errors,
    comments: normalizeComments( comments ),
    codeframe: getCodeFrame( text, errors ),
  }

  return result
}

function format( result = {} ) {
  const { codeframe } = result

  let out = []

  if ( result.errors.length > 0 ) {
    out.push( '\n' )
    const head = 'JSON SyntaxError: found ' +
      colors.red( colors.bold( result.errors.length ) ) + ' errors'
    out.push( head )
    out.push( '\n\n' )
    out.push( codeframe )
    out.push( '\n' )
  }

  return out.join( '' )
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

function getCodeFrame( text, errors ) {
  if ( errors.length === 0 ) {
    return ''
  }

  return locate( text, errors )
}

exports.lint = lint
exports.format = format
