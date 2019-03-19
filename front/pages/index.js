
import React from 'react'
import { connect } from 'react-redux'

import KeyBoard from '../components/KeyBoard'

import { loadData, startClock, tickClock } from '../store/actions'
import Layout from '../components/Layout'
import { auth } from '../utils/auth'

class Index extends React.Component {
  static async getInitialProps ({ctx}) {
    const token = auth(ctx)

    const { store, isServer } = ctx
    store.dispatch(tickClock(isServer))

    if (!store.getState().placeholderData) {
      store.dispatch(loadData())
    }

    return { isServer, token }
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
