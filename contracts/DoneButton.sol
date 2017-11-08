pragma solidity ^0.4.2;

// Simple button press oracle
contract DoneButton {
  address public owner = msg.sender;
  uint public creationTime = now;
    
  struct Press {
    bool fresh; // Have we already seen this press?
    uint time;  // Currently the block time when the press arrived.
    uint value; // Application specific.
  }
    
  mapping (address => Press) public presses;
    
  modifier onlyBy(address _account) {
    require(msg.sender == _account);
    _;
  }

  function DoneButton() {
	}

  function pressed(uint value) {
    presses[msg.sender] = Press(true, now, value);
  }

  function clean() onlyBy(owner) {
    selfdestruct(owner);
  }
    
}
