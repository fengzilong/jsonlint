import { lint, format } from '../lib'
import stripAnsi from 'strip-ansi'

test( 'lint and format is defined', () => {
  expect( typeof lint ).toBe( 'function' )
  expect( typeof format ).toBe( 'function' )
} )

test( 'lint - allowComments: false', async () => {
  const string = `
    {
      // hello
      "json": {
        "a": "value",
      },
      'b': 1
    }
  `
  const result = await lint( string )

  expect( typeof result ).toBe( 'object' )
  expect( result.source ).toBe( string )
  expect( result.errors.length ).toBe( 3 )
  expect( typeof result.codeframe ).toBe( 'string' )
  
  const formatted = format( result )
  expect( stripAnsi(formatted) ).toMatchInlineSnapshot(`
    "
    JSON Error: found 3 errors

     1:  
     2:     { 
     3:       // hello 
              ˜
              └─ ✖ Comments are not permitted in JSON.
     4:       "json": { 
     5:         "a": "value", 
                            ˜
                            └─ ✖ Trailing comma
     6:       }, 
     7:       'b': 1 
              ˜
              └─ ✖ Property keys must be doublequoted
     8:     } 
    "
  `)
} )

test( 'lint - allowComments: true', async () => {
  const string = `
    {
      // hello
      "json": {
        "a": "value",
      },
      'b': 1
    }
  `
  const result = await lint( string, {
    allowComments: true
  } )
  
  expect( typeof result ).toBe( 'object' )
  expect( result.source ).toBe( string )
  expect( result.errors.length ).toBe( 2 )
  expect( typeof result.codeframe ).toBe( 'string' )

  const formatted = format( result )
  expect( stripAnsi(formatted) ).toMatchInlineSnapshot(`
    "
    JSON Error: found 2 errors


     3:       // hello 
     4:       "json": { 
     5:         "a": "value", 
                            ˜
                            └─ ✖ Trailing comma
     6:       }, 
     7:       'b': 1 
              ˜
              └─ ✖ Property keys must be doublequoted
     8:     } 
    "
  `)
} )
