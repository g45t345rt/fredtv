import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles.module.css'

const ProgressBarControl = ({ currentTime, duration, onSeek, children }) => {
  const width = (currentTime * 100) / duration
  return <div id="progressBar" onClick={(e) => {
    const progressBar = document.getElementById('progressBar')
    const rect = progressBar.getBoundingClientRect()
    const x = e.clientX - rect.left
    const seek = (x * 100) / rect.width

    if (onSeek) onSeek(seek)
  }} className={styles.container}>
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

export default ProgressBarControl
