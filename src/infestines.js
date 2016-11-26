export const curry2 = fn => function (x1, x2) {
  switch (arguments.length) {
    case 1:  return x2 => fn(x1, x2)
    default: return       fn(x1, x2)
  }
}

export const curry3 = fn => function (x1, x2, x3) {
  switch (arguments.length) {
    case 1:  return curry2((x2, x3) => fn(x1, x2, x3))
    case 2:  return             x3  => fn(x1, x2, x3)
    default: return                    fn(x1, x2, x3)
  }
}

export const curry4 = fn => function (x1, x2, x3, x4) {
  switch (arguments.length) {
    case 1:  return curry3((x2, x3, x4) => fn(x1, x2, x3, x4))
    case 2:  return curry2(    (x3, x4) => fn(x1, x2, x3, x4))
    case 3:  return                 x4  => fn(x1, x2, x3, x4)
    default: return                        fn(x1, x2, x3, x4)
  }
}

//

export function seq(x, ...fns) {
  let r = x
  for (let i=0, n=fns.length; i<n; ++i)
    r = fns[i](r)
  return r
}

export function seqPartial(x, ...fns) {
  let r = x
  for (let i=0, n=fns.length; r !== undefined && i<n; ++i)
    r = fns[i](r)
  return r
}

//

export const isObject = x => x ? x.constructor === Object : false
export const isArray = x => x ? x.constructor === Array : false

//

export const identicalU = (a, b) =>
  a === b && (a !== 0 || 1 / a === 1 / b) || a !== a && b !== b

//

export function whereEqU(t, o) {
  for (const k in t) {
    const bk = o[k]
    if (bk === undefined && !(k in o) || !acyclicEqualsU(t[k], bk))
      return false
  }
  return true
}

//

export function hasKeysOfU(t, o) {
  for (const k in t)
    if (!(k in o))
      return false
  return true
}

//

export const acyclicEqualsObject = (a, b) => whereEqU(a, b) && hasKeysOfU(b, a)

function acyclicEqualsArray(a, b) {
  const n = a.length
  if (n !== b.length)
    return false
  for (let i=0; i<n; ++i)
    if (!acyclicEqualsU(a[i], b[i]))
      return false
  return true
}

export function acyclicEqualsU(a, b) {
  if (identicalU(a, b))
    return true
  if (!a || !b)
    return false
  const c = a.constructor
  if (c !== b.constructor)
    return false
  switch (c) {
    case Array: return acyclicEqualsArray(a, b)
    case Object: return acyclicEqualsObject(a, b)
    default:
      if (typeof a.equals === "function")
        return a.equals(b)
      return false
  }
}

//

export function unzipObjIntoU(o, ks, vs) {
  for (const k in o) {
    if (ks) ks.push(k)
    if (vs) vs.push(o[k])
  }
}

export function keys(o) {const ks=[]; unzipObjIntoU(o, ks, null); return ks}
export function values(o) {const vs=[]; unzipObjIntoU(o, null, vs); return vs}

export function unzipObj(o) {
  const ks=[], vs=[]
  unzipObjIntoU(o, ks, vs)
  return [ks, vs]
}

export function zipObjPartialU(ks, vs) {
  const o = {}, n=Math.min(ks.length, vs.length)
  for (let i=0; i<n; ++i) {
    const v = vs[i]
    if (v !== undefined)
      o[ks[i]] = v
  }
  return o
}

//

export function mapPartialU(x2y, xs) {
  const ys = [], n=xs.length
  for (let i=0; i<n; ++i) {
    const y = x2y(xs[i])
    if (y !== undefined)
      ys.push(y)
  }
  return ys
}
