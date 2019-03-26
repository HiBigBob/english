
import React from 'react'
import { connect } from 'react-redux'

import { loadData, startClock, tickClock, loadUser, setToken} from '../store/actions'
import { auth } from '../utils/auth'
import Layout from '../components/Layout'
import Drawer from '../components/Drawer'
import Page from '../components/Page'

import {
  List, Avatar, Button, Skeleton, Row, Col, Icon
} from 'antd';

const transform = array => array.map(i => i.last).join(', ');

class LoadMoreList extends React.Component {
  state = {
    initLoading: false,
    loading: false,
    data: [],
    list: [{loading: false, en: [{last:'Adrien'}, {last:'Adrien 2'}], fr: [{last:'Bouttier'}, {last:'Bouttier 2'}]}],
  }

  render() {
    const { initLoading, loading, list } = this.state;
    const loadMore = !initLoading && !loading ? (
      <div style={{
        textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
      }}
      >
        <Button onClick={()=> console.log('tot')}>loading more</Button>
      </div>
    ) : null;

    return (
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={item => (
          <List.Item actions={[<Icon type="edit" />]}>
              <List.Item.Meta
                avatar={<Avatar src="/static/verb.png" style={{borderRadius: 'unset'}} />}
                title={transform(item.en)}
                description={transform(item.fr)}
              />
          </List.Item>
        )}
      />
    );
  }
}

class About extends React.Component {
  static async getInitialProps ({ctx}) {
    const token = auth(ctx)

    const { store, isServer } = ctx

    if (!store.getState().token) {
      const set = await store.dispatch(setToken(token))
      const getUser = await store.dispatch(loadUser())
    }

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
    // const data = {
      // en: ['en', 'en1'],
      // fr: ['fr', 'fr1']
    // };
    const data = {
    };

    return (
        <Layout user={this.props.user}>
          <div>
            <Row>
              <Col span={24} style={{textAlign: 'right'}}><Drawer data={data} /></Col>
            </Row>
            <Row>
              <Col span={24}><LoadMoreList /></Col>
            </Row>
          </div>
        </Layout>
    )
  }
}

export default connect(state => ({
    user: state.user,
}))(About)
