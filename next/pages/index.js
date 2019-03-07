
import React from 'react'
import { connect } from 'react-redux'

import KeyBoard from '../components/KeyBoard'
import "../styles.css"

import { loadData, startClock, tickClock } from '../store/actions'
import Layout from '../components/Layout'

class Index extends React.Component {
  static async getInitialProps (props) {
    const { store, isServer } = props.ctx
    store.dispatch(tickClock(isServer))

    if (!store.getState().placeholderData) {
      store.dispatch(loadData())
    }

    return { isServer }
  }

  componentDidMount () {
    this.props.dispatch(startClock())
  }

  render () {
      return (
          <Layout>
              <KeyBoard />
          </Layout>
      )
  }
}

export default connect()(Index)
