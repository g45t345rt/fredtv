import React from 'react'
import { Link } from 'react-router-dom'
import Tree from './Tree'

export default class AppVideoTree extends React.Component {
  state = {
    data: null,
    loading: false
  }

  componentDidMount = async () => {
    this.setState({ loading: true })
    const res = await fetch('/api/get-tree')
    const data = await res.json()
    this.setState({ data, loading: false })
  }

  render = () => {
    const { data, loading } = this.state

    if (loading) return <div>loading...</div>
    if (!data) return null

    return <div>
      <Tree data={data} fileItemActions={({ path, base64Path }) => [
        <Link key="play_with_player" to={`/player/${base64Path}`}>player</Link>,
        <a key="play_file" href={`/video?path=${path}`}>file</a>,
        <Link key="view_file_info" to={`/metadata/${base64Path}`}>metadata</Link>
      ]} />
    </div>
  }
}
