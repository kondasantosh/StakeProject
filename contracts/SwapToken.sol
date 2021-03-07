pragma solidity ^0.7.2;

contract SwapToken{
    string public name="Swap token";
    string public symbol="Swap";
    uint256 public totalSupply=100000000;
    uint8 public decimal=18;
    address Owner;
    
    event Transfer(address indexed _from,address indexed _to,uint256 _value);
    event Approve(address indexed _owner,address indexed _spender,uint256 _value);

    mapping(address =>uint256)public  balanceOf;
    mapping(address=>mapping(address=>uint256)) public Allowance;
     
     constructor() public{
        Owner=msg.sender;
        balanceOf[msg.sender]=totalSupply;
    }

   
   

    function transfer(address _to,uint256  _value) public returns(bool){
        require(balanceOf[msg.sender]>=_value);
        balanceOf[msg.sender]-=_value;
        require(balanceOf[_to]+_value >=balanceOf[_to]);
        balanceOf[_to]+=_value;
        emit Transfer(msg.sender,_to,_value);
        return true;
        

    }

    function approve(address _spender,uint256 _value) public returns(bool){
        Allowance[msg.sender][_spender]=_value;
        emit Approve(msg.sender, _spender, _value);

        return true;
        
    
    }

    function tranferfrom(address _from,address _to,uint256 _value) public returns(bool){
        require(_value<=balanceOf[_from]);
        require(_value<=Allowance[_from][msg.sender]);
        balanceOf[_from]-=_value;
        balanceOf[_to]+=_value;
        Allowance[_from][msg.sender]-=_value;
        emit Transfer(_from,_to,_value);
        return true;
    }


 
}