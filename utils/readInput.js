const fs = require('fs')
const path = require('path')

module.exports = function(basePath = __dirname) {
  const data = fs.readFileSync(path.resolve(basePath, 'input.txt'))

  return data
    .toString()
    .split('\n')
    .filter(line => line !== '')
}
