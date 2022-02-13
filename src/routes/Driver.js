import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroImage from '../components/HeroImage'
import DriverSection from '../components/Driver'
const Driver = (props) => {
  return (
    <div>
        <Navbar />
        <HeroImage heading="Driver View" text="View all rider/driver lists" />
        <DriverSection requestRide={props.requestRide} acceptRide={props.acceptRide} cancelRide={props.cancelRide} account={props.account} riderMap={props.riderMap} riderCount={props.riderCount} driverMap={props.driverMap} driverCount={props.driverCount}/>
        <Footer />
    </div>
  )
}

export default Driver