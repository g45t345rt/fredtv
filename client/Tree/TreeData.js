import React from 'react'

import TreeItem from './TreeItem'

export default class TreeData extends React.Component {

  state = {
    data: {},
    loading: false
  }

  componentDidMount = async () => {
    this.setState({ loading: true })
    const res = await fetch('/get-tree')
    const data = await res.json()
    this.setState({ data, loading: false })
  }

  render = () => {
    const { data, loading } = this.state
    return <div>
      {loading && <div>loading...</div>}
      <TreeItem {...data} />
    </div>
  }
}
