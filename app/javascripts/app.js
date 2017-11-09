// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import donebutton_artifacts from '../../build/contracts/DoneButton.json'

// DoneButton is our usable abstraction, which we'll use through the code below.
var DoneButton = contract(donebutton_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

// Handy functions
function getParameters(search) {
  return search.slice(1).split('&').reduce(function(p,c,i,a) {p[c.split('=')[0]] = c.split('=')[1]; return p;}, {})
};

window.App = {
  start: function() {
    var self = this;
    
    // Make sure parameters are correct.
    this.snarfParams();

    // Bootstrap the DoneButton abstraction for Use.
    DoneButton.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
    });
    this.loadList();
  },
  snarfParams: function() {
    var parameters = getParameters(location.search);
    if (parameters['id'] === undefined) {
      console.log("How did you get here?");
      // Could do something like this, but not for the demo.
      // location.replace("/");
    }

    var id = parameters['id'];
    console.log(id);
    document.getElementById("task").value = id;
    var description = document.getElementById("description");
    var deadline = document.getElementById("deadline");
    var amount = document.getElementById("amount");
    description.innerHTML = "Narfle the Garthok!";
    deadline.innerHTML = "12/22/2017";
    amount.innerHTML = "0.85";
  },

  // Load a list of open tasks
  loadList: function() {
    var task_list = document.getElementById("task_list");
    var tasks = [
      {id: '11111', description: "Narfle the Garthok!", amount: "0.085", deadline: "12/22/2017", done: false},
      {id: '22222', description: "Lolligag in Riverwood.", amount: "0.125", deadline: "11/15/2017", done: true},
    ];

    var html = '<table class="tasks"><thead><tr><th>Description</th><th>Amount</th><th>Deadline</th><th>Do It?</th></tr></thead>';
    tasks.forEach(function (i) {
      html += '<tr><td>' + i['description'] + '</td><td>'+ i['amount'] + '</td><td>'+ i['deadline']  +'</td><td>'+ '<a href="\done.html?id=' + i['id'] + '">Ok</a>' +'</td></tr>';
    });
    html += '</table>';
    task_list.innerHTML = html;
  },
  
  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  // Add a new offer to the list of tasks in the contract.
  offer: function() {
    
  },

  // Mark the current offer as done.
  done: function() {
    var self = this;

    var task = parseInt(document.getElementById("task").value);

    this.setStatus("Initiating transaction... (please wait)");

    var button;
    DoneButton.deployed().then(function(instance) {
      button = instance;
      return button.pressed(task, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error finishing task; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
  }

  App.start();
});
