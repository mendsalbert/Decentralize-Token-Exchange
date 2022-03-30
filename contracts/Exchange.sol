// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./Token.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Exchange {
     using SafeMath for uint;
     address public feeAccount;
     uint256 public feePercent;
     address constant ETHER = address(0);
     mapping(address=>mapping(address=> uint256)) public tokens;

     event Deposite(address token, address user, uint amount, uint balance);
     
     constructor(address _feeAccount, uint256 _feePercent){
        feeAccount = _feeAccount;
        feePercent = _feePercent;
     }
     
     function depositeEther(address _ether) payable public{
         console.log(msg.value);
       tokens[_ether][msg.sender] = tokens[_ether][msg.sender].add(msg.value);
       emit Deposite(_ether, msg.sender, msg.value,  tokens[_ether][msg.sender]);
     }

     function withdrawEther(uint _amount, address _ether) public{
        tokens[_ether][msg.sender] = tokens[_ether][msg.sender].sub(_amount);
     }

     function depositeToken(address _token, uint _amount) public{
    //    require(_token != ETHER,"VM Exception while processing transaction: revert");
       Token(_token).transferFrom(msg.sender , address(this),_amount);
       tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
       emit Deposite(_token, msg.sender , _amount,tokens[_token][msg.sender]);
     } 

     fallback() external payable {}
}