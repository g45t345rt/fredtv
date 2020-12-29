const ChromecastAPI = require('chromecast-api')
const client = new ChromecastAPI()

const send = (ws, type, id = null, value = null) => {
  const cmd = { type, id, value }
  if (ws.readyState === 1) ws.send(JSON.stringify(cmd))
}

const CAST_CMD_TYPES = [
  'refresh',
  'play',
  'pause',
  'resume',
  'stop',
  'seek',
  'seekTo',
  'setVolume',
  'changeSubtitles',
  'changeSubtitlesSize',
  'subtitlesOff',
  'close'
]

const validCastCMDTypes = (type) => CAST_CMD_TYPES.indexOf(type) !== -1

const onDeviceConnected = (ws, device) => {
  const { name } = device
  send(ws, 'connected', name)
}

const onDeviceFinished = (ws, device) => {
  const { name } = device
  send(ws, 'finished', name)
}

const onDeviceStatus = (ws, device, status) => {
  const { name } = device
  send(ws, 'status', name, status)
}

const registerDevice = (ws, device) => {
  const { name, friendlyName } = device
  device.on('connected', () => onDeviceConnected(ws, device))
  device.on('finished', () => onDeviceFinished(ws, device))
  device.on('status', (status) => onDeviceStatus(ws, device, status))

  send(ws, 'device', null, { name, friendlyName })
}

module.exports = (app) => {
  app.ws('/cast', (ws, req) => {
    client.devices.forEach((device) => registerDevice(ws, device))
    client.on('device', (device) => registerDevice(ws, device))

    ws.on('close', () => {
      client.devices.forEach((device) => device.removeAllListeners())
      client.removeAllListeners('device')
    })

    ws.on('message', (msg) => {
      const cmd = JSON.parse(msg)
      if (!validCastCMDTypes(cmd.type)) return

      if (cmd.type === 'refresh') return client.update()

      if (cmd.id) {
        const device = client.devices.find((device) => device.name === cmd.id)
        if (device) {
          try {
            if (Array.isArray(cmd.args)) device[cmd.type](...cmd.args, () => { })
            else device[cmd.type](cmd.args, () => { })
          } catch (err) {
            console.log(err)
          }
        }
      }
    })
  })
}
