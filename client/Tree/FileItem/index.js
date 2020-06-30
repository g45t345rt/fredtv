import React from 'react'
import PropTypes from 'prop-types'
import { FcVideoFile } from 'react-icons/fc'
import { Base64 } from 'js-base64'

import styles from './styles.module.css'

export default class FileItem extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    }),
    fileItemActions: PropTypes.func
  }

  render = () => {
    const { data, fileItemActions } = this.props
    const { name, path } = data
    const base64Path = Base64.encode(path)
    return <div className={styles.container}>
      <FcVideoFile />
      <span>{name}</span>
      {fileItemActions &&
        <ul className={styles.actions}>
          {fileItemActions({ name, path, base64Path }).map((action) => <li key={action.key}>{action}</li>)}
        </ul>
      }
    </div>
  }
}
