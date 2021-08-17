// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./TransferHelper.sol";

contract MockToken1 is ERC20 {
    constructor() ERC20("MockToken2", "MockToken2") {}
    
    function getMock2(address _token1, uint _amount) public {
        TransferHelper.safeTransferFrom(_token1, msg.sender, address(this), _amount);
        _mint(msg.sender, _amount);
    }
}
