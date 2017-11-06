pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DoneButton.sol";


contract TestDoneButton {
  function testPressedButtonWithValue() {
    DoneButton button = DoneButton(DeployedAddresses.DoneButton());
      
    button.pressed(123);
      
    var (fresh, time, value)  = button.events(this);      

    Assert.isNotZero(time, "There should be an event.");
      
    Assert.equal(value, 123, "The event should have a value of 123.");
      
    Assert.equal(fresh, true, "The event should still be fresh.");
      
    if (time < now - 1 minutes) {
        Assert.fail("The event should be recent");
    }

    if (time > now) {
        Assert.fail("The event should not be in the future.");
    }
  }

}
