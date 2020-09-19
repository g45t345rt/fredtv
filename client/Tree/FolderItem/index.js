import React from 'react'
import PropTypes from 'prop-types'
import { FcFolder, FcNext, FcExpand, FcOpenedFolder } from 'react-icons/fc'
import styles from './styles.module.css'
import FileItem from '../FileItem'

export default class FolderItem extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      children: PropTypes.array,
      collapsed: PropTypes.bool
    }),
    onChange: PropTypes.func,
    deep: PropTypes.number,
    fileItemActions: PropTypes.func
  }

  static defaultProps = {
    deep: 0
  }

  toggleCollapsed = () => {
    const { data, onChange } = this.props

    if (onChange) {
      onChange({
        ...data,
        collapsed: !data.collapsed
      })
    }
  }

  getContainerStyle = () => {
    const { deep } = this.props
    const marginLeft = 5 * deep
    return { marginLeft }
  }

  render = () => {
    const { data } = this.props
    const { collapsed, children, name } = data
    return <div style={this.getContainerStyle()}>
      <div className={styles.container} onClick={this.toggleCollapsed}>
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
      {collapsed && children && children.map((item) => {
        if (!item) return
        const { deep, fileItemActions } = this.props
        const isFile = item.children === undefined
        const isFolder = item.children !== undefined

        const itemProps = {
          key: item.path,
          data: item,
          deep: deep + 1,
          fileItemActions
        }

        if (isFile) return <FileItem {...itemProps} />

        if (isFolder) {
          return <FolderItem {...itemProps} onChange={(data) => {
            const { data: parentData, onChange } = this.props
            parentData.children = parentData.children.map((child) => {
              if (child.path === data.path) return data
              return child
            })

            if (onChange) onChange(parentData)
          }} />
        }

        return null
      })}
    </div>
  }
}
