const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const util = require('util')
const { isCodecSupported } = require('../supported')

const ffprobe = util.promisify(ffmpeg.ffprobe)

const streamSupportedVideo = (ctx) => {
  const { req, res, metadata } = ctx

  const { path: filePath } = req.query
  const { range } = req.headers

  const { size: fileSize } = metadata.format

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunkSize = (end - start) + 1

    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4'
    }
    res.writeHead(206, head)
    fs.createReadStream(filePath, { start, end }).pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    }
    res.writeHead(200, head)
    fs.createReadStream(filePath).pipe(res)
  }
}

const trancodeUnsupportedVideo = (ctx) => {
  const { req, res, supported } = ctx
  const { path: filePath, seek = 0 } = req.query

  const head = {
    'Content-Type': 'video/mp4'
  }

  res.writeHead(200, head)

  ffmpeg()
    .on('error', function (err) {
      console.log('An error occurred: ' + err.message)
    })
    .on('progress', (chunk) => {
      console.log(chunk)
    })
    .input(filePath)
    .audioCodec(supported.audio ? 'copy' : 'aac')
    .videoCodec(supported.video ? 'copy' : 'libx264')
    .format('mp4')
    .seekInput(seek)
    .addOption('-preset ultrafast')
    .addOption('-crf 0')
    .addOption('-tune fastdecode')
    .addOption('-movflags', 'frag_keyframe+empty_moov')
    .pipe(res, { end: true })
}

module.exports = (app) => {
  app.get('/video', async (req, res) => {
    const { path } = req.query

    const metadata = await ffprobe(path)
    const supported = isCodecSupported(metadata)

    if (!supported.video || !supported.audio) {
      trancodeUnsupportedVideo({ req, res, metadata, supported })
    } else {
      streamSupportedVideo({ req, res, metadata })
    }
  })
}
