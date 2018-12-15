#!/usr/bin/env node

function rectangleToCoordinates(width, height) {
  const coordinates = []
  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      coordinates.push([w, h])
    }
  }
  return coordinates
}

function claimsToCoordinates(xOffset, yOffset, width, height) {
  return rectangleToCoordinates(width, height).map(([w, h]) => [
    w + xOffset,
    h + yOffset,
  ])
}

function getNumberOfTwoOrMoreClaimes(listOfClaims) {
  const fabric = listOfClaims.reduce(
    (fabric, [xOffset, yOffset, width, height]) => {
      const coordinates = claimsToCoordinates(xOffset, yOffset, width, height)
      coordinates.forEach(c => {
        const cString = c.join('-')
        if (fabric[cString]) {
          fabric[cString]++
        } else {
          fabric[cString] = 1
        }
      })
      return fabric
    },
    {}
  )

  return Object.values(fabric).reduce(
    (twoOrMoreClaimes, numberOfClaims) =>
      numberOfClaims >= 2 ? twoOrMoreClaimes + 1 : twoOrMoreClaimes,
    0
  )
}

function getClaimes(rawClaimes) {
  const regex = /(\d+),(\d+): (\d+)x(\d+)/
  return rawClaimes.reduce((claimes, raw) => {
    const array = regex.exec(raw)
    if (array !== null) {
      const [, xOffset, yOffset, width, height] = array
      claimes.push([
        parseInt(xOffset, 10),
        parseInt(yOffset, 10),
        parseInt(width, 10),
        parseInt(height, 10),
      ])
    }
    return claimes
  }, [])
}

const data = require('../utils/readInput')(__dirname)
const claimes = getClaimes(data)
const result = getNumberOfTwoOrMoreClaimes(claimes)
console.log('Number of 2+ claimes', result)
