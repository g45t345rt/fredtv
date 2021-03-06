import React from 'react'
import Reflux from 'reflux'
import { Link } from 'react-router-dom'

import dataStoreFactory from '../../dataStoreFactory'
import Tree from '../../Tree'
import PageLoading from '../../PageLoading'

const DataStoreFactory = dataStoreFactory()

export default class Home extends Reflux.Component {
  constructor (props) {
    super(props)

    this.state = { loading: false }
    this.store = DataStoreFactory.DataStore
  }

  componentDidMount = async () => {
    if (this.state.data) return

    this.setState({ loading: true })
    const res = await fetch('/api/get-tree')
    const data = await res.json()
    this.setState({ loading: false })
    DataStoreFactory.dataUpdate(data)
  }

  render = () => {
    const { data, loading } = this.state

    return <div>
      <PageLoading loading={loading} />
      {data && <Tree
        data={data}
        onChange={(data) => DataStoreFactory.dataUpdate(data)}
        fileItemActions={({ path, base64Path }) => [
          <Link key="play_with_player" to={`/video/${base64Path}`}>play</Link>,
          <a key="play_file" target="_blank" rel="noreferrer" href={`/api/video?path=${path}`}>file</a>,
          <Link key="view_file_info" to={`/metadata/${base64Path}`}>metadata</Link>
        ]} />}
    </div>
  }
}
