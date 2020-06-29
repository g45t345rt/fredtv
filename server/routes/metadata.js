const ffmpeg = require('fluent-ffmpeg')
const util = require('util')
const to = require('../../shared/to')

const ffprobe = util.promisify(ffmpeg.ffprobe)
module.exports = (app) => {
  app.get('/api/metadata', async (req, res, next) => {
    const { path } = req.query

    const [err, metadata] = await to(ffprobe(path))
    if (err) return next(err)

    res.send(metadata)
  })
}
