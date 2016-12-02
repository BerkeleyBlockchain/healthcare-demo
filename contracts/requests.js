contract Requests {

    address public requestor;

    string encrypted_requested_data;

    struct Request {
        string patient_name;// : "HASH_OF_PATIENT_NAME"
        string patient_DOB; //  : "HASH_OF_DOB"
        string patient_SSN; //  : "HASH_OF_SSN"
        string information; //  : "Arbitrary Information Requested"
    }

    struct Requestor {
        address hospital_address;
        string encrypted_requested_data;
        uint256 urgency;
    }

    function create_request(Requestor requestor, Request request){
        /*
        *** Creates a pending request to be fulfilled by another party that already knows the Patient Info Hashes ***
        ** INPUTS
        User Inputs might include:
            *Urgency - A sort of rating to determine the urgency of the request. This should also be used to calculate an ether cost
            *Desired Info - A JSON object with a format that can be similar to the following
                {
                patient_name : "HASH_OF_PATIENT_NAME"
                patient_DOB  : "HASH_OF_DOB"
                patient_SSN  : "HASH_OF_SSN"
                information  : "Arbitrary Information Requested"
            }


        ** OUTPUTS
        The USER INPUTS are ALSO broadcast to the network to create this pending request.
        Anyone with the corresponding patient information hashes should be able to fulfill the request and is incentivized by Ether reward
        */
    }

    function reply_request(Requestor requestor, Request request){
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
    }

    function validate() returns bool{
        /*
        *** Validation of data upon decryption and manual inspection of the data ***

        ** INPUTS
        None. Use encrypted_requested_data to decrypt and manually check data to see if it's what you wanted

        ** OUTPUTS

        True -> Send the ether, modify average response time
        False -> Don't send ether, re-request data
        */
    }

}
