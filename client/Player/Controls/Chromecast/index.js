import React from 'react'
import PropTypes from 'prop-types'

import { FiCast, FiXSquare, FiRefreshCw, FiXOctagon } from 'react-icons/fi'

import styles from './styles.module.css'

export default class ChromecastControl extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
    castingDevice: PropTypes.object,
    devices: PropTypes.array,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
    onStop: PropTypes.func,
    onToggle: PropTypes.func,
    onRefresh: PropTypes.func
  }

  static defaultProps = {
    devices: []
  }

  render = () => {
    const { show, castingDevice, devices, onClose, onStop, onSelect, onToggle, onRefresh } = this.props

    return <div className={styles.container}>
      <FiCast className={`${styles.icon} ${castingDevice && styles.casting}`} onClick={onToggle} />
      {show && <div className={styles.devices}>
        <div className={styles.header}>
          <div className={styles.title}>Cast</div>
          <FiXSquare className={styles.close} onClick={onClose} />
        </div>
        <div className={styles.items}>
          {devices.length === 0 && <div>Searching...</div>}
          {!castingDevice && devices.map((device) => <div key={device.name} onClick={() => onSelect(device)}>{device.friendlyName}</div>)}
          {castingDevice && <div onClick={onStop}><FiXOctagon /><span>Stop casting</span></div>}
          {!castingDevice && <div onClick={onRefresh}><FiRefreshCw /><span>Refresh</span></div>}
        </div>
      </div>}
    </div>
  }
}
