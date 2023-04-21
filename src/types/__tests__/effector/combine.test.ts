import {combine, createStore, DerivedStore, Store} from 'effector'

const typecheck = '{global}'

describe('combine cases (should pass)', () => {
  test('combine({R,G,B})', () => {
    const R = createStore(233)
    const G = createStore(88)
    const B = createStore(1)
    const store: DerivedStore<{R: number; G: number; B: number}> = combine({
      R,
      G,
      B,
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('combine([R,G,B])', () => {
    const R = createStore(233)
    const G = createStore(88)
    const B = createStore(1)
    const store: DerivedStore<[number, number, number]> = combine([R, G, B])
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('combine([Store<number>,Store<string>])', () => {
    const sn = createStore(0)
    const ss = createStore('')
    const store = combine([sn, ss]).map(([n, s]) => {
      n.toFixed // should have method on type
      s.charAt // should have method on type
      return null
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('combine({Color})', () => {
    const Color = createStore('#e95801')
    const store: DerivedStore<{Color: string}> = combine({Color})
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('combine([Color])', () => {
    const Color = createStore('#e95801')
    const store: DerivedStore<[string]> = combine([Color])
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test(`combine({R,G,B}, ({R,G,B}) => '~')`, () => {
    const R = createStore(233)
    const G = createStore(88)
    const B = createStore(1)
    const store: DerivedStore<string> = combine(
      {R, G, B},
      ({R, G, B}) =>
        '#' +
        R.toString(16).padStart(2, '0') +
        G.toString(16).padStart(2, '0') +
        B.toString(16).padStart(2, '0'),
    )
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test(`combine([R,G,B], ([R,G,B]) => '~')`, () => {
    const R = createStore(233)
    const G = createStore(88)
    const B = createStore(1)
    const store: DerivedStore<string> = combine(
      [R, G, B],
      ([R, G, B]) =>
        '#' +
        R.toString(16).padStart(2, '0') +
        G.toString(16).padStart(2, '0') +
        B.toString(16).padStart(2, '0'),
    )
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test(`combine([Store<number>,Store<string>], ([number,string]) => ...)`, () => {
    const sn = createStore(0)
    const ss = createStore('')
    const store = combine([sn, ss], ([n, s]) => {
      n.toFixed // should have method on type
      s.charAt // should have method on type
      return null
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test(`combine({Color}, ({Color}) => '~')`, () => {
    const Color = createStore('#e95801')
    const store: DerivedStore<string> = combine({Color}, ({Color}) => Color)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test(`combine([Color], ([Color]) => '~')`, () => {
    const Color = createStore('#e95801')
    const store: DerivedStore<string> = combine([Color], ([Color]) => Color)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test(`combine(Color, (Color) => '~')`, () => {
    const Color = createStore('#e95801')
    const store: DerivedStore<string> = combine(Color, Color => Color)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test(`combine(R,G,B, (R,G,B) => '~')`, () => {
    const R = createStore(233)
    const G = createStore(88)
    const B = createStore(1)
    const store: DerivedStore<string> = combine(
      R,
      G,
      B,
      (R, G, B) =>
        '#' +
        R.toString(16).padStart(2, '0') +
        G.toString(16).padStart(2, '0') +
        B.toString(16).padStart(2, '0'),
    )
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('combine(R,G,B)', () => {
    const R = createStore(233)
    const G = createStore(88)
    const B = createStore(1)
    const store: DerivedStore<[number, number, number]> = combine(R, G, B)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
  test('combine(Color)', () => {
    const Color = createStore('#e95801')
    const store: DerivedStore<[string]> = combine(Color)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      no errors
      "
    `)
  })
})

describe('error inference (should fail with number -> string error)', () => {
  test('combine({R,G,B})', () => {
    const R = createStore(233)
    const G = createStore(88)
    const B = createStore(1)
    //@ts-expect-error
    const store: DerivedStore<{R: string; G: string; B: string}> = combine({
      R,
      G,
      B,
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<{ R: number; G: number; B: number; }>' is not assignable to type 'DerivedStore<{ R: string; G: string; B: string; }>'.
        Types of property 'map' are incompatible.
          Type '{ <T>(fn: (state: { R: number; G: number; B: number; }, lastState?: T | undefined) => T): DerivedStore<T>; <T>(fn: (state: { R: number; G: number; B: number; }, lastState: T) => T, firstState: T): DerivedStore<...>; }' is not assignable to type '{ <T>(fn: (state: { R: string; G: string; B: string; }, lastState?: T | undefined) => T): DerivedStore<T>; <T>(fn: (state: { R: string; G: string; B: string; }, lastState: T) => T, firstState: T): DerivedStore<...>; }'.
            Types of parameters 'fn' and 'fn' are incompatible.
              Types of parameters 'state' and 'state' are incompatible.
                Type '{ R: number; G: number; B: number; }' is not assignable to type '{ R: string; G: string; B: string; }'.
      "
    `)
  })
  test('combine([R,G,B])', () => {
    const R = createStore(233)
    const G = createStore(88)
    const B = createStore(1)
    //@ts-expect-error
    const store: DerivedStore<[string, string, string]> = combine([R, G, B])
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<[number, number, number]>' is not assignable to type 'DerivedStore<[string, string, string]>'.
        Types of property 'map' are incompatible.
          Type '{ <T>(fn: (state: [number, number, number], lastState?: T | undefined) => T): DerivedStore<T>; <T>(fn: (state: [number, number, number], lastState: T) => T, firstState: T): DerivedStore<...>; }' is not assignable to type '{ <T>(fn: (state: [string, string, string], lastState?: T | undefined) => T): DerivedStore<T>; <T>(fn: (state: [string, string, string], lastState: T) => T, firstState: T): DerivedStore<...>; }'.
            Types of parameters 'fn' and 'fn' are incompatible.
              Types of parameters 'state' and 'state' are incompatible.
                Type '[number, number, number]' is not assignable to type '[string, string, string]'.
      "
    `)
  })
  test('combine({Color})', () => {
    const Color = createStore('#e95801')
    //@ts-expect-error
    const store: DerivedStore<{Color: number}> = combine({Color})
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<{ Color: string; }>' is not assignable to type 'DerivedStore<{ Color: number; }>'.
        Types of property 'map' are incompatible.
          Type '{ <T>(fn: (state: { Color: string; }, lastState?: T | undefined) => T): DerivedStore<T>; <T>(fn: (state: { Color: string; }, lastState: T) => T, firstState: T): DerivedStore<...>; }' is not assignable to type '{ <T>(fn: (state: { Color: number; }, lastState?: T | undefined) => T): DerivedStore<T>; <T>(fn: (state: { Color: number; }, lastState: T) => T, firstState: T): DerivedStore<...>; }'.
            Types of parameters 'fn' and 'fn' are incompatible.
              Types of parameters 'state' and 'state' are incompatible.
                Type '{ Color: string; }' is not assignable to type '{ Color: number; }'.
      "
    `)
  })
  test('combine([Color])', () => {
    const Color = createStore('#e95801')
    //@ts-expect-error
    const store: DerivedStore<[number]> = combine([Color])
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<[string]>' is not assignable to type 'DerivedStore<[number]>'.
        Types of property 'map' are incompatible.
          Type '{ <T>(fn: (state: [string], lastState?: T | undefined) => T): DerivedStore<T>; <T>(fn: (state: [string], lastState: T) => T, firstState: T): DerivedStore<T>; }' is not assignable to type '{ <T>(fn: (state: [number], lastState?: T | undefined) => T): DerivedStore<T>; <T>(fn: (state: [number], lastState: T) => T, firstState: T): DerivedStore<T>; }'.
            Types of parameters 'fn' and 'fn' are incompatible.
              Types of parameters 'state' and 'state' are incompatible.
                Type '[string]' is not assignable to type '[number]'.
      "
    `)
  })
  test(`combine({R,G,B}, ({R,G,B}) => '~')`, () => {
    const R = createStore(233)
    const G = createStore(88)
    const B = createStore(1)
    //@ts-expect-error
    const store: DerivedStore<number> = combine(
      {R, G, B},
      ({R, G, B}) =>
        '#' +
        R.toString(16).padStart(2, '0') +
        G.toString(16).padStart(2, '0') +
        B.toString(16).padStart(2, '0'),
    )
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<string>' is not assignable to type 'DerivedStore<number>'.
        Types of property 'map' are incompatible.
          Type '{ <T>(fn: (state: string, lastState?: T | undefined) => T): DerivedStore<T>; <T>(fn: (state: string, lastState: T) => T, firstState: T): DerivedStore<T>; }' is not assignable to type '{ <T>(fn: (state: number, lastState?: T | undefined) => T): DerivedStore<T>; <T>(fn: (state: number, lastState: T) => T, firstState: T): DerivedStore<T>; }'.
            Types of parameters 'fn' and 'fn' are incompatible.
              Types of parameters 'state' and 'state' are incompatible.
                Type 'string' is not assignable to type 'number'.
      "
    `)
  })
  test(`combine([R,G,B], ([R,G,B]) => '~')`, () => {
    const R = createStore(233)
    const G = createStore(88)
    const B = createStore(1)
    //@ts-expect-error
    const store: DerivedStore<number> = combine(
      [R, G, B],
      ([R, G, B]) =>
        '#' +
        R.toString(16).padStart(2, '0') +
        G.toString(16).padStart(2, '0') +
        B.toString(16).padStart(2, '0'),
    )
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<string>' is not assignable to type 'DerivedStore<number>'.
      "
    `)
  })
  test(`combine({Color}, ({Color}) => '~')`, () => {
    const Color = createStore('#e95801')
    //@ts-expect-error
    const store: DerivedStore<number> = combine({Color}, ({Color}) => Color)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<string>' is not assignable to type 'DerivedStore<number>'.
      "
    `)
  })
  test(`combine([Color], ([Color]) => '~')`, () => {
    const Color = createStore('#e95801')
    //@ts-expect-error
    const store: DerivedStore<number> = combine([Color], ([Color]) => Color)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<string>' is not assignable to type 'DerivedStore<number>'.
      "
    `)
  })
  test(`combine(Color, (Color) => '~')`, () => {
    const Color = createStore('#e95801')
    //@ts-expect-error
    const store: DerivedStore<number> = combine(Color, Color => Color)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<string>' is not assignable to type 'DerivedStore<number>'.
      "
    `)
  })
  test(`combine(R,G,B, (R,G,B) => '~')`, () => {
    const R = createStore(233)
    const G = createStore(88)
    const B = createStore(1)
    //@ts-expect-error
    const store: DerivedStore<number> = combine(
      R,
      G,
      B,
      (R, G, B) =>
        '#' +
        R.toString(16).padStart(2, '0') +
        G.toString(16).padStart(2, '0') +
        B.toString(16).padStart(2, '0'),
    )
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<string>' is not assignable to type 'DerivedStore<number>'.
      "
    `)
  })
  test('combine(R,G,B)', () => {
    const R = createStore(233)
    const G = createStore(88)
    const B = createStore(1)
    //@ts-expect-error
    const store: DerivedStore<[string, string, string]> = combine(R, G, B)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<[number, number, number]>' is not assignable to type 'DerivedStore<[string, string, string]>'.
      "
    `)
  })
  test('combine(Color)', () => {
    const Color = createStore('#e95801')
    //@ts-expect-error
    const store: DerivedStore<number> = combine(Color)
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<[string]>' is not assignable to type 'DerivedStore<number>'.
        Types of property 'map' are incompatible.
          Type '{ <T>(fn: (state: [string], lastState?: T | undefined) => T): DerivedStore<T>; <T>(fn: (state: [string], lastState: T) => T, firstState: T): DerivedStore<T>; }' is not assignable to type '{ <T>(fn: (state: number, lastState?: T | undefined) => T): DerivedStore<T>; <T>(fn: (state: number, lastState: T) => T, firstState: T): DerivedStore<T>; }'.
            Types of parameters 'fn' and 'fn' are incompatible.
              Types of parameters 'state' and 'state' are incompatible.
                Type '[string]' is not assignable to type 'number'.
      "
    `)
  })
})

test('possibly undefined store error message mismatch (should pass)', () => {
  const $vacancyField = createStore<{id: string} | null>(null)
  const $hasNotActiveFunnels = createStore<boolean>(true)

  const result = combine({
    hasNotActiveFunnels: $hasNotActiveFunnels,
    vacancyId: $vacancyField.map(v => {
      if (v) return v.id
    }),
  })

  const resultType: DerivedStore<{
    hasNotActiveFunnels: boolean
    vacancyId: string | undefined
  }> = result

  expect(typecheck).toMatchInlineSnapshot(`
    "
    Type 'DerivedStore<{ hasNotActiveFunnels: boolean; vacancyId: string | undefined; }>' is missing the following properties from type 'Store<{ hasNotActiveFunnels: boolean; vacancyId: string | undefined; }>': reset, on
    "
  `)
})

describe('support optional parameters of explicit generic type', () => {
  test('basic case (should pass)', () => {
    type I = {
      foo?: string | number
      bar: number
    }
    const $store = createStore<string | number>('')
    const $bar = createStore(0)
    const result = combine<I>({
      foo: $store,
      bar: $bar,
    })
    const resultType: DerivedStore<{
      foo?: string | number
      bar: number
    }> = result
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<I>' is missing the following properties from type 'Store<{ foo?: string | number | undefined; bar: number; }>': reset, on
      "
    `)
  })
  test('omit optional field (should pass)', () => {
    type I = {
      foo?: string | number
      bar: number
    }
    const $bar = createStore(0)
    const result: DerivedStore<I> = combine<I>({bar: $bar})
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<I>' is missing the following properties from type 'Store<I>': reset, on
      "
    `)
  })
  test('plain values support (should pass)', () => {
    type I = {
      foo?: string | number
      bar: number
    }
    const $bar = createStore(0)
    const result: DerivedStore<I> = combine<I>({
      foo: 0,
      bar: $bar,
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<I>' is missing the following properties from type 'Store<I>': reset, on
      "
    `)
  })
  /**
   * wide input is not supported because if you explicitly define desired type
   * then what's the point in passing more values?
   */
  test('wide input is not supported (should fail)', () => {
    type I = {
      foo?: string | number
      bar: number
    }
    const $bar = createStore(0)
    //@ts-expect-error
    const result = combine<I>({
      foo: 0,
      bar: $bar,
      baz: $bar,
    })
    expect(typecheck).toMatchInlineSnapshot(`
      "
      No overload matches this call.
        Overload 1 of 18, '(shape: { foo?: string | number | Store<string | number> | undefined; bar: number | Store<number>; }): DerivedStore<I>', gave the following error.
          Argument of type '{ foo: number; bar: DerivedStore<number>; baz: DerivedStore<number>; }' is not assignable to parameter of type '{ foo?: string | number | Store<string | number> | undefined; bar: number | Store<number>; }'.
            Object literal may only specify known properties, and 'baz' does not exist in type '{ foo?: string | number | Store<string | number> | undefined; bar: number | Store<number>; }'.
        Overload 2 of 18, '(shape: I): DerivedStore<{ foo?: string | number | undefined; bar: number; }>', gave the following error.
          Type 'Store<number>' is not assignable to type 'number'.
      "
    `)
  })
})

test('support plain values as well as stores', () => {
  const $bar = createStore(0)
  const result: DerivedStore<{foo: number; bar: number}> = combine({
    foo: 0,
    bar: $bar,
  })
  expect(typecheck).toMatchInlineSnapshot(`
    "
    Type 'DerivedStore<{ foo: number; bar: number; }>' is missing the following properties from type 'Store<{ foo: number; bar: number; }>': reset, on
    "
  `)
})

describe("#531 large unions doesn't brake combine", () => {
  test('infinite type', () => {
    type Currency =
      | 'usd'
      | 'eur'
      | 'cny'
      | 'uah'
      | 'byn'
      | 'thb'
      | 'rub'
      | 'azn'
      | 'kzt'
      | 'kgs'
      | 'uzs'
      | 'tzs'
      | 'kes'
      | 'zar'
      | 'ron'
      | 'mdl'
      | 'ils'
      | 'inr'
      | 'pln'
      | 'chf'
      | 'gbp'
    const initial = 'usd' as Currency
    const $currency = createStore(initial)
    const $result = combine({
      currency: $currency,
    })
    const $_: DerivedStore<{currency: Currency}> = $result
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<{ currency: Currency; }>' is missing the following properties from type 'Store<{ currency: Currency; }>': reset, on
      "
    `)
  })
  test('no any', () => {
    type Currency =
      | 'usd'
      | 'eur'
      | 'cny'
      | 'uah'
      | 'byn'
      | 'thb'
      | 'rub'
      | 'azn'
      | 'kzt'
      | 'kgs'
      | 'uzs'
      | 'tzs'
      | 'kes'
      | 'zar'
      | 'ron'
      | 'mdl'
      | 'ils'
      | 'inr'
      | 'pln'
      | 'chf'
      | 'gbp'
    const initial = 'usd' as Currency
    const $currency = createStore(initial)
    const $result = combine({
      currency: $currency,
    })
    //@ts-expect-error
    const $_: DerivedStore<{currency: number}> = $result
    expect(typecheck).toMatchInlineSnapshot(`
      "
      Type 'DerivedStore<{ currency: Currency; }>' is missing the following properties from type 'Store<{ currency: number; }>': reset, on
      "
    `)
  })
})
