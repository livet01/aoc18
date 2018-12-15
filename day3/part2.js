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

function getIdWithOnlyOneClaims(listOfClaims) {
  const fabric = listOfClaims.reduce(
    (fabric, [id, xOffset, yOffset, width, height]) => {
      const coordinates = claimsToCoordinates(xOffset, yOffset, width, height)
      coordinates.forEach(c => {
        const cString = c.join('-')
        if (!fabric[cString]) {
          fabric[cString] = []
        }
        fabric[cString].push(id)
      })
      return fabric
    },
    {}
  )

  const numberOfClaimsPerIds = Object.values(fabric).reduce(
    (numberOfClaimsPerId, idsOfClaims) => {
      idsOfClaims.forEach(id => {
        if (!numberOfClaimsPerId[id]) {
          numberOfClaimsPerId[id] = 1
        }
        if (idsOfClaims.length > 1) {
          numberOfClaimsPerId[id]++
        }
      })
      return numberOfClaimsPerId
    },
    {}
  )
  return Object.keys(numberOfClaimsPerIds).find(
    id => numberOfClaimsPerIds[id] === 1
  )
}

function getClaimesWithId(rawClaimes) {
  const regex = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/
  return rawClaimes.reduce((claimes, raw) => {
    const array = regex.exec(raw)
    if (array !== null) {
      const [, id, xOffset, yOffset, width, height] = array
      claimes.push([
        parseInt(id, 10),
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
const claimes = getClaimesWithId(data)
const result = getIdWithOnlyOneClaims(claimes)
console.log('ID with only one claims', result)
