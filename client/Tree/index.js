import React from 'react'
import PropTypes from 'prop-types'

import FolderItem from './FolderItem'

export default class Tree extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    fileItemActions: PropTypes.func
  }

  render = () => {
    const { data, fileItemActions } = this.props
    const { name, path, children } = data
    return <FolderItem name={name} path={path} items={children} fileItemActions={fileItemActions} />
  }
}
