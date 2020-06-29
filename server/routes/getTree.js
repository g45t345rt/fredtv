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
  app.get('/get-tree', (req, res) => {
    // TEMPORARY
    // TODO: Load config from folder list
    const shareFolder = dirTree('H:\\share', {
      extensions: supported.extensionsRegex
    })

    const moviesFolder = dirTree('G:\\movies', {
      extensions: supported.extensionsRegex
    })

    const data = {}
    Object.assign(data, shareFolder, moviesFolder)

    removeEmptyFolder(data)
    res.send(data)
  })
}
