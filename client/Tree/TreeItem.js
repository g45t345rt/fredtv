import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default class TreeItem extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    path: PropTypes.string,
    children: PropTypes.array,
    deep: PropTypes.number
  }

  static defaultProps = {
    deep: 0
  }

  render = () => {
    const { name, path, children, deep } = this.props
    if (!name) return null

    const ml = 5 * deep
    const isFile = children === undefined
    const isFolder = children !== undefined

    const fPath = path.replace(/\\/g, '_')
    return <div style={{ marginLeft: ml }}>
      {isFolder && <div>{name}</div>}
      {isFile && <div>
        <div>{name}</div>
        <Link to={`/player/${fPath}`}>player</Link>
        &nbsp;|&nbsp;
        <a href={`/video?path=${path}`}>file</a>
        &nbsp;|&nbsp;
        <a href={`/metadata?path=${path}`}>metadata</a>
      </div>}
      {children && children.map((item) => React.cloneElement(<TreeItem />, { ...item, deep: deep + 1, key: item.path }))}
    </div>
  }
}
