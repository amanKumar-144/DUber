import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroImage from '../components/HeroImage'
import RiderCards from '../components/Rider'


const Rider = (props) => {
  return (
    <div>
        <Navbar />
        <HeroImage heading='Rider View' text='Choose your trip'/>
        <RiderCards requestRide={props.requestRide} acceptRide={props.acceptRide} cancelRide={props.cancelRide} account={props.account} riderMap={props.riderMap} riderCount={props.riderCount} driverMap={props.driverMap} driverCount={props.driverCount}/>
        <Footer />
    </div>
  )
}

export default Rider