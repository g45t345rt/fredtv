import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles.module.css'
import { isCodecSupported } from '../../shared/supported'
import Loading from './Loading'

import { BigPlayControl, FileNameControl, FullscreenControl, PlayControl, ProgressBarControl, TimeControl, VolumeControl } from './Controls'

let inactivityTimeout = null
export default class Player extends React.Component {
  static propTypes = {
    path: PropTypes.string.isRequired
  }

  state = {
    loading: false,
    currentTime: 0,
    currentTimeOffset: 0,
    duration: 0,
    playing: false,
    fullscreen: false,
    supported: false,
    volume: 1,
    lastVolume: 1,
    muted: false,
    inactive: false
  }

  componentDidMount = async () => {
    const { path } = this.props

    try {
      this.setState({ loading: true })
      const res = await fetch(`/api/metadata?path=${path}`)
      const metadata = await res.json()

      const supported = isCodecSupported(metadata)

      let duration = metadata.streams.find(s => s.codec_type === 'video').duration
      if (!this.duration || this.duration === 'N/A') {
        duration = metadata.format.duration
      }

      this.setState({ duration, path, loading: false, supported })

      this.player.addEventListener('timeupdate', this.onTimeUpdate)
      this.player.addEventListener('volumechange', this.onVolumeChange)
    } catch {
      this.setState({ loading: false })
    }
  }

  componentWillUnmount = () => {
    this.player.removeEventListener('timeupdate', this.onTimeUpdate)
    this.player.removeEventListener('volumeChange', this.onVolumeChange)
  }

  onTimeUpdate = () => {
    const { currentTimeOffset } = this.state
    this.setState({ currentTime: this.player.currentTime + currentTimeOffset })
  }

  onVolumeChange = () => {
    this.setState({ volume: this.player.volume })
  }

  togglePlay = () => {
    const { playing } = this.state
    if (playing) this.player.pause()
    if (!playing) this.player.play()

    this.setState({ playing: !playing })
  }

  render = () => {
    const { path } = this.props
    const { loading, duration, currentTime, playing, fullscreen, supported, muted, volume, inactive } = this.state
    if (loading) return <Loading />
    return <div ref={(node) => (this.parent = node)} onMouseMove={() => {
      if (inactivityTimeout) clearTimeout(inactivityTimeout)

      this.parent.style.cursor = 'default'
      this.setState({ inactive: false })

      inactivityTimeout = setTimeout(() => {
        this.parent.style.cursor = 'none'
        this.setState({ inactive: true })
      }, 5000)
    }}>
      <video ref={(node) => (this.player = node)} className={styles.video}>
        <source src={`/api/video?path=${path}`} type="video/mp4" />
      </video>
      <BigPlayControl playing={playing} onToggle={this.togglePlay} inactive={inactive} />
      {!inactive && <div className={styles.controls}>
        <div className={styles.container}>
          <PlayControl playing={playing} onToggle={this.togglePlay} />
          <ProgressBarControl currentTime={currentTime} duration={duration} onSeek={(seek) => {
            const newTime = (seek * duration) / 100

            if (!supported.video || !supported.audio) {
              this.setState({ currentTimeOffset: newTime })
              this.player.src = `/api/video?path=${path}&seek=${newTime}`
              if (playing) this.player.play()
            } else {
              this.player.currentTime = newTime
            }
          }}>
            <FileNameControl path={path} />
            <TimeControl currentTime={currentTime} />
          </ProgressBarControl>
          <VolumeControl muted={muted} volume={volume} onToggle={() => {
            if (muted) {
              this.player.volume = this.state.lastVolume
              this.player.muted = false
              this.setState({ muted: false })
            } else {
              this.setState({ lastVolume: volume })
              this.player.volume = 0
              this.player.muted = true
              this.setState({ muted: true })
            }
          }} onSeek={(seek) => {
            this.player.volume = seek
            this.setState({ lastVolume: seek })
          }} />
          <FullscreenControl fullscreen={fullscreen} onToggle={() => {
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
          }} />
        </div>
      </div>}
    </div>
  }
}

/*
const PlayControl = ({ playing, onToggle }) => {
  let icon = <FiPlay />
  if (playing) icon = <FiPause />
  return <div className={styles.play} onClick={onToggle}>
    {icon}
  </div>
}

PlayControl.propTypes = {
  playing: PropTypes.bool.isRequired,
  onToggle: PropTypes.func
}

const ProgressBarControl = ({ currentTime, duration, onSeek, children }) => {
  const width = (currentTime * 100) / duration
  return <div id="progressBar" onClick={(e) => {
    const progressBar = document.getElementById('progressBar')
    const rect = progressBar.getBoundingClientRect()
    const x = e.clientX - rect.left
    const seek = (x * 100) / rect.width

    if (onSeek) onSeek(seek)
  }} className={styles.progressBar}>
    <div className={styles.progress} style={{ width: `${width}%` }}></div>
    {children}
  </div>
}

ProgressBarControl.propTypes = {
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  onSeek: PropTypes.func,
  children: PropTypes.arrayOf(PropTypes.element)
}

const FullscreenControl = ({ fullscreen, onToggle }) => {
  let icon = <FiMaximize />
  if (fullscreen) icon = <FiMinimize />
  return <div className={styles.fullscreen} onClick={onToggle}>
    {icon}
  </div>
}

FullscreenControl.propTypes = {
  fullscreen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func
}

const TimeControl = ({ currentTime }) => {
  // https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss

  let hours = Math.floor(currentTime / 3600)
  let minutes = Math.floor((currentTime - (hours * 3600)) / 60)
  let seconds = Math.floor(currentTime - (hours * 3600) - (minutes * 60))

  if (hours < 10) hours = `0${hours}`
  if (minutes < 10) minutes = `0${minutes}`
  if (seconds < 10) seconds = `0${seconds}`

  return <div className={styles.time}>
    {`${hours}:${minutes}:${seconds}`}
  </div>
}

TimeControl.propTypes = {
  currentTime: PropTypes.number.isRequired
}

const FileNameControl = ({ path }) => {
  const fileName = path.replace(/^.*[\\\\/]/, '')
  return <div className={styles.fileName}>
    {fileName}
  </div>
}

FileNameControl.propTypes = {
  path: PropTypes.string.isRequired
}

const VolumeControl = ({ volume, muted, onToggle, onSeek }) => {
  let icon = <FiVolume2 />
  if (volume < 0.5) icon = <FiVolume1 />
  if (volume < 0.1) icon = <FiVolume />
  if (muted) icon = <FiVolumeX />

  const height = volume * 100

  return <div className={styles.volume}>
    <div onClick={onToggle} onMouseOver={() => {
      const seekContainer = document.getElementById('seekContainer')
      seekContainer.style.display = 'flex'
    }}>{icon}</div>
    <div className={styles.mouseGapFill}></div>
    <div id="seekContainer" style={{ display: 'none' }} className={styles.seekContainer} onMouseOut={(e) => {
      const seekContainer = document.getElementById('seekContainer')
      if (seekContainer.contains(e.relatedTarget)) return
      seekContainer.style.display = 'none'
    }}>
      <div id="seekBar" className={styles.seekBar} onClick={(e) => {
        const seekBar = document.getElementById('seekBar')
        const rect = seekBar.getBoundingClientRect()
        // substract by rect.height to reverse values and use abs to remove negative sign
        const y = Math.abs(e.clientY - rect.y - rect.height)
        const seek = (y * 1) / rect.height // format to percentage between 0-1
        if (onSeek) onSeek(seek)
      }}>
        <div className={styles.slider} style={{ height: `${height}%` }}></div>
      </div>
    </div>
  </div>
}

VolumeControl.propTypes = {
  volume: PropTypes.number.isRequired,
  muted: PropTypes.bool.isRequired,
  onToggle: PropTypes.func,
  onSeek: PropTypes.func
}

const BigPlay = ({ playing, onToggle, inactive }) => {
  let icon = <FiPlayCircle />
  if (playing) icon = <FiPauseCircle />

  if (inactive) return null
  return <div className={styles.bigPlay}>
    <div id="bigPlay" className={styles.button} onClick={onToggle}>{icon}</div>
  </div>
}

BigPlay.propTypes = {
  playing: PropTypes.bool.isRequired,
  inactive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func
}

*/