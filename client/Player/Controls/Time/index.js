import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles.module.css'

const TimeControl = ({ currentTime }) => {
  // https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss

  let hours = Math.floor(currentTime / 3600)
  let minutes = Math.floor((currentTime - (hours * 3600)) / 60)
  let seconds = Math.floor(currentTime - (hours * 3600) - (minutes * 60))

  if (hours < 10) hours = `0${hours}`
  if (minutes < 10) minutes = `0${minutes}`
  if (seconds < 10) seconds = `0${seconds}`

  return <div className={styles.container}>
    {`${hours}:${minutes}:${seconds}`}
  </div>
}

TimeControl.propTypes = {
  currentTime: PropTypes.number.isRequired
}

export default TimeControl
