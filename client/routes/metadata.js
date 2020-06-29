import React from 'react'
import PropTypes from 'prop-types'
import ReactJson from 'react-json-view'
import { Base64 } from 'js-base64'

export default class Metadata extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        base64Path: PropTypes.string.isRequired
      })
    })
  }

  state = {
    data: null,
    loading: false
  }

  componentDidMount = async () => {
    const base64Path = this.props.match.params.base64Path
    const path = Base64.decode(base64Path)
    this.setState({ loading: true })
    try {
      const res = await fetch(`/api/metadata?path=${path}`)
      const data = await res.json()
      this.setState({ data, loading: false })
    } catch {
      this.setState({ loading: false })
    }
  }

  render = () => {
    const { data, loading } = this.state
    if (loading) return <div>loading...</div>
    if (!data) return null
    return <div>
      <ReactJson src={data} />
    </div>
  }
}
