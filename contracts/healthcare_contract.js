pragma solidity ^0.4.0;

contract Requests {

    address requestor;

    string public encrypted_response_data;

    string public request_hash;

    uint public reward;

    address responder;

    string public public_key;

    function Requests() {
        requestor = msg.sender;
    }

    /*
    Creates a request for a document with headers that match the hash.
    */
    function create_request(string requested_data_hash, string public_key) payable {
        if (!stringsEqual(request_hash, "")) {
            throw;
        }
        request_hash = requested_data_hash;
        reward = msg.value;
        public_key = public_key;
    }

    /*
    Attempts to respond to the request. If the hash matches, wait for the
    the one who requested the information to approve.
    */
    function respond(string request, string encrypted_data) {
        if (stringsEqual(request_hash, request)) {
            encrypted_response_data = encrypted_data;
            responder = msg.sender;
        } else {
            throw;
        }
    }

    /*
    The requestor validates that the response was indeed correct information.
    Once validated, the one who supplied the information is assigned the reward.
    */
    function validate(string request, bool valid) returns (bool) {
        if (msg.sender != requestor) { throw; }
        if (valid) {
            if (stringsEqual(request_hash, request)) {
                /* Send reward to responder, self-destruct. */
                var amount = reward;
                reward = 0;
                if (!responder.send(amount)) {
                    reward = amount;
                }
                selfdestruct(requestor);
            }
        } else {
            encrypted_response_data = "";
            responder = address(0);
        }
        return false;
    }

    function stringsEqual(string storage _a, string memory _b) internal returns (bool) {
        bytes storage a = bytes(_a);
        bytes memory b = bytes(_b);
        if (a.length != b.length)
            return false;
        for (uint i = 0; i < a.length; i ++)
            if (a[i] != b[i])
                return false;
        return true;
    }

}
