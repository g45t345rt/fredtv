import React from 'react'
import PropTypes from 'prop-types'
import { Base64 } from 'js-base64'

import Player from '../../Player'

export default class Video extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        base64Path: PropTypes.string.isRequired
      })
    })
  }

  render = () => {
    const base64Path = this.props.match.params.base64Path
    const path = Base64.decode(base64Path)

    return <div>
      <Player path={path} />
    </div>
  }
}
