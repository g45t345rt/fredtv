import React from 'react'
import PropTypes from 'prop-types'
import { FiVolume2, FiVolume, FiVolumeX, FiVolume1 } from 'react-icons/fi'

import styles from './styles.module.css'

const VolumeControl = ({ volume, muted, onToggle, onSeek }) => {
  let icon = <FiVolume2 />
  if (volume < 0.5) icon = <FiVolume1 />
  if (volume < 0.1) icon = <FiVolume />
  if (muted) icon = <FiVolumeX />

  const height = volume * 100

  return <div className={styles.container}>
    <div onClick={onToggle} onMouseOver={() => {
      const seekContainer = document.getElementById('seekContainer')
      seekContainer.style.display = 'flex'
    }}>{icon}</div>
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

export default VolumeControl
