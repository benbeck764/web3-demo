pragma solidity ^0.4.20;

contract WorkbenchBase {
    event WorkbenchContractCreated(string applicationName, string workflowName, address originatingAddress);
    event WorkbenchContractUpdated(string applicationName, string workflowName, string action, address originatingAddress);

    string internal ApplicationName;
    string internal WorkflowName;

    function WorkbenchBase(string applicationName, string workflowName) internal {
        ApplicationName = applicationName;
        WorkflowName = workflowName;
    }

    function ContractCreated() internal {
        WorkbenchContractCreated(ApplicationName, WorkflowName, msg.sender);
    }

    function ContractUpdated(string action) internal {
        WorkbenchContractUpdated(ApplicationName, WorkflowName, action, msg.sender);
    }
}

contract IoTDemo is WorkbenchBase("IoTDemo", "IoTDemo") {

    enum StateType { Created, InTransit, Completed, OutOfCompliance }

    StateType public State;

    address public InitiatingCounterparty;
    address public CurrentCounterparty;
    address public PreviousCounterparty;
    address public CurrentIoTDevice;

    string public VehicleId;
    int public Temperature;
    int public Humidity;
    int public AccelX;
    int public AccelY;
    int public AccelZ;
    uint public DateTimeRecorded; 

    bool public ComplianceStatus;
    string public ComplianceDetail;

    function IoTDemo(address device) public {
        ComplianceStatus = true;
        InitiatingCounterparty = msg.sender;
        CurrentCounterparty = InitiatingCounterparty;
        CurrentIoTDevice = device;
        State = StateType.Created;

        ContractCreated();
    }

    // function ingestTelemetry(int humidity, int temperature, uint timestamp) public {
    //     if (Device != msg.sender || State == PackageState.OutOfCompliance || State == PackageState.Completed) {
    //         revert();
    //     }

    //     LastSensorUpdateTimestamp = timestamp;
        
    //     if (humidity > MaxHumidity || humidity < MinHumidity) {
    //         ComplianceSensorType = SensorType.Humidity;
    //         ComplianceSensorReading = humidity;
    //         ComplianceDetail = "Humidity value out of range.";
    //         ComplianceStatus = false;
    //     } else if (temperature > MaxTemperature || temperature < MinTemperature) {
    //         ComplianceSensorType = SensorType.Temperature;
    //         ComplianceSensorReading = temperature;
    //         ComplianceDetail = "Temperature value out of range.";
    //         ComplianceStatus = false;
    //     }

    //     if (ComplianceStatus == false) {
    //         State = PackageState.OutOfCompliance;
    //     }
    //     contractUpdated("ingestTelemetry");
    // }

    function TransferResponsibility(address newCounterparty) public {
        if (CurrentCounterparty != msg.sender || State == StateType.Completed
                || State == StateType.OutOfCompliance || newCounterparty == CurrentIoTDevice) {
            revert();
        }

        if (State == StateType.Created) {
            State = StateType.InTransit;
        }

        PreviousCounterparty = CurrentCounterparty;
        CurrentCounterparty = newCounterparty;

        ContractUpdated("TransferResponsibility");
    }

    // function complete() public {
    //     if (SupplyChainOwner != msg.sender || State == PackageState.Completed || State == PackageState.OutOfCompliance) {
    //         revert();
    //     }

    //     State = PackageState.Completed;
    //     PreviousCounterparty = Counterparty;
    //     Counterparty = 0x0;
    //     contractUpdated("complete");
    // }
}