const fs = require('fs')
const path = require('path')
const ROUTE_FOLDER = './routes'

module.exports = (app) => {
  fs.readdirSync(path.resolve(__dirname, ROUTE_FOLDER)).forEach((file) => {
    require(`${ROUTE_FOLDER}/${file}`)(app)
  })
}
