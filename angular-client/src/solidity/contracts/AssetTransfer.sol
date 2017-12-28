pragma solidity ^0.4.10;

contract AssetTransfer {

    enum AssetState { Created, Active, OfferPlaced, PendingInspection, Inspected, Appraised, NotionalAcceptance, BuyerAccepted, SellerAccepted, Accepted, Complete, Terminated }
    AssetState public State;
   
    address public Owner;
    string public Description;
    uint public AskingPrice;
    
    address public Buyer;
    uint public OfferPrice;
    address public Inspector;
    address public Appraiser;

    function AssetTransfer(string description, uint256 price) public {
        Owner = msg.sender;
        AskingPrice = price;
        Description = description;
        State = AssetState.Active;
    }

    function terminate() public {
        if (Owner != msg.sender) {
            revert();
        }
        State = AssetState.Terminated;
    }

    function modify(string description, uint256 price) public {
        if (Owner != msg.sender) {
            revert();
        }
        Description = description;
        AskingPrice = price;
    }

    function makeOffer(address inspector, address appraiser, uint256 offerPrice) public {
        if (inspector == 0x0 || appraiser == 0x0 || offerPrice == 0) {
            revert();
        }

        if (Buyer != 0x0 || Owner == msg.sender) { 
            revert();
        }
        
        Buyer = msg.sender;
        Inspector = inspector;
        Appraiser = appraiser;
        OfferPrice = offerPrice;
        State = AssetState.OfferPlaced;
    }

    function modifyOffer(uint256 offerPrice) public {
        if (Buyer != msg.sender || offerPrice == 0) {
            revert();
        }
        OfferPrice = offerPrice;
    }

    function acceptOffer() public {
        if (Owner != msg.sender || State != AssetState.OfferPlaced) {
            revert();
        }
        State = AssetState.PendingInspection;
    }

    function reject() public {
        if (Owner != msg.sender) {
            revert();
        }
		State = AssetState.Active;
	}

    function rescindOffer() public {
        if (Buyer != msg.sender) {
            revert();
        }

        Buyer = 0x0;
        OfferPrice = 0;
        State = AssetState.Active;
    }

    function markAppraised() public {
        if (Appraiser != msg.sender) {
            revert();
        }
        if (State == AssetState.PendingInspection) {
            State = AssetState.Appraised;
        } else if (State == AssetState.Inspected) {
            State = AssetState.NotionalAcceptance;
        }
    }

    function markInspected() public {
        if (Inspector != msg.sender) {
            revert();
        }
        if (State == AssetState.PendingInspection) {
            State = AssetState.Inspected;
        } else if (State == AssetState.Appraised) {
            State = AssetState.NotionalAcceptance;
        }
    }

    function accept() public {
		if (msg.sender != Buyer && msg.sender != Owner) {
			revert();
		}
		
		if (State != AssetState.NotionalAcceptance && State != AssetState.BuyerAccepted && State != AssetState.SellerAccepted) {
			revert();
		}
		
		if (msg.sender == Buyer) {
			if (State == AssetState.NotionalAcceptance) {
				State = AssetState.BuyerAccepted;
			} else if (State == AssetState.SellerAccepted) {
				State = AssetState.Accepted;
			}
		} else {
			if (State == AssetState.NotionalAcceptance) {
				State = AssetState.SellerAccepted;
			} else if (State == AssetState.BuyerAccepted) {
				State = AssetState.Accepted;
			}
		}
    }
}
