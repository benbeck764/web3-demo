pragma solidity ^0.4.18;

contract IoTDemo {

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
    string public PositionFromBeacons;
    uint public DateTimeRecorded;

    int private MinTemperature = 0;
    int private MaxTemperature = 100;
    int private MinHumidity = 0;
    int private MaxHumidity = 100; 

    bool public ComplianceStatus;
    string public ComplianceDetail;

    function IoTDemo() public {
        ComplianceStatus = true;
        InitiatingCounterparty = msg.sender;
        CurrentCounterparty = InitiatingCounterparty;
        State = StateType.Created;
    }

    function IngestTelemetry(string vehicleId, int humidity, int temperature, string beaconData, int accelX, int accelY, int accelZ) public {
        DateTimeRecorded = now;
        VehicleId = vehicleId;
        Humidity = humidity;
        Temperature = temperature;
        PositionFromBeacons = beaconData;
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
    }
}