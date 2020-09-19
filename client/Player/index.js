import React from 'react'
import PropTypes from 'prop-types'
import { FiCast } from 'react-icons/fi'

import styles from './styles.module.css'
import { isCodecSupported } from '../../shared/supported'
import Loading from './Loading'

import { BigPlayControl, FileNameControl, FullscreenControl, PlayControl, ProgressBarControl, TimeControl, VolumeControl, ChromecastControl } from './Controls'

export default class Player extends React.Component {
  static propTypes = {
    path: PropTypes.string.isRequired
  }

  inactivityTimeout = null
  videoInterval = null

  state = {
    loading: false,
    currentTime: 0,
    duration: 0,
    playing: false,
    fullscreen: false,
    supported: false,
    volume: 1,
    lastVolume: 1,
    muted: false,
    inactive: false,
    showCast: false,
    castDevices: [],
    castingDevice: null,
    playbackRate: 1,
    castingDeviceStatus: null
  }

  componentDidMount = async () => {
    try {
      this.setState({ loading: true })
      await this.loadMetadata()
      this.setState({ loading: false })

      document.addEventListener('mousemove', this.handleInactivity)
      this.player.addEventListener('timeupdate', this.onTimeUpdate)
      this.registerCast()
    } catch {
      this.setState({ loading: false })
    }
  }

  componentWillUnmount = () => {
    if (this.inactivityTimeout) clearTimeout(this.inactivityTimeout)
    document.removeEventListener('mousemove', this.handleInactivity)
    this.player.removeEventListener('timeupdate', this.onTimeUpdate)
  }

  onTimeUpdate = () => {
    this.setState({ currentTime: this.player.currentTime })
  }

  loadMetadata = async () => {
    const { path } = this.props
    const res = await fetch(`/api/metadata?path=${path}`)
    const metadata = await res.json()

    const supported = isCodecSupported(metadata)

    let duration = metadata.streams.find(s => s.codec_type === 'video').duration
    if (!this.duration || this.duration === 'N/A') {
      duration = metadata.format.duration
    }

    this.setState({ duration, path, supported })
  }

  registerCast = () => {
    this.castDeviceSocket = new WebSocket(`ws://${window.location.host}/cast`)

    this.castDeviceSocket.addEventListener('open', (event) => {
      console.log(event)
    })

    this.castDeviceSocket.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data)
      const { type, id, value } = msg

      if (type === 'device') {
        this.setState({ castDevices: [...this.state.castDevices, msg.value] })
      }

