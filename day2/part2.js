#!/usr/bin/env node

function distance(a, b) {
  if (a.length !== b.length) {
    throw new Error('Not same length')
  }
  if (a.length === 0) {
    return 0
  }
  if (a === b) {
    return 0
  }
  if (a[0] === b[0]) {
    return distance(a.slice(1), b.slice(1))
  }
  return 1 + distance(a.slice(1), b.slice(1))
}

function removeDifferentChar(a, b) {
  if (a.length !== b.length) {
    throw new Error('Not same length')
  }
  if (a.length === 0) {
    return ''
  }
  if (a === b) {
    return a
  }
  if (a[0] === b[0]) {
    return a[0] + removeDifferentChar(a.slice(1), b.slice(1))
  }
  return removeDifferentChar(a.slice(1), b.slice(1))
}

function elementOnListWithOneCharDifferent(list, currentElement) {
  if (list.length === 0) {
    return null
  }
  const d = distance(currentElement, list[0])
  if (d === 1) {
    return list[0]
  }
  return elementOnListWithOneCharDifferent(list.slice(1), currentElement)
}

const data = require('../utils/readInput')(__dirname)
try {
  data.forEach(element => {
    const result = elementOnListWithOneCharDifferent(data, element)
    if (result !== null) {
      throw [result, element]
    }
  })
} catch ([a, b]) {
  console.log('Result', removeDifferentChar(a, b))
}
