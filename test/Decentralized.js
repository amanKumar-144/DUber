

const Decentralized = artifacts.require("./Decentralized.sol");



contract('Decentralized',([deployerCar,riderCar,driverCar])=>{
    let decentralized;
    let rider;
    let driver;
    let driverCount;
    let riderCount;
    before(async() =>{
        decentralized = await Decentralized.deployed({from:deployerCar});
    })
    describe('deployment',async() =>{
        it('deploys successfully',async() => {
            const address = await decentralized.owner();
            assert.notEqual(address,0x0);
            assert.notEqual(address,'');
            assert.notEqual(address,null);
            assert.notEqual(address,undefined);
            assert.equal(address,deployerCar);
        })
    
        it('has a name',async() =>{
            const name = await decentralized.name();
            assert.equal(name,"Decentralized Uber App");
        })
    })
    

    describe('Initial',async() => {
        it('Initial Count',async() => {
            driverCount=await decentralized.driverCount();
            riderCount=await decentralized.riderCount();

            assert.equal(driverCount,0);
            assert.equal(riderCount,0);
        })
    })


    describe('Rider/Driver Creation',async() => {
       
        before(async() =>{
            rider = await decentralized.createRider({from:riderCar});
            driver = await decentralized.createDriver({from:driverCar});
            driverCount = await decentralized.driverCount();
            riderCount = await decentralized.riderCount();
        })

        it('Check details',async() =>{
            assert.equal(driverCount,1);
            assert.equal(riderCount,1);
                
            const event1 = rider.logs[0].args;
            const event2 = driver.logs[0].args;

            assert.equal(event1.riderId,1);
            assert.equal(event1.status,0);
            assert.equal(event1.ridesCompleted,0);
            assert.equal(event1.riderWallet,riderCar);
            assert.notEqual(event1.driverWallet,event2.driverWallet);

            assert.equal(event2.driverId,1);
            assert.equal(event2.ridesCompleted,0);
            assert.equal(event2.driverWallet,driverCar);
        })
    })
    
    describe('Request Ride Creation',async() => {
        let result
        before(async() =>{
            
            result = await decentralized.requestRide(rider.logs[0].args.riderId,{from:riderCar});
        })

        it('Check details',async() =>{
            assert.equal(driverCount,1);
            assert.equal(riderCount,1);
           
            const event = result.logs[0].args;
            
            assert.equal(event.status,1);
            assert.equal(event.ridesCompleted,0);
            assert.notEqual(event.riderWallet,driverCar);
        })
    })
    
    describe('Accept Ride',async() => {
        let newResult;
            
        it('Check transaction',async() => {

            let oldSellerBalance;
            oldSellerBalance = await web3.eth.getBalance(driverCar);
            oldSellerBalance = new web3.utils.BN(oldSellerBalance);
        
            newResult = await decentralized.acceptRide(rider.logs[0].args.riderId,driver.logs[0].args.driverId,web3.utils.toWei('1','Ether'),{from:riderCar,value: web3.utils.toWei('1','Ether')});
            //console.log(newResult);
            let newSellerBalance;
            newSellerBalance = await web3.eth.getBalance(driverCar);
            newSellerBalance = new web3.utils.BN(newSellerBalance);

            let price;
            price = web3.utils.toWei('1','Ether');
            price = new web3.utils.BN(price);
            const expectedBalance = oldSellerBalance.add(price);
            console.log(oldSellerBalance.toString());
            console.log(newSellerBalance.toString());
            assert.equal(newSellerBalance.toString(),expectedBalance.toString());
        })
    })

    /*
    describe('Cancel ride',async() => {
        let result
        before(async() =>{
            result = await decentralized.cancelRide(rider.logs[0].args.riderId,driver.logs[0].args.driverId);
        })

        it('Check details',async() =>{
            assert.equal(driverCount,1);
            assert.equal(riderCount,1);
           
            const event = result.logs[0].args;
            //console.log(event.riderId);
            assert.equal(event.riderId.toNumber(),rider.logs[0].args.riderId.toNumber());
            //assert.equal(event.riderTotalRides.toNumber(),0);
            assert.notEqual(event.driverWallet,driverCar);
        })
    })*/
  

})
