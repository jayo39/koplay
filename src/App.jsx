import { useState } from 'react'
import Header from "./components/header.jsx"
import LatestUpdate from './components/latestUpdate.jsx'
import MainBanner from './components/mainBanner.jsx'
import Content from './components/content.jsx'
import RankingTable from './components/rankingTable.jsx'
import Footer from './components/footer.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
      <div>
        <Header></Header>
        <LatestUpdate></LatestUpdate>
        <MainBanner></MainBanner>
        <RankingTable></RankingTable>
        <Content></Content>
        <Footer></Footer>
      </div>
  )
}

export default App
