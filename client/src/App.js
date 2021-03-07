import React, { Component } from "react";
import TokenFarmContract from "./contracts/TokenFarm.json";
import DaiContract from "./contracts/DaiToken.json";
import SwapContract from "./contracts/SwapToken.json";
import getWeb3 from "./getWeb3";
import Navbar from './components/Navbar';
import dai from './dai.png';
import "./App.css";

class App extends Component {
constructor(props){
  super(props)
  this.state = { account: 0x0, web3: null, accounts: null, contract: null,daitoken:{},swapptoken:{},tokenFarm:{},StakingBalance:'11',DaiBalance:'0',SwapBalance:'0',Amount:'0'};
}

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TokenFarmContract.networks[networkId];
      const instance = new web3.eth.Contract(
        TokenFarmContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const stakingBalance = await instance.methods.StakingBalance(accounts[0]).call();
      const strs=stakingBalance.toString()
      this.setState({ tokenFarm:instance,StakingBalance: strs });
      const DaideployedNetwork = DaiContract.networks[networkId];
      if(DaideployedNetwork){
      const Daiinstance = new web3.eth.Contract(
        DaiContract.abi,
        DaideployedNetwork &&  DaideployedNetwork.address,
      );
      this.setState({daitoken:Daiinstance});
      let balance=await Daiinstance.methods.balanceOf(accounts[0]).call();
      this.setState({DaiBalance:balance.toString()});
      }else{
        window.alert('DaiToken contract not deployed in the network');
      }

      const SwapdeployedNetwork = SwapContract.networks[networkId];
      if(SwapdeployedNetwork){
      const Swapinstance = new web3.eth.Contract(
        SwapContract.abi,
        SwapdeployedNetwork &&  SwapdeployedNetwork.address,
      );
      this.setState({swapptoken:Swapinstance});
      let balance=await Swapinstance.methods.balanceOf(accounts[0]).call();
      this.setState({SwapBalance:balance.toString()});
      }else{
        window.alert('DaiToken contract not deployed in the network');
      }

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ account:accounts[0],web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  HandleChange=(event)=>{
    
      const target=event.target;
      const value=target.type==="checkBox" ? target.checked: target.value;
      
     
      this.setState({Amount:value.toString()});
  }

  stakeTokens = async() => {
    
    await this.state.daitoken.methods.approve(this.state.tokenFarm._address, this.state.Amount).send({ from: this.state.accounts[0] });
      await this.state.tokenFarm.methods.StakeTokens(this.state.Amount).send({ from: this.state.account });
      let balance=await this.state.swapptoken.methods.balanceOf(this.state.accounts[0]).call();
      let balance1= await this.state.tokenFarm.methods.StakingBalance(this.state.accounts[0]).call();
      let strb=balance1.toString();
      this.setState({SwapBalance:balance.toString(),StakingBalance:strb});
      
    };

    unstakeTokens = async() => {
      
      await this.state.tokenFarm.methods.unstakeToken().send({ from: this.state.account });
      let balance1= await this.state.tokenFarm.methods.StakingBalance(this.state.accounts[0]).call();
      let strb=balance1.toString();
      this.setState({StakingBalance:strb});
      
    }
  

  

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Navbar/>
        <br/>
        <div class="container-fluid col-md-10 col-md-offset-8">
        <br/>
        <div class="row justify-content-center ">
        <div class="col-lg-5 d-flex justify-content-center text-center">
      
        <div class="text-white align-items-md-center ">Staking Balance</div>
         
          </div>
          
          
        <div class="col-lg-5">

        <div class="text-white">Reward Balance</div>
         
         
          </div>
          </div>
          <div class="row justify-content-center">
        <div class="col-lg-5 d-flex justify-content-center text-center">

        <div class="text-white">{this.state.StakingBalance.toString()} mDAi</div>
         
         
          </div>
          
          
        <div class="col-lg-5">

        <div class="text-white">{this.state.web3.utils.fromWei(this.state.SwapBalance,'Ether')} Swap</div>
         
          </div>
          </div>
          <br/>
        <div class="row justify-content-center ">
        <div class="col-lg-7">
                      
        <div class="card">
           <div class="card-header"><div class="row "><div class="col-lg-5">Staking Token</div><div class="col-lg-5">Balance:{this.state.web3.utils.fromWei(this.state.DaiBalance)}</div></div></div>
                  <div class="card-body">
                     <form>
                           <div class="form-group">
                           <div className="input-group mb-4">
                <input
                  type="text"
                 
                  className="form-control form-control-lg"
                  
                  onChange={this.HandleChange}
                   />
                <div className="input-group-append">
                  <div className="input-group-text">
                  <img src={dai} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; mDAI
                  </div>
                </div>
              </div>
                            </div>
                            <div class="row ">
                            <button type="button" class="btn btn-primary btn-block btn-lg" onClick={this.stakeTokens} >Stake Token</button>
                            </div>
                            <br/>
                            <div class="row ">  
                            <button type="button" class="btn btn-link btn-block btn-sm" onClick={this.unstakeTokens}>Unstake Token</button>
                            </div>
                      </form>
                 </div>
                                   
                                     
           </div>
           </div>
           </div>
           </div>
      </div>
    );
  }
}

export default App;
