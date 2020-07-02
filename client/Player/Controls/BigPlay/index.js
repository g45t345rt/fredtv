import React from 'react'
import PropTypes from 'prop-types'
import { FiPauseCircle, FiPlayCircle } from 'react-icons/fi'

import styles from './styles.module.css'

const BigPlayControl = ({ playing, onToggle, inactive }) => {
  let icon = <FiPlayCircle />
  if (playing) icon = <FiPauseCircle />

  if (inactive) return null
  return <div className={styles.container}>
    <div id="bigPlay" className={styles.play} onClick={onToggle}>{icon}</div>
  </div>
}

BigPlayControl.propTypes = {
  playing: PropTypes.bool.isRequired,
  inactive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func
}

export default BigPlayControl
