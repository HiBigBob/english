
import { KeyBoard } from '../components/KeyBoard'
import Layout from '../components/Layout'
import "../styles.css"

export default () => (
  <Layout>
      <KeyBoard practice={{
          ask: 'yahoos',
          answer: 'yahoo'
      }} />
  </Layout>
)
