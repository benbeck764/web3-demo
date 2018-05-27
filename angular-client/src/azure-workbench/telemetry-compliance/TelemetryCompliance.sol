pragma solidity ^0.4.10;

contract LexingtonBase {
    event LexingtonContractCreated(string contractType, address originatingAddress);
    event LexingtonContractUpdated(string contractType, string action, address originatingAddress);
    
    string internal ContractType;

    function LexingtonBase(string contractType) internal {
        ContractType = contractType;
    }

    function contractCreated() internal {
        LexingtonContractCreated(ContractType, msg.sender);
    }

    function contractUpdated(string action) internal {
        LexingtonContractUpdated(ContractType, action, msg.sender);
    }
}

contract TelemetryCompliance is LexingtonBase("TelemetryCompliance") {
    enum PackageState { Creating, Created, InTransit, Completed, OutOfCompliance }
    PackageState public State;
    address public InitiatingCounterparty;
    address public Counterparty;
    address public PreviousCounterparty;
    address public Device;
    address public SupplyChainOwner;
    address public SupplyChainObserver;
    
    int public MinHumidity;
    int public MaxHumidity;
    int public MinTemperature;
    int public MaxTemperature;

    enum SensorType { None, Humidity, Temperature }
    SensorType public ComplianceSensorType;
    int public ComplianceSensorReading;
    bool public ComplianceStatus;
    string public ComplianceDetail;

    uint public LastSensorUpdateTimestamp;
    
    function TelemetryCompliance(address device, address supplyChainOwner, address supplyChainObserver, int minHumidity, int maxHumidity, int minTemperature, int maxTemperature) public {
        ComplianceStatus = true;
        ComplianceSensorReading = -1;
        InitiatingCounterparty = msg.sender;
        Counterparty = InitiatingCounterparty;
        Device = device;
        SupplyChainOwner = supplyChainOwner;
        SupplyChainObserver = supplyChainObserver;
        MinHumidity = minHumidity;
        MaxHumidity = maxHumidity;
        MinTemperature = minTemperature;
        MaxTemperature = maxTemperature;
        State = PackageState.Created;
        contractCreated();
    }

    function ingestTelemetry(int humidity, int temperature, uint timestamp) public {
        if (Device != msg.sender || State == PackageState.OutOfCompliance || State == PackageState.Completed) {
            revert();
        }

        LastSensorUpdateTimestamp = timestamp;
        
        if (humidity > MaxHumidity || humidity < MinHumidity) {
            ComplianceSensorType = SensorType.Humidity;
            ComplianceSensorReading = humidity;
            ComplianceDetail = "Humidity value out of range.";
            ComplianceStatus = false;
        } else if (temperature > MaxTemperature || temperature < MinTemperature) {
            ComplianceSensorType = SensorType.Temperature;
            ComplianceSensorReading = temperature;
            ComplianceDetail = "Temperature value out of range.";
            ComplianceStatus = false;
        }

        if (ComplianceStatus == false) {
            State = PackageState.OutOfCompliance;
        }
        contractUpdated("ingestTelemetry");
    }

    function transferResponsibility(address newCounterparty) public {
        if (Counterparty != msg.sender || State == PackageState.Completed || State == PackageState.OutOfCompliance || newCounterparty == Device) {
            revert();
        }

        if (State == PackageState.Created) {
            State = PackageState.InTransit;
        }

        PreviousCounterparty = Counterparty;
        Counterparty = newCounterparty;
        contractUpdated("transferResponsibility");
    }

    function complete() public {
        if (SupplyChainOwner != msg.sender || State == PackageState.Completed || State == PackageState.OutOfCompliance) {
            revert();
        }

        State = PackageState.Completed;
        PreviousCounterparty = Counterparty;
        Counterparty = 0x0;
        contractUpdated("complete");
    }
}