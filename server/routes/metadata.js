const ffmpeg = require('fluent-ffmpeg')
const util = require('util')

const ffprobe = util.promisify(ffmpeg.ffprobe)
module.exports = (app) => {
  app.get('/metadata', async (req, res) => {
    const { path } = req.query

    const metadata = await ffprobe(path)
    res.send(metadata)
  })
}
