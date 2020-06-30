import React from 'react'
import PropTypes from 'prop-types'
import { Base64 } from 'js-base64'

export default class Player extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        base64Path: PropTypes.string.isRequired
      })
    })
  }

  state = {
    path: null,
    currentTime: 0,
    currentTimeOffset: 0,
    duration: 0
  }

  componentDidMount = async () => {
    const base64Path = this.props.match.params.base64Path
    const path = Base64.decode(base64Path)

    try {
      const res = await fetch(`/api/metadata?path=${path}`)
      const metadata = await res.json()
      let duration = metadata.streams.find(s => s.codec_type === 'video').duration
      if (!this.duration || this.duration === 'N/A') {
        duration = metadata.format.duration
      }

      this.setState({ duration, path })

      this.player.addEventListener('timeupdate', this.onTimeUpdate)
    } catch {

    }
  }

  componentWillUnmount = () => {
    this.player.removeEventListener('timeupdate', this.onTimeUpdate)
  }

  onTimeUpdate = () => {
    const { currentTimeOffset } = this.state
    this.setState({ currentTime: this.player.currentTime + currentTimeOffset })
  }

  onSeek = (e) => {
    const { value } = e.target
    const { path } = this.state

    const seekTime = parseInt(value)
    this.setState({ currentTimeOffset: seekTime })
    this.player.src = `/api/video?path=${path}&seek=${seekTime}`
  }

  render = () => {
    const { duration, currentTime, path } = this.state
    if (!path) return null
    return <div>
      <video ref={(node) => (this.player = node)} playsInline controls width={600}>
        <source src={`/api/video?path=${path}`} type="video/mp4" />
      </video>
      <progress value={currentTime} max={duration} />
      <input type="range" min={0} max={duration} step={1} onMouseUp={this.onSeek} />
    </div>
  }
}
