import React from 'react'
import PropTypes from 'prop-types'
import { IoIosRefreshCircle } from 'react-icons/io'

import styles from './styles.module.css'

export default class Loading extends React.Component {
  render = () => {
    return <div className={styles.container}>
      <IoIosRefreshCircle className={styles.spin} />
    </div>
  }
}
