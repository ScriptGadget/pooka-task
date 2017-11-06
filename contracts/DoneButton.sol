pragma solidity ^0.4.2;

// Simple event oracle
contract DoneButton {
  address public owner = msg.sender;
  uint public creationTime = now;
    
  struct Event {
    bool fresh; // Have we already seen this event?
    uint time;  // Currently the block time when the event arrived.
    uint value; // Application specific.
  }
    
  mapping (address => Event) public events;
    
  modifier onlyBy(address _account) {
    require(msg.sender == _account);
    _;
  }

  function DoneButton() {
	}

  function pressed(uint value) {
    events[msg.sender] = Event(true, now, value);
  }

  function clean() onlyBy(owner) {
    selfdestruct(owner);
  }
    
}
