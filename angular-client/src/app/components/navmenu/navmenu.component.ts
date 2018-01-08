import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../services/web3.service';

@Component({
  selector: 'eth-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.scss']
})
export class NavmenuComponent implements OnInit {

  private web3Url: string;
  private provider: string;
  private isConnected: boolean;

  constructor(private _web3Service: Web3Service) { 
    
  }

  ngOnInit() {
    this.web3Url = this._web3Service.getWeb3ConnectionUrl();
    this.isConnected = this._web3Service.getIsConnected();
    console.log('navmenu:' + this.isConnected);
    if(this._web3Service.isTestRPC()) {
      this.provider = "TestRPC";
      this.isConnected = this._web3Service.getIsConnected();
    } else if (this._web3Service.isGeth()) {
      this.provider = "Go Ethereum";
      this.isConnected = this._web3Service.getIsConnected();
    } else if (this._web3Service.isEthConsortium()) {
      this.provider = "Ethereum Consortium Network";
      this.isConnected = this._web3Service.getIsConnected();
    } else {
      this.provider = "Unknown";
    }
  }

}
