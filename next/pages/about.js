
import React from 'react'
import { connect } from 'react-redux'

import { loadData, startClock, tickClock } from '../store/actions'
import Layout from '../components/Layout'
import Page from '../components/Page'
import "../styles.css"

class About extends React.Component {
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
            About
            <Page title='Other Page' linkTo='/' NavigateTo='Index Page' />
          </Layout>
      )
  }
}

export default connect()(About)
