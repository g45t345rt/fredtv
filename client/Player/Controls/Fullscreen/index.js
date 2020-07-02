import React from 'react'
import PropTypes from 'prop-types'
import { FiMaximize, FiMinimize } from 'react-icons/fi'

import styles from './styles.module.css'

const FullscreenControl = ({ fullscreen, onToggle }) => {
  let icon = <FiMaximize />
  if (fullscreen) icon = <FiMinimize />
  return <div className={styles.container} onClick={onToggle}>
    {icon}
  </div>
}

FullscreenControl.propTypes = {
  fullscreen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func
}

export default FullscreenControl
