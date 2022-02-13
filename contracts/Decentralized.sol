pragma solidity >=0.4.21 <=0.8.11;


contract Decentralized {
    string public name;
    address public owner;
    constructor() public {
        name = "Decentralized Uber App";
        owner = msg.sender;
    }
    uint public riderCount = 0;
    uint public driverCount = 0;
    mapping(uint => Driver) public driverMap;
    mapping(uint => Rider) public riderMap;
    mapping(address => uint) public inverseDriverMap;
    mapping(address => uint) public inverseRiderMap;

    struct Driver {
        uint driverId;
        uint ridesCompleted;
        address payable driverWallet;
    }
    struct Rider {
        uint riderId;
        uint status;
        uint ridesCompleted;
        address riderWallet;
        address payable driverWallet;
    }
    event createRiderTest(
        uint riderId,
        uint status,
        uint ridesCompleted,
        address riderWallet,
        address payable driverWallet
    );
    function createRider() public {
        require(inverseRiderMap[msg.sender] == 0,"Rider already exists");
        riderCount++;
        inverseRiderMap[msg.sender] = riderCount;
        riderMap[riderCount] = Rider(riderCount,0,0,msg.sender,address(0));
        emit createRiderTest(riderCount,0,0,msg.sender,address(0));
    }


    event createDriverTest(
        uint driverId,
        uint ridesCompleted,
        address payable driverWallet
    );
    function createDriver() public {
        require(inverseDriverMap[msg.sender] == 0,"Driver already exists");
        driverCount++;
        inverseDriverMap[msg.sender] = driverCount;
        driverMap[driverCount] = Driver(driverCount,0,msg.sender);
        emit createDriverTest(driverCount,0,msg.sender);
    }

    event requestRideTest(
        uint riderId,
        uint status,
        uint ridesCompleted,
        address riderWallet,
        address payable driverWallet
    );
    function requestRide(uint _riderId) public {
        require(_riderId >= 1 && _riderId <= riderCount,"ID should be valid");
        Rider memory r1 = riderMap[_riderId];
        require(r1.status == 0,"Rider should be free");
        r1.status = 1;
        riderMap[_riderId] = r1;
        emit requestRideTest(r1.riderId,r1.status,r1.ridesCompleted,r1.riderWallet,r1.driverWallet);
    }

    event acceptRideTest(
        uint riderId,
        uint driverId,
        uint priceOfRide,
        address riderWallet,
        address payable driverWallet,
        uint riderTotal,
        uint driverTotal
    );
    function acceptRide(uint _riderId,uint _driverId,uint _price) public payable{
        require(_price >= 1,"Price should be greater than 1 Ether");
        require(msg.value == _price,"Value should be equal");
        Rider memory r1 = riderMap[_riderId];
        Driver memory d1 = driverMap[_driverId];
        require(r1.status == 1,"Rider should be waiting");
        require(r1.riderWallet != d1.driverWallet,"Both people should be different");
        r1.status = 0;
        r1.ridesCompleted ++;
        d1.ridesCompleted ++;

        address(d1.driverWallet).transfer(msg.value);
        riderMap[_riderId] = r1;
        driverMap[_driverId] = d1;
        emit acceptRideTest(r1.riderId,d1.driverId,_price,r1.riderWallet,d1.driverWallet,r1.ridesCompleted,d1.ridesCompleted);
    }


    event cancelRideTest(
        uint riderId,
        uint riderTotalRides,
        uint driverId,
        uint driverTotalRides,
        address payable driverWallet
    );
    function cancelRide(uint _riderId, uint _driverId) public {
        Rider memory r1 = riderMap[_riderId];
        Driver memory d1 = driverMap[_driverId];

        r1.status = 0;
        r1.driverWallet = address(0);
        riderMap[_riderId] = r1;
        driverMap[_driverId] = d1;

        emit cancelRideTest(r1.riderId,r1.ridesCompleted,d1.driverId,d1.ridesCompleted,r1.driverWallet);
    }
}