      if (type === 'status') {
        const { castingDevice } = this.state
        if (castingDevice.name === id) {
          const { playerState, currentTime, playbackRate } = value
          this.setState({ currentTime })
          if (this.videoInterval) clearInterval(this.videoInterval)

          if (playerState === 'PLAYING') {
            this.videoInterval = setInterval(() => {
              this.setState({ currentTime: this.state.currentTime + playbackRate })
            }, playbackRate * 1000)
          }
        }
      }
    })

    this.castDeviceSocket.addEventListener('error', () => {
      if (this.videoInterval) clearInterval(this.videoInterval)
    })

    this.castDeviceSocket.addEventListener('close', (event) => {
      if (this.videoInterval) clearInterval(this.videoInterval)
    })
  }

  togglePlay = () => {
    const { playing, castingDevice } = this.state
    if (playing) {
      if (castingDevice) this.castToDevice({ type: 'pause' })
      else this.player.pause()
    } else {
      if (castingDevice) this.castToDevice({ type: 'resume' })
      else this.player.play()
    }

    this.setState({ playing: !playing })
  }

  toggleFullscreen = () => {
    const { fullscreen } = this.state
    if (!fullscreen) {
      try {
        this.parent.requestFullscreen()
        this.setState({ fullscreen: true })
      } catch (err) {
        console.log(err)
      }
    } else {
      document.exitFullscreen()
      this.setState({ fullscreen: false })
    }
  }

  refreshCast = () => {
    if (this.castDeviceSocket.readyState !== 1) return
    this.setState({ castDevices: [] })
    const cmd = JSON.stringify({ type: 'refresh' })
    this.castDeviceSocket.send(cmd)
  }

  castToDevice = (msg) => {
    const { castingDevice } = this.state
    if (this.castDeviceSocket.readyState !== 1 || !castingDevice) return
    const newMsg = { ...msg, id: castingDevice.name }
    const cmd = JSON.stringify(newMsg)
    this.castDeviceSocket.send(cmd)
  }

  getVideoUrl = ({ seek, absolute } = {}) => {
    const { path } = this.props
    let url = `/api/video?path=${path}`
    if (seek) url = `${url}&seek=${seek}`
    if (absolute) url = `${window.location.origin}${url}`
    return url
  }

  handleInactivity = () => {
    if (this.inactivityTimeout) clearTimeout(this.inactivityTimeout)

    const { inactive } = this.state
    if (inactive) {
      this.parent.style.cursor = 'default'
      this.setState({ inactive: false })
    } else {
      this.inactivityTimeout = setTimeout(() => {
        if (!this.state.playing) return // Don't hide on pause
        this.parent.style.cursor = 'none'
        this.setState({ inactive: true })
      }, 5000)
    }
  }

  toggleVolume = () => {
    const { muted, volume, castingDevice } = this.state
    if (muted) {
      this.setState({ muted: false, volume: this.state.lastVolume })

      if (castingDevice) {
        this.castToDevice({ type: 'setVolume', args: this.state.lastVolume })
      } else {
        this.player.volume = this.state.lastVolume
        this.player.muted = false
      }
    } else {
      this.setState({ lastVolume: volume, muted: true, volume: 0 })

      if (castingDevice) {
        this.castToDevice({ type: 'setVolume', args: 0 })
      } else {
        this.player.volume = 0
        this.player.muted = true
      }
    }
  }

  seekVolume = (seek) => {
    const { castingDevice } = this.state

    this.setState({ volume: seek })

    if (castingDevice) {
      this.castToDevice({ type: 'setVolume', args: seek })
    } else {
      this.player.volume = seek
    }
  }

  seekTime = (seek) => {
    const { duration, supported, playing, castingDevice } = this.state
    const seconds = (seek * duration) / 100

    if (!supported.video || !supported.audio) {
      const videoUrl = this.getVideoUrl({ seek: seconds })
      if (castingDevice) {
        this.castToDevice({ type: 'play', args: videoUrl })
      } else {
        this.player.src = videoUrl
        if (playing) this.player.play()
      }
    } else {
      if (castingDevice) {
        this.castToDevice({ type: 'seekTo', args: seconds })
      } else {
        this.player.currentTime = seconds
      }
    }

    this.setState({ currentTime: seconds })
  }

  cast = (device) => {
    const { supported, currentTime } = this.state
    this.setState({ castingDevice: device, playing: true }, () => {
      if (!supported.video || !supported.audio) {
        this.castToDevice({ type: 'play', args: this.getVideoUrl({ absolute: true, seek: currentTime }) })
      } else {
        this.castToDevice({
          type: 'play',
          args: [this.getVideoUrl({ absolute: true }), { startTime: currentTime }]
        })
      }
    })
  }

  render = () => {
    const { path } = this.props
    const { loading, duration, currentTime, playing, fullscreen, muted, volume, inactive, showCast, castingDevice } = this.state
    if (loading) return <Loading />
    return <div ref={(node) => (this.parent = node)}>
      <video ref={(node) => (this.player = node)} className={styles.video}>
        <source src={this.getVideoUrl()} type="video/mp4" />
      </video>
      {castingDevice && <div className={styles.castCover}>
        <FiCast className={styles.coverIcon} />
        <div className={styles.text}>Casting to Fred TV</div>
      </div>}
      <BigPlayControl playing={playing} onToggle={this.togglePlay} inactive={inactive} />
      {!inactive && <div className={styles.controls}>
        <div className={styles.container}>
          <PlayControl playing={playing} onToggle={this.togglePlay} />
          <ProgressBarControl currentTime={currentTime} duration={duration} onSeek={(seek) => this.seekTime(seek)}>
            <FileNameControl path={path} />
            <TimeControl currentTime={currentTime} />
          </ProgressBarControl>
          <VolumeControl muted={muted} volume={volume} onToggle={this.toggleVolume} onSeek={(seek) => this.seekVolume(seek)} />
          <ChromecastControl
            show={showCast}
            devices={this.state.castDevices}
            castingDevice={castingDevice}
            onRefresh={this.refreshCast}
            onToggle={() => this.setState({ showCast: !this.state.showCast })}
            onSelect={(device) => this.cast(device)}
            onStop={() => {
              this.castToDevice({ type: 'close' })
              this.setState({ castingDevice: null })
            }}
            onClose={() => this.setState({ showCast: false })} />
          <FullscreenControl fullscreen={fullscreen} onToggle={this.toggleFullscreen} />
        </div>
      </div>}
    </div>
  }
}
