import React from 'react'
import PropTypes from 'prop-types'
import { FiPlay, FiPause } from 'react-icons/fi'

import styles from './styles.module.css'

const PlayControl = ({ playing, onToggle }) => {
  let icon = <FiPlay />
  if (playing) icon = <FiPause />
  return <div className={styles.container} onClick={onToggle}>
    {icon}
  </div>
}

PlayControl.propTypes = {
  playing: PropTypes.bool.isRequired,
  onToggle: PropTypes.func
}

export default PlayControl
