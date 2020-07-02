import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles.module.css'

const FileNameControl = ({ path }) => {
  const fileName = path.replace(/^.*[\\\\/]/, '')
  return <div className={styles.container}>
    {fileName}
  </div>
}

FileNameControl.propTypes = {
  path: PropTypes.string.isRequired
}

export default FileNameControl
