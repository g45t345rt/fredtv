const dirTree = require('directory-tree')

const getConfig = require('../getConfig')
const supported = require('../../shared/supported')

const removeEmptyFolder = (obj, parent) => {
  if (obj) return
  const { children, name } = obj
  if (children) {
    let i = children.length
    while (i--) {
      const child = children[i]
      removeEmptyFolder(child, obj)
    }

    if (children.length === 0) {
      const index = parent.children.findIndex((child) => child.name === name)
      parent.children.splice(index, 1)
    }
  }
}

module.exports = (app) => {
  app.get('/api/get-tree', (req, res) => {
    const tree = []
    const config = getConfig()
    const { folders = [] } = config
    folders.forEach((folderPath) => {
      tree.push(dirTree(folderPath, supported.extensionsRegex))
    })

    const data = { name: 'root', path: '', children: tree }
    removeEmptyFolder(data)
    res.send(data)
  })
}
