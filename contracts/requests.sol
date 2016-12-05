pragma solidity ^0.4.2;

contract Requests {
    Request req;

    string public encrypted_requested_data = "Empty";

    struct Request {
        Requestor requestor;
        string request_hash; /* sha3(Patient Name + Patient DOB + Patient SSN)
                             No spaces, always include middle initial, all lowercase,
                             mmddyyyy, 000000000 if patient has no ssn */
        string request_information; //  : 'Arbitrary request_information Requested'
        string transaction_state; // Waiting, Pending Verification, Verified, Invalid
        address reply_source; // Address of the party replying to the request
    }

    struct Requestor {
        address participant_address;
        uint256 urgency; // Variable to hold ether that is released upon successful verification
    }

    function create_request(address participant_address1, string request_hash1, string request_information1) payable {
        // *** Creates a pending request to be fulfilled by another party that already knows the request hash ***
        Requestor memory r = Requestor(msg.sender, msg.value);
        req = Request(r, request_hash1, request_information1, "Waiting", msg.sender);
    }

    function reply_request(string request_hash, string encrypted_data) payable{
        /*
        *** Fulfils an outstanding request on the network ***

        ** INPUTS
        Recieved info from the created request would act as an input

        ** OUTPUTS
        encrypted_requested_data would be modified to contain the requested data,
        ENCRYPTED to the public key of the requestor (requestor address) such that
        the requestor's private key must be used to decrypt the publicly avaliable data

        The resulting data would be subject to validation by the requestor.
        Once validated, the ether is sent to the data sender

        */
        if (!stringsEqual(req.transaction_state, 'Waiting')) {
            throw;
        }

        if (stringsEqual(req.request_hash, request_hash)) {
            encrypted_requested_data = encrypted_data;
            req.reply_source = msg.sender;
            req.transaction_state = 'Pending Verification';
        } else {
            throw;
        }
    }

    function validate(string request_hash, bool valid) payable{
        /*
        *** Validation of data upon decryption and manual inspection of the data ***

        ** INPUTS
        None. Use encrypted_requested_data to decrypt and manually check data to see if it's what you wanted

        ** OUTPUTS

        True -> Send the ether, modify average response time
        False -> Don't send ether, re-request data
        */
        if (stringsEqual(req.request_hash, request_hash)){
            if (valid == true){
                req.transaction_state = 'Verified';
                req.reply_source.send(req.requestor.urgency);
                //Release funds to sender of data
            }else{ //INVALID data
                req.transaction_state = 'Invalid';
                //Return funds to Requestor
                encrypted_requested_data = '';
                req.requestor.participant_address.send(req.requestor.urgency);
            }
        } else{
        throw;
        }
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
