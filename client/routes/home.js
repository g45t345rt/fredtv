import React from 'react'
import PropTypes from 'prop-types'

import AppVideoTree from '../AppVideoTree'

export default class Home extends React.Component {
  render = () => {
    return <div>
      <div>Tree Media Center - List of videos</div>
      <AppVideoTree />
    </div>
  }
}
