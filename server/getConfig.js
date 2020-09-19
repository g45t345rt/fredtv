const fs = require('fs')
const path = require('path')

module.exports = () => {
  const data = fs.readFileSync(path.resolve('./config.json'))
  try {
    return JSON.parse(data)
  } catch (err) { }
  return {}
}
