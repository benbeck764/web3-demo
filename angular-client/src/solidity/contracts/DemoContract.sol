pragma solidity ^0.4.17;
contract DemoContract {
    enum ContractStatus { Open, Sold }

    struct ContractDetails {
        string contractID;
        string title;
        string description;
        string strikePrice;
        uint timeWindow;
        string dateTime;
    }

    ContractDetails details;
    address cryptlet;
    address buyer;
    ContractStatus status;

    function DemoContract(string _contractId, string _title, string _description, string _strikerPrice, uint _timeWindow, string _dateTime) public {
        details = ContractDetails(_contractId, _title, _description, _strikerPrice, _timeWindow, _dateTime);
        cryptlet = msg.sender;
        status = ContractStatus.Open;
    }

    function getContractDetails() public constant returns (string, string, string, string, uint, string, ContractStatus) {
        return (details.contractID, details.title, details.description, details.strikePrice, details.timeWindow, details.dateTime, status);
    }

    function buyContract() public returns (bool success) {
        buyer = msg.sender;
        status = ContractStatus.Sold;
        return true;
    }
}