import React from 'react'
import PropTypes from 'prop-types'
import { Base64 } from 'js-base64'

import { FiPlay, FiPause, FiMaximize, FiMinimize } from 'react-icons/fi'

import Loading from '../../Loading'
import styles from './styles.module.css'
import supported, { isCodecSupported } from '../../../shared/supported'

export default class Player extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        base64Path: PropTypes.string.isRequired
      })
    })
  }

  state = {
    loading: false,
    path: null,
    currentTime: 0,
    currentTimeOffset: 0,
    duration: 0,
    playing: false,
    fullscreen: false,
    supported: false
  }

  componentDidMount = async () => {
    const base64Path = this.props.match.params.base64Path
    const path = Base64.decode(base64Path)

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
    } catch {
      this.setState({ loading: false })
    }
  }

  componentWillUnmount = () => {
    this.player.removeEventListener('timeupdate', this.onTimeUpdate)
  }

  onTimeUpdate = () => {
    const { currentTimeOffset } = this.state
    this.setState({ currentTime: this.player.currentTime + currentTimeOffset })
  }

  render = () => {
    const { loading, duration, currentTime, path, playing, fullscreen, supported } = this.state
    if (loading) return <Loading />
    if (!path) return null

    return <div ref={(node) => (this.parent = node)}>
      <video ref={(node) => (this.player = node)} className={styles.video}>
        <source src={`/api/video?path=${path}`} type="video/mp4" />
      </video>
      <div className={styles.controls}>
        <div className={styles.container}>
          <PlayControl playing={playing} onToggle={() => {
            if (playing) this.player.pause()
            if (!playing) this.player.play()

            this.setState({ playing: !playing })
          }} />
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
      </div>
    </div>
  }
}

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
  children: PropTypes.element
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
