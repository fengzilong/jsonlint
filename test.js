const lint = require( './' )

test( 'lint', () => {
  const errors = lint( `
    {
      // hello
      "json": {
        "a": "value",
      },
      'b': 1
    }
  ` )

  expect( typeof errors ).toBe( 'string' )
} )

test( 'lint - reporter json', () => {
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
    reporter: 'json'
  } )

  expect( typeof result ).toBe( 'object' )
  expect( result.source ).toBe( string )
  expect( result.errors.length ).toBe( 3 )
  expect( result.comments.length ).toBe( 1 )
} )

test( 'lint - reporter json', () => {
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
    reporter: 'json',
    allowComments: true
  } )

  expect( typeof result ).toBe( 'object' )
  expect( result.source ).toBe( string )
  expect( result.errors.length ).toBe( 2 )
  expect( result.comments.length ).toBe( 1 )
} )
