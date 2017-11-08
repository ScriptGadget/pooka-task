pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DoneButton.sol";


contract TestDoneButton {
  function testPressedButtonWithValue() {
    DoneButton button = DoneButton(DeployedAddresses.DoneButton());
      
    button.pressed(123);
      
    var (fresh, time, value)  = button.presses(this);      

    Assert.isNotZero(time, "There should be an press.");
      
    Assert.equal(value, 123, "The press should have a value of 123.");
      
    Assert.equal(fresh, true, "The press should still be fresh.");
      
    if (time < now - 1 minutes) {
        Assert.fail("The press should be recent");
    }

    if (time > now) {
        Assert.fail("The press should not be in the future.");
    }
  }

}
