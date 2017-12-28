import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import Web3 from 'web3';
import { Tx, TransactionReceipt, Transaction, PromiEvent, Block } from 'web3/types';
var Accounts = require('web3-eth-accounts');

export class Account {
  id: number;
  address: any;
  balance: number;
  balanceEth: string;
}

@Injectable()
export class Web3Service {

  private web3: Web3;
  private web3Accounts;
  private testRpcUrl: string = "http://localhost:8545";
  private gethTestLabsUrl: string = "http://52.165.165.118:8545";

  constructor() { 
    var web3Url:string = this.testRpcUrl;
    
    this.web3 = new Web3(new Web3.providers.HttpProvider(web3Url));
    this.web3Accounts = new Accounts(this.testRpcUrl);
    this.web3.eth.net.isListening().then(isConnected => {
        console.log('Successfully connected to Web3 instance at: ' + web3Url);
    }, error => {
        console.log('Unable to connect to Web3 instance at: ' + web3Url);
    })
  }

  createAccount(): Observable<boolean> {
    return Observable.fromPromise(this.web3.eth.personal.newAccount("mySecureTestPassword123!@#"));
  }

  getAccounts(): Observable<string[]> {
    return Observable.fromPromise(this.web3.eth.getAccounts());
  }

  getAccountBalance(address: string) : Observable<number> {
    return Observable.fromPromise(this.web3.eth.getBalance(address));
  }

  sendTransaction(tx: Tx) : PromiEvent<TransactionReceipt> {
    return this.web3.eth.sendTransaction(tx);
  }

  getBlock(blockNumber: number | "latest"): Observable<Block> {
    return Observable.fromPromise(this.web3.eth.getBlock(blockNumber));
  }

  getTransaction(hash: string) : Observable<Transaction> {
    return Observable.fromPromise(this.web3.eth.getTransaction(hash));
  }

  toEther(wei: number): any {
    return this.web3.utils.fromWei(wei, "ether");
  }

  toWei(ether: string | number): number {
    return this.web3.utils.toWei(ether, "ether");
  }

}
