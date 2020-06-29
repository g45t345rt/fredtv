import React from 'react'
import PropTypes from 'prop-types'
import { FcFolder, FcNext, FcExpand, FcOpenedFolder } from 'react-icons/fc'
import styles from './styles.module.css'
import FileItem from '../FileItem'

export default class FolderItem extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    deep: PropTypes.number,
    items: PropTypes.array,
    fileItemActions: PropTypes.func
  }

  static defaultProps = {
    deep: 0
  }

  state = {
    collapsed: false
  }

  onToggle = () => {
    this.setState({ collapsed: !this.state.collapsed })
  }

  getContainerStyle = () => {
    const { deep } = this.props
    const marginLeft = 5 * deep
    return { marginLeft }
  }

  render = () => {
    const { name, items } = this.props
    const { collapsed } = this.state
    return <div style={this.getContainerStyle()}>
      <div className={styles.container} onClick={this.onToggle}>
        {!collapsed && <React.Fragment>
          <FcNext />
          <FcFolder />
        </React.Fragment>}
        {collapsed && <React.Fragment>
          <FcExpand />
          <FcOpenedFolder />
        </React.Fragment>}
        <span className={styles.name}>{name}</span>
      </div>
      {collapsed && items && items.map((item) => {
        const { deep, fileItemActions } = this.props
        const isFile = item.children === undefined
        const isFolder = item.children !== undefined

        const itemProps = {
          key: item.path,
          name: item.name,
          path: item.path,
          items: item.children,
          deep: deep + 1,
          fileItemActions
        }

        if (isFile) return <FileItem {...itemProps} />
        if (isFolder) return <FolderItem {...itemProps} />
        return null
      })}
    </div>
  }
}
