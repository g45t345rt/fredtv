import React from 'react'
import PropTypes from 'prop-types'

import FolderItem from './FolderItem'

export default class Tree extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    fileItemActions: PropTypes.func,
    onChange: PropTypes.func
  }

  render = () => {
    const { data, fileItemActions, onChange } = this.props
    return <FolderItem
      data={data}
      onChange={onChange}
      fileItemActions={fileItemActions} />
  }
}
