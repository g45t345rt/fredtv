import React from 'react'
import PropTypes from 'prop-types'
import { FcSynchronize } from 'react-icons/fc'

import styles from './styles.module.css'

export default class Loading extends React.Component {
  render () {
    return <div className={styles.container}>
      <FcSynchronize className={styles.spin} />
      <span className={styles.loadingText}>loading...</span>
    </div>
  }
}
