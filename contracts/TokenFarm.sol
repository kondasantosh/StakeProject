pragma solidity ^0.7.2;



import "./SwapToken.sol";
import "./DaiToken.sol";


contract TokenFarm{
    string public  name="Dapp Token Farm";
    SwapToken public swapToken;
    DaiToken public daitoken; 

    address[] public Staker;
    mapping(address=>uint256) public StakingBalance;
    mapping(address=>bool) public hasStaked;
    mapping(address=>bool) public IsStaked;
    address public Owner;

    constructor(SwapToken _swaptoken,DaiToken _daitoken){
        swapToken= _swaptoken;
        daitoken=_daitoken;
        Owner=msg.sender;


    }

    //1.Stake Tokens

    function StakeTokens(uint256 _amount) public{

        require(_amount>0,'amount  cannot be 0');
        daitoken.tranferfrom(msg.sender,address(this), _amount);
        StakingBalance[msg.sender]=StakingBalance[msg.sender] + _amount;
        

        if(!hasStaked[msg.sender]){
            Staker.push(msg.sender);
        }
        hasStaked[msg.sender]=true;
        IsStaked[msg.sender]=true;
    }


    //Unstaking Token

    function unstakeToken() public {
        uint balance =StakingBalance[msg.sender];
        require(balance>0,'Staking Balnce cannot be 0');
        StakingBalance[msg.sender]=0;
        IsStaked[msg.sender]=false;
    }

    //Issuing Tokens

    function issueToken() public{

        require(msg.sender==Owner,'Only Owner Allowed');
        for(uint i=0;i<=Staker.length;i++)
        {   
            address receipient=Staker[i];
            uint balance = StakingBalance[receipient];
            if(balance>0){
            swapToken.transfer(receipient, balance);
            }
        }
    }

}
