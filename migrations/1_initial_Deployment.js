var Daitoken = artifacts.require("./DaiToken.sol");
var Swaptoken=artifacts.require("./SwapToken.sol");
var TokenFarm=artifacts.require("./TokenFarm.sol");

module.exports = async function(deployer,network,accounts) {
  
  //Deploy DAiToken 

  await deployer.deploy(Daitoken);
  const daiToken = await Daitoken.deployed();

  //Deploy SwapToken

  await deployer.deploy(Swaptoken);
  const swapToken=await Swaptoken.deployed();

  //Deploy TokenFarm

  await  deployer.deploy(TokenFarm,swapToken.address,daiToken.address);
  const Tokenfarm =await TokenFarm.deployed();

  //Transfer all tokens to tokenFarms

  await swapToken.transfer(Tokenfarm.address,'1000000'); 

  //Transfer daitoken to invester
  await daiToken.transfer(accounts[1],'10000000');


};
