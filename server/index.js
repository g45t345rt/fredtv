const express = require('express')
const path = require('path')
const app = express()
const ffmpeg = require('fluent-ffmpeg')

const ffmpegPath = path.resolve('./ffmpeg/ffmpeg.exe')
ffmpeg.setFfmpegPath(ffmpegPath)
const ffprobePath = path.resolve('./ffmpeg/ffprobe.exe')
ffmpeg.setFfprobePath(ffprobePath)

const template = require('./template')
const setRoutes = require('./setRoutes')

const PORT = 8888

app.use(express.static(path.resolve('./public')))

setRoutes(app)

app.get('*', (req, res) => res.send(template()))

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
