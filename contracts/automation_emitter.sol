/**
 *Submitted for verification at Sepolia.Arbiscan.io on 2023-11-16
*/

// https://automation.chain.link/
// 0x4aaB179463BDcD2D7c76F07CeD7238c0D4FAC765 on Sepolia

pragma solidity >=0.8.19;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Bumper {

    uint256 public number;
    event Bump(address indexed addr, uint indexed num);

    function bump() public {
        number += 1;
        emit Bump(msg.sender, number);
    }
}