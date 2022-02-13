import React, { useEffect,useState } from "react";
import Decentralized from "./contracts/Decentralized.json";
import getWeb3 from "./getWeb3";
import {Routes,Route} from 'react-router-dom'
import "./App.css"
import Home from './routes/Home'
import Rider from './routes/Rider'
import Driver from './routes/Driver'



const App = () => {
  const [contract,setContract] = useState(null);
  const [account,setAccount] = useState();

  const [name,setName] = useState(null);
  const [owner,setOwner] = useState(null);
  const [driverCount,setDriverCount] = useState(null);
  const [riderCount,setRiderCount] = useState(null);
  const [driverMap,setDriverMap] = useState([]);
  const [riderMap,setRiderMap] = useState([]);

  const loadContractData = async(contract)=>{
    const name = await contract.methods.name().call();
    console.log(name);setName(name);
    const owner = await contract.methods.owner().call();
    console.log(owner);setOwner(owner);
    const driverCount = await contract.methods.driverCount().call();
    console.log(driverCount);setDriverCount(driverCount);
    const riderCount = await contract.methods.riderCount().call();
    console.log(riderCount);setRiderCount(riderCount);
    
    const driverMap=[];
    for(var i=1;i<=driverCount;i++){
      const d1=await contract.methods.driverMap(i).call();
      driverMap.push(d1);
    }setDriverMap(driverMap);

    const riderMap=[];
    for(var i=1;i<=riderCount;i++){
      const r1=await contract.methods.riderMap(i).call();
      riderMap.push(r1);
    }setRiderMap(riderMap);
  }

  //Metamask account
  const loadWeb3Account =async(web3) => {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      if(accounts){
        console.log("The Account is ",accounts[0]);
        setAccount(accounts[0]);
      }
  }

  const loadWeb3Contract = async(web3) =>{
    const networkId = await web3.eth.net.getId();
    const networkData = Decentralized.networks[networkId];
    console.log(networkData);

    if(networkData) {
      const abi = Decentralized.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi,address);
      setContract(contract);
      console.log(contract);
      return contract;
    }
  }
  
  // Load WEB3 Account from Metamask
  // Load the contract
  useEffect(async()=>{
    const web3 = await getWeb3();
    await loadWeb3Account(web3);
    let contract = await loadWeb3Contract(web3);
    await loadContractData(contract);
  },[]);
  

  //Functions in Solidity file
  const createRider=()=>{
    contract.methods.createRider().send({from:account});
  }

  const createDriver=()=>{
    contract.methods.createDriver().send({from:account});
  }

  const requestRide=(riderId)=>{
    contract.methods.requestRide(riderId).send({from:account});
  }
  const cancelRide=(riderId,driverId)=>{
    contract.methods.cancelRide(riderId,driverId).send({from:account});
  }
  const acceptRide=(riderId,driverId,price)=>{
    contract.methods.acceptRide(riderId,driverId,price).send({from:account,value:price});
  }
  return (
    <div>
        <h3>{owner}</h3>
        <Routes>
          <Route path='/' element={<Home name={name} account={account}  createDriver={createDriver} createRider={createRider}/>} />
          <Route path='/rider' element={<Rider requestRide={requestRide} acceptRide={acceptRide} cancelRide={cancelRide} account={account} riderMap={riderMap} riderCount={riderCount} driverMap={driverMap} driverCount={driverCount}/>} />
          <Route path='/driver' element={<Driver requestRide={requestRide} acceptRide={acceptRide} cancelRide={cancelRide} account={account} riderMap={riderMap} riderCount={riderCount} driverMap={driverMap} driverCount={driverCount}/>} />
        </Routes>
      </div>
  )
}

export default App