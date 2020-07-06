const express = require('express')
const path = require('path')

const ffmpeg = require('fluent-ffmpeg')
const expressWebsocket = require('express-ws')

const template = require('./template')
const setRoutes = require('./setRoutes')

const ffmpegPath = path.resolve('./ffmpeg/ffmpeg.exe')
ffmpeg.setFfmpegPath(ffmpegPath)
const ffprobePath = path.resolve('./ffmpeg/ffprobe.exe')
ffmpeg.setFfprobePath(ffprobePath)

const app = express()
expressWebsocket(app)
const PORT = 8888

app.use(express.static(path.resolve('./public')))

setRoutes(app)

app.get('*', (req, res) => res.send(template()))

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
