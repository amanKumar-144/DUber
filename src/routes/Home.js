import React from 'react'
import Video from '../components/Video'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
const Home = (props) => {
  return (
    <div>
        <h3>Hello {props.account}</h3>
        {/*<Navbar />*/}
        <Video createRider={props.createRider} createDriver={props.createDriver}/>
        <Footer />
    </div>
  )
}

export default Home