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

    enum StateType 
    { 
        Created, 
        InTransitFromMinneapolis,
        InTransitFromMilwaukee,
        ReceivedInChicago, 
        Completed, 
        OutOfCompliance 
    }

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

    int private MinTemperature = 0;
    int private MaxTemperature = 100;
    int private MinHumidity = 0;
    int private MaxHumidity = 100; 

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

    function IngestTelemetry(string vehicleId, int humidity, int temperature, int accelX, int accelY, int accelZ) public {
        if (CurrentIoTDevice != msg.sender || State == StateType.OutOfCompliance || State == StateType.Completed) {
            revert();
        }

        DateTimeRecorded = now;
        VehicleId = vehicleId;
        Humidity = humidity;
        Temperature = temperature;
        AccelX = accelX;
        AccelY = accelY;
        AccelZ = accelZ;
        
        if (humidity > MaxHumidity || humidity < MinHumidity) {
            ComplianceDetail = "Humidity value out of range.";
            ComplianceStatus = false;
        } else if (temperature > MaxTemperature || temperature < MinTemperature) {
            ComplianceDetail = "Temperature value out of range.";
            ComplianceStatus = false;
        }

        if (ComplianceStatus == false) {
            State = StateType.OutOfCompliance;
        }

        ContractUpdated("IngestTelemetry");
    }

    function TransferToMinneapolis() public {
        if (InitiatingCounterparty != msg.sender) {
            revert();
        }

        if (State == StateType.Completed || State == StateType.OutOfCompliance) {
            revert();
        }

        if (State == StateType.Created) {
            State = StateType.InTransitFromMinneapolis;
        }

        PreviousCounterparty = CurrentCounterparty;

        ContractUpdated("TransferToMinneapolis");
    }

    function TransferToMilwaukee(address newCounterparty, address newDevice) public {
        if (CurrentCounterparty != msg.sender || newCounterparty == CurrentIoTDevice) {
            revert();
        }
         
        if (State != StateType.InTransitFromMinneapolis || State == StateType.Completed || State == StateType.OutOfCompliance) {
            revert();
        }

        State = StateType.InTransitFromMilwaukee;
        
        PreviousCounterparty = CurrentCounterparty;
        CurrentCounterparty = newCounterparty;
        CurrentIoTDevice = newDevice;

        ContractUpdated("TransferToMilwaukee");
    }

    function TransferToChicago(address newCounterparty) public {
        if (CurrentCounterparty != msg.sender || newCounterparty == CurrentIoTDevice) {
            revert();
        }

        if (State != StateType.InTransitFromMilwaukee || State == StateType.Completed || State == StateType.OutOfCompliance) {
            revert();
        }

        State = StateType.ReceivedInChicago;
    
        PreviousCounterparty = CurrentCounterparty;
        CurrentCounterparty = newCounterparty;

        ContractUpdated("TransferToChicago");
    }

    function Complete() public {
        if (CurrentCounterparty != msg.sender || State == StateType.Completed || State == StateType.OutOfCompliance) {
            revert();
        }

        if (State != StateType.ReceivedInChicago) {
            revert();
        }

        State = StateType.Completed;
        PreviousCounterparty = CurrentCounterparty;
        CurrentCounterparty = 0x0;

        ContractUpdated("Complete");
    }
}