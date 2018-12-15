#!/usr/bin/env node

function findTwiceFrequency(
  list,
  previousFrequency = 0,
  sameFrequencies = new Set()
) {
  try {
    const lastFrenquency = list.reduce((currentFrequency, nextFrequency) => {
      const newFrenquency = currentFrequency + nextFrequency
      if (sameFrequencies.has(newFrenquency)) {
        throw newFrenquency
      }
      sameFrequencies.add(newFrenquency)
      return newFrenquency
    }, previousFrequency)

    return findTwiceFrequency(list, lastFrenquency, sameFrequencies)
  } catch (frenquency) {
    return frenquency
  }
}

const data = require('../utils/readInput')(__dirname)
const frequencies = data.map(d => parseInt(d.replace('+', ''), 10))
const result = findTwiceFrequency(frequencies)
console.log('Found same frequency', result)
