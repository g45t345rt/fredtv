import Reflux from 'reflux'

const dataStoreFactory = () => {
  const dataUpdate = Reflux.createAction()

  class DataStore extends Reflux.Store {
    constructor () {
      super()
      this.state = { data: null }
      this.listenTo(dataUpdate, this.onDataUpdate)
    }

    onDataUpdate (data) {
      this.setState({ data })
    }
  }

  return {
    DataStore,
    dataUpdate
  }
}

export default dataStoreFactory
