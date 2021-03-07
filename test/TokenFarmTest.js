const { assert } = require('chai');
const { default: Web3 } = require('web3');

const Daitoken = artifacts.require("./Daitoken.sol");
const SwapToken =artifacts.require("./SwapToken.sol");
const TokenFarm =artifacts.require("./TokenFarm.sol");

require('chai').use(require('chai-as-promised')).should();



contract("SimpleStorage", accounts => {
  let DaitokenInstance,SwapTokenInstance,TokenFarmInstance 
  before('all',async()=>{
     DaitokenInstance = await Daitoken.new();
     SwapTokenInstance = await SwapToken.new();
     TokenFarmInstance = await TokenFarm.new(SwapTokenInstance.address,DaitokenInstance.address);
  
  
     await SwapTokenInstance.transfer(TokenFarmInstance.address,'100000000');//transfer

     await DaitokenInstance.transfer(accounts[1],'100',{from:accounts[0]});
     
  })


  describe('Mock Dia deployement',async() => {
  
  it("name is", async () => {
    const name=await DaitokenInstance.name();
    assert.equal(name, "FDai token", "IS NOT EQUAL");
    
  })
})

describe('Mock swap deployement',async() => {
  
  it("name is", async () => {
    const name=await SwapTokenInstance.name();
    assert.equal(name, "Swap token", "IS NOT EQUAL");
    
  })

  

  
})

describe('Mock swap deployement',async() => {
  
  
  it("name is", async () => {
    const name=await TokenFarmInstance.name();
    assert.equal(name, "Dapp Token Farm", "IS NOT EQUAL");
    
  })

  it("Contract has token",async()=>{
    let balance =await SwapTokenInstance.balanceOf(TokenFarmInstance.address);
    assert.equal(balance.toString(), '100000000', "IS NOT EQUAL");

  })
})

describe('Farm Token',async()=>{
  it('rewards investors for staking mDai tokens',async()=>{
    let result;
    result=await DaitokenInstance.balanceOf(accounts[1]);
    
    assert.equal(result.toString(),'100','investor Mock Dai,wallet balance correct before staking');
    
    await DaitokenInstance.approve(TokenFarmInstance.address,'100',{from: accounts[1]});
    await TokenFarmInstance.StakeTokens('100',{from:accounts[1]});


    result =await DaitokenInstance.balanceOf(accounts[1]);
    assert.equal(result.toString(),'0','Investor Mock Dai wallet balance correct after staking');

    result =await TokenFarmInstance.StakingBalance(accounts[1]);
    assert.equal(result.toString(),'100','Investor Mock Dai wallet balance correct after staking');

    result =await TokenFarmInstance.IsStaked(accounts[1]);
    assert.equal(result.toString(),'true','Investor Mock Dai wallet balance correct after staking');

    await TokenFarmInstance.issueToken({from :accounts[1]}).should.be.rejected;

    await TokenFarmInstance. unstakeToken({from:accounts[1]});

    result = await DaitokenInstance.balanceOf(accounts[1])
    assert.equal(result.toString(), '0', 'investor Mock DAI wallet balance correct after staking')

    result = await DaitokenInstance.balanceOf(TokenFarmInstance.address)
    assert.equal(result.toString(), '100', 'Token Farm Mock DAI balance correct after staking')

    result = await TokenFarmInstance.StakingBalance(accounts[1])
    assert.equal(result.toString(), '0', 'investor staking balance correct after staking')

    result = await TokenFarmInstance.IsStaked(accounts[1])
    assert.equal(result.toString(), 'false', 'investor staking status correct after staking')

    
    

    
  })
})

});
