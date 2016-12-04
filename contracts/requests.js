contract Requests {

    struct Request {
        Requestor requestor;
        string request_hash; /* sha3(Patient Name + Patient DOB + Patient SSN)
                             No spaces, always include middle initial, all lowercase,
                             mmddyy, 000000000 if patient has no ssn */
        string information; //  : "Arbitrary Information Requested"
        string transaction_state; // Waiting, Pending Verification, Verified, Invalid
        address reply_source; // Address of the party replying to the request
    }

    struct Requestor {
        address participant_address;
        string encrypted_requested_data
        uint256 urgency; // Variable to hold ether that is released upon successful verification
    }

    Request req;

    function create_request(Request request) payable{
        // *** Creates a pending request to be fulfilled by another party that already knows the Patient Info Hashes ***
        req = request;
    }

    function reply_request(Request request) payable{
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
        if (request.transaction_state != "Waiting") {
            throw;
        }

        if (stringsEqual(request.request_hash, req.request_hash)) {
            req.encrypted_response_data = request.encrypted_data;
            req.reply_source = msg.sender;
            req.transaction_state = "Pending Verification";
        } else {
            throw;
        }


    }

    function validate(Request request, bool valid) payable returns (bool) {
        /*
        *** Validation of data upon decryption and manual inspection of the data ***

        ** INPUTS
        None. Use encrypted_requested_data to decrypt and manually check data to see if it's what you wanted

        ** OUTPUTS

        True -> Send the ether, modify average response time
        False -> Don't send ether, re-request data
        */
        if (stringsEqual(request.request_hash, req.request_hash)){
            if (valid){
                req.transaction_state = "Verified";
                req.reply_source.send(request.urgency);
                //Release funds to sender of data
            }else{ //INVALID data
                req.transaction_state = "Invalid";
                //Return funds to Requestor
                req.encrypted_data = "";
                req.participant_address.send(request.urgency);
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
