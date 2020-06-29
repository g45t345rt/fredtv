import React from 'react'
import PropTypes from 'prop-types'

export default class Video extends React.Component {
  static propTypes = {
    match: PropTypes.objectOf({
      params: PropTypes.objectOf({
        path: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  state = {
    currentTime: 0,
    currentTimeOffset: 0,
    duration: 0
  }

  componentDidMount = async () => {
    const fPath = this.props.match.params.path
    const path = fPath.replace(/_/g, '\\')

    const res = await fetch(`/metadata?path=${path}`)
    const metadata = await res.json()
    let duration = metadata.streams.find(s => s.codec_type === 'video').duration
    if (!this.duration || this.duration === 'N/A') {
      duration = metadata.format.duration
    }

    this.setState({ duration })

    this.player.addEventListener('timeupdate', this.onTimeUpdate)
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
    const fPath = this.props.match.params.path
    const path = fPath.replace(/_/g, '\\')

    const seekTime = parseInt(value)
    this.setState({ currentTimeOffset: seekTime })
    this.player.src = `/video?path=${path}&seek=${seekTime}`
  }

  render = () => {
    const fPath = this.props.match.params.path
    const path = fPath.replace(/_/g, '\\')

    const { duration, currentTime } = this.state
    return <div>
      <video ref={(node) => (this.player = node)} playsInline controls width={600}>
        <source src={`/video?path=${path}`} type="video/mp4" />
      </video>
      <progress value={currentTime} max={duration} />
      <input type="range" min={0} max={duration} step={1} onMouseUp={this.onSeek} />
    </div>
  }
}
