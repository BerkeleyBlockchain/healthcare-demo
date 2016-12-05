var healthcareSource = 'pragma solidity ^0.4.0; contract Requests { address requestor; string public encrypted_response_data; string public request_hash; uint public reward; address responder; mapping(address => uint) accumulated_rewards; function Requests() { } /* Creates a request for a document with headers that match the hash. */ function create_request(string requested_data_hash) payable { if (!stringsEqual(request_hash, "")) { throw; } requestor = msg.sender; request_hash = requested_data_hash; reward = msg.value; } /* Attempts to respond to the request. If the hash matches, wait for the the one who requested the information to approve. */ function respond(string request, string encrypted_data) { if (stringsEqual(request_hash, request)) { encrypted_response_data = encrypted_data; responder = msg.sender; } else { throw; } } /* The requestor validates that the response was indeed correct information. Once validated, the one who supplied the information is assigned the reward. */ function validate(string request, bool valid) returns (bool) { if (msg.sender != requestor) { throw; } if (valid) { if (stringsEqual(request_hash, request)) { request_hash = ""; accumulated_rewards[responder] += reward; reward = 0; return true; } } else { encrypted_response_data = ""; responder = address(0); } return false; } function check_accumulated_rewards() constant returns (uint) { return accumulated_rewards[msg.sender]; } /* Someone withdraws their funds, if they have any. */ function withdraw() returns (bool) { var amount = accumulated_rewards[msg.sender]; if (amount > 0) { accumulated_rewards[msg.sender] = 0; if (!msg.sender.send(amount)) { accumulated_rewards[msg.sender] = amount; return false; } } return true; } function stringsEqual(string storage _a, string memory _b) internal returns (bool) { bytes storage a = bytes(_a); bytes memory b = bytes(_b); if (a.length != b.length) return false; for (uint i = 0; i < a.length; i ++) if (a[i] != b[i]) return false; return true; } } '

var healthcareCompiled = eth.compile.solidity(healthcareSource);

var healthcareContract = eth.contract(healthcareCompiled.Requests.info.abiDefinition);


var healthcare = healthcareContract.new({from:eth.accounts[0], data: healthcareCompiled.Requests.code, gas: 3000000}, function(e, contract) { if (!e) { if(!contract.address) {console.log("Contract tx send: Txhash: "+ contract.transactionHash + " waiting to be mined..."); } else {console.log("Contract mined! Address: " + contract.address);console.log(contract);}}})

healthcare.create_request("stevencheng", {from: eth.accounts[0], value: web3.toWei(10, 'ether')});

healthcare.respond.sendTransaction("stevencheng", "mj420", {from: eth.accounts[0]})

healthcare.validate.sendTransaction("stevencheng", true, {from: eth.accounts[0]})

healthcare.check_accumulated_rewards()

healthcare.withdraw.sendTransaction({from: eth.accounts[0]} )
