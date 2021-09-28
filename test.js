const { lint, format } = require( './' )

test( 'lint and format is defined', () => {
  expect( typeof lint ).toBe( 'function' )
  expect( typeof format ).toBe( 'function' )
} )

test( 'lint - basic', () => {
  const string = `
    {
      // hello
      "json": {
        "a": "value",
      },
      'b': 1
    }
  `
  const result = lint( string )

  expect( typeof result ).toBe( 'object' )
  expect( result.source ).toBe( string )
  expect( result.errors.length ).toBe( 3 )
  expect( result.comments.length ).toBe( 1 )
  expect( typeof result.codeframe ).toBe( 'string' )
  
  const formatted = format( result )
  expect( typeof formatted ).toBe( 'string' )
} )

test( 'lint - allowComments', () => {
  const string = `
    {
      // hello
      "json": {
        "a": "value",
      },
      'b': 1
    }
  `
  const result = lint( string, {
    allowComments: true
  } )
  
  expect( typeof result ).toBe( 'object' )
  expect( result.source ).toBe( string )
  expect( result.errors.length ).toBe( 2 )
  expect( result.comments.length ).toBe( 1 )
  expect( typeof result.codeframe ).toBe( 'string' )
} )
