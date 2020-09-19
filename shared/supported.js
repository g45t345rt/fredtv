
const extensionsRegex = /\.(mp4|mkv|avi)/
const extensions = ['mp4', 'mkv', 'avi']
const codecs = {
  audio: ['aac', 'mp3', 'vorbis', 'opus'],
  video: ['h264', 'vp8', 'vp9']
}

const isCodecSupported = (metadata) => {
  const supported = {
    video: false,
    audio: false
  }

  const { streams } = metadata
  streams.forEach((stream) => {
    const { codec_type, codec_name } = stream
    if (codec_type === 'audio' && codecs.audio.includes(codec_name)) supported.audio = true
    if (codec_type === 'video' && codecs.video.includes(codec_name)) supported.video = true
  })

  return supported
}

module.exports = {
  extensionsRegex,
  extensions,
  codecs,
  isCodecSupported
}
