#!/usr/bin/env node

const data = require('../utils/readInput')(__dirname)
const frequencies = data.map(d => parseInt(d.replace('+', ''), 10))

const result = frequencies.reduce(
  (accFrequency, current) => accFrequency + current,
  0
)

console.log('Current frequency', result)
