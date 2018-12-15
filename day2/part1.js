#!/usr/bin/env node

const data = require('../utils/readInput')(__dirname)
const letterCount = data.map(d =>
  Array.from(d).reduce((store, char) => {
    store[char] = store[char] ? store[char] + 1 : 1
    return store
  }, {})
)

const result = letterCount.reduce(
  (counts, store) => {
    const values = Object.values(store)
    if (values.includes(2)) {
      counts.two++
    }
    if (values.includes(3)) {
      counts.three++
    }
    return counts
  },
  { two: 0, three: 0 }
)

console.log('Number of two:', result.two)
console.log('Number of three:', result.three)
console.log('Checksum', result.two * result.three)
