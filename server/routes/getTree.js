const dirTree = require('directory-tree')
const supported = require('../supported')

const removeEmptyFolder = (obj, parent) => {
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
    // TEMPORARY
    // TODO: Load config from folder list
    const shareFolder = dirTree('H:\\share', {
      extensions: supported.extensionsRegex
    })

    const moviesFolder = dirTree('G:\\movies', {
      extensions: supported.extensionsRegex
    })

    const mFolder = dirTree('G:\\vm_share2', {
      extensions: supported.extensionsRegex
    })

    const data = { name: 'root', path: '', children: [moviesFolder, mFolder, shareFolder] }
    removeEmptyFolder(data)
    res.send(data)
  })
}
