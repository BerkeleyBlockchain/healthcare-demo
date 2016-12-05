pragma solidity ^0.4.0;

contract Requests {

    address contract_owner;

    struct Request
    {
        bytes32 requested_hash;
        address requester;
        string response;
        uint reward;
        address responder;
    }

    Request current_request;

    /*
    Contract constructor. Only called once.
    */
    function Requests() {
        contract_owner = msg.sender;
    }

    /*
    Creates a request for a document with headers that match the hash.
    */
    function create_request(bytes32 requested_data_hash) payable {
        /* Request already exists, revert tx. */
        if (current_request.requester != address(0)) {
            throw;
        } else {
            current_request = Request({
                requested_hash: requested_data_hash,
                requester: msg.sender,
                response: "",
                reward: msg.value,
                responder: address(0)
            });
        }
    }

    function get_reward() constant returns (uint) {
        return current_request.reward;
    }

    function get_request_hash() constant returns (bytes32) {
        return current_request.requested_hash;
    }

    /* TODO: function get_most_urgent()*/

    /*
    Attempts to respond to the request. If the hash matches, wait for the
    the one who requested the information to approve.
    */
    function respond(bytes32 requested_data_hash, string encrypted_data) {
        if (!stringsEqual(current_request.requested_hash, requested_data_hash)) {
            throw;
        } else {
            current_request.response = encrypted_data;
            current_request.responder = msg.sender;
        }
    }

    /*
    The requester validates that the response was indeed correct information.
    Once validated, the one who supplied the information is assigned the reward.
    Valid transactions are wiped from the contract to save storage costs.
    */
    function validate(bytes32 requested_data_hash, bool valid) returns (bool) {
        if (!stringsEqual(current_request.requested_hash, requested_data_hash) || current_request.requester != msg.sender) {
            throw;
        }
        if (valid) {
            var amount = current_request.reward;
            if (amount > 0) {
                current_request.reward = 0;
                if (!current_request.responder.send(amount)) {
                    return false;
                }
            }
            /* TODO: self destruct contract */
            return true;
        } else {
            current_request.response = "";
            current_request.responder = address(0);
        }
        return false;
    }

    function stringsEqual(bytes32 storage _a, string memory _b) internal returns (bool) {
        bytes storage a = bytes(_a);
        bytes memory b = bytes(_b);
        if (a.length != b.length) {
            return false;
        }
        for (uint i = 0; i < a.length; i ++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }

}
