import { getLanguageService, TextDocument } from 'vscode-json-languageservice'
import * as colors from 'nanocolors'
import locate from './locate'

const jsonLanguageService = getLanguageService( {} )

jsonLanguageService.configure( {
  validate: true,
  schemas: [
    {
      uri: 'virtual://allow-comments.schema.json',
      fileMatch: [ '**/allow-comments/*' ],
      schema: {
        allowComments: true,
        allowTrailingCommas: false
      }
    },
    {
      uri: 'virtual://disallow-comments.schema.json',
      fileMatch: [ '**/disallow-comments/*' ],
      schema: {
        allowComments: false,
        allowTrailingCommas: false
      }
    },
  ]
} )

async function lint( text = '', options = {} ) {
  const { allowComments = false } = options

  const textDocument = TextDocument.create(
    // distinguish `allowComments` by path (which is pre-defined in fileMatch above)
    ( allowComments ? '/allow-comments/' : '/disallow-comments/' ) +
    Math.random() + '.json',
    'json',
    1,
    text
  )

  const jsonDocument = jsonLanguageService.parseJSONDocument( textDocument )

  const diagnostics = await jsonLanguageService.doValidation( textDocument, jsonDocument )

  const errors = extractErrors( diagnostics )

  const result = {
    source: text,
    errors,
    codeframe: getCodeFrame( text, errors ),
  }

  return result
}

function format( result = {} ) {
  const { codeframe } = result

  let out = []

  if ( result.errors.length > 0 ) {
    out.push( '\n' )
    const head = 'JSON Error: found ' +
      colors.red( colors.bold( result.errors.length ) ) + ' errors'
    out.push( head )
    out.push( '\n\n' )
    out.push( codeframe )
    out.push( '\n' )
  }

  return out.join( '' )
}

function extractErrors( diagnostics = [] ) {
  return diagnostics
    // filter error
    .filter( diagnostic => diagnostic.severity === 1 )
    .map( diagnostic => {
      return {
        line: diagnostic.range.start.line + 1,
        column: diagnostic.range.start.character + 1,
        message: diagnostic.message,
        severity: 'error',
      }
    } )
}

function getCodeFrame( text, errors ) {
  if ( errors.length === 0 ) {
    return ''
  }

  return locate( text, errors )
}

export {
  lint,
  format,
}
