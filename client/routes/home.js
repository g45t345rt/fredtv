import React from 'react'
import PropTypes from 'prop-types'

import TreeData from '../Tree/TreeData'

export default class Video extends React.Component {
  render = () => {
    return <div>
      <div>Home - List of videos</div>
      <TreeData />
    </div>
  }
}
