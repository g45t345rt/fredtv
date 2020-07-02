import React from 'react'
import PropTypes from 'prop-types'
import { FcSynchronize } from 'react-icons/fc'

import styles from './styles.module.css'

class PageLoading extends React.Component {
  render () {
    const { loading } = this.props
    if (!loading) return null
    return <div className={styles.container}>
      <FcSynchronize className={styles.spin} />
      <span className={styles.loadingText}>loading...</span>
    </div>
  }
}

PageLoading.propTypes = {
  loading: PropTypes.bool.isRequired
}

export default PageLoading
