// SPDX-License-Identifier: MIT

pragma solidity ^0.6.6;

contract FundStore{
    mapping (address => uint256) public balances;


    function deposit() public payable {
        balances[msg.sender] += msg.value; 
    }

    function withdraw(uint256 _amount) public payable {

        require(balances[msg.sender] > _amount, "Insufficient fund");
        (bool sent, ) = msg.sender.call{value: _amount}(""); // send funds to sender, Note: this line is vulnerable to a call back hence reentrancy
        require(sent, "Failed to send funds");

        balances[msg.sender] -= _amount;

    }

    function getBalance() public view returns(uint256){
        return address(this).balance;
    }
}