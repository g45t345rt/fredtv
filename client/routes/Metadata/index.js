import React from 'react'
import PropTypes from 'prop-types'
import ReactJson from 'react-json-view'
import { Base64 } from 'js-base64'
import Reflux from 'reflux'

import PageLoading from '../../PageLoading'
import dataStoreFactory from '../../dataStoreFactory'
const DataStoreFactory = dataStoreFactory()

export default class Metadata extends Reflux.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        base64Path: PropTypes.string.isRequired
      })
    })
  }

  constructor (props) {
    super(props)

    this.state = { loading: false }
    this.store = DataStoreFactory.DataStore
  }

  componentDidMount = async () => {
    const path = this.getPath()
    if (this.state.data && this.state.data[path]) return

    this.setState({ loading: true })
    try {
      const res = await fetch(`/api/metadata?path=${path}`)
      const data = await res.json()
      this.setState({ loading: false })

      const newData = Object.assign({}, this.state.data)
      newData[path] = data

      DataStoreFactory.dataUpdate(newData)
    } catch {
      this.setState({ loading: false })
    }
  }

  getPath = () => {
    const base64Path = this.props.match.params.base64Path
    return Base64.decode(base64Path)
  }

  getData = () => {
    const { data } = this.state
    const path = this.getPath()
    if (data && data[path]) return data[path]
    return null
  }

  render = () => {
    const { loading } = this.state
    const data = this.getData()
    return <div>
      <PageLoading loading={loading} />
      {data && <ReactJson src={data} />}
    </div>
  }
}
