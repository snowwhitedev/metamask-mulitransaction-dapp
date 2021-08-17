// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken1 is ERC20 {
    uint256 INITIAL_SUPPLY = 10000000000 * 10**18;

    constructor() ERC20("MockUSDT_UnoRe", "MUSDT_UnoRe") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
