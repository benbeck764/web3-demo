import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../services/web3.service';
import { Contract, Tx, Transaction, TransactionReceipt } from 'web3/types';
import { setTimeout } from 'timers';

enum ContractState {
  Uninitiated = -1,
  Initiated = 0,
  ABICreated = 1,
  ContractInstanceCreated = 2,
  DeployingContract = 3,
  ContractDeployed = 4
}

@Component({
  selector: 'eth-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {

  private coinBase: string;

  private abi: any;
  private contractInstance: Contract;
  private contractState: ContractState;
  private contractAddress: string;
  private contractMethods: string[];

  private setValue: number;
  private setTxHash: string;
  private setTxReceipt: TransactionReceipt;

  private getValue: number;

  constructor(private _web3Service: Web3Service) { }

  ngOnInit() { 
    this.contractState = ContractState.Uninitiated;
  }

  createAndDeployContract() {
    this._web3Service.getContract("SimpleStorageTest.json").subscribe(res => {

      this.contractState = ContractState.Initiated; 

      // Get the Contract JSON (Created w/ Truffle)
      const contractJson: any = res;
      const byteCode = contractJson.bytecode.toString();
      this.abi = contractJson.abi;
      this.contractState = ContractState.ABICreated; 

      // Create the Contract Instance
      const instance = this._web3Service.newContract(this.abi);
      this.contractMethods = Object.keys(instance.methods);
      this.contractState = ContractState.ContractInstanceCreated; 

      // Deploy Contract
      this.contractState = ContractState.DeployingContract;
      let contractTx = instance.deploy({ data: byteCode, arguments: [] }).send({
        from: this.getFromAddress(), 
        gas: 4000000,
        gasPrice: this._web3Service.toWei(30, "shannon")
      }).then((contractInstance: Contract) => {
        // Contract Deployed
        this.contractState = ContractState.ContractDeployed; 
        this.contractInstance = contractInstance;
        this.contractAddress = contractInstance.options.address;
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  callSet() {
    if(this.setValue) {

      this.setTxHash = null;
      this.setTxReceipt = null;

      const tx: Tx = {
        from: this.getFromAddress(),
        gas: 4000000,
        gasPrice: this._web3Service.toWei(30, "shannon").toString()
      };

      this.contractInstance.methods.set(this.setValue)
      .send(tx)
        .on('transactionHash', (hash: string) => {
           this.setTxHash = hash;
        })
        .on('receipt', (receipt: TransactionReceipt) => {
          this.setTxReceipt = receipt;
        })
        .on('confirmation', (confirmationsNumber: number, receipt: TransactionReceipt) => {  
           // Do nothing for demo
        })
        .on('error', (error: Error,) => {
          console.log(error.message);
        });
    }
  }

  callGet() {
    this.contractInstance.methods.get().call()
    .then((result) => {
      this.getValue = result;
    });
  }

  private getFromAddress(): string {
    if(this._web3Service.isTestRPC()) {
      return this._web3Service.getCoinBase();
    } else if (this._web3Service.isGeth()) {
      return this._web3Service.getCoinBase();
    } else if (this._web3Service.isEthConsortium()) {
      return this._web3Service.getCoinBase();
    } else {
      return this._web3Service.getCoinBase();
    }
  }
}
