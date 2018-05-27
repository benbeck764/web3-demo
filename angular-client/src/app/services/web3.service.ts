import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Tx, TransactionReceipt, Transaction, PromiEvent, Block, Contract, Unit } from 'web3/types';
import { WindowRef } from './WindowRef';

import Web3 from 'web3';

export class Account {
  id: number;
  address: any;
  balance: number;
  balanceEth: string;
}

export enum BlockChainProviders {
  TestRPC = "http://localhost:8545",
  Geth = "http://52.165.165.118:8545",
  EthereumConsortium = "http://13.89.187.9:8545"
}

@Injectable()
export class Web3Service {

  private web3: Web3;
  private web3Accounts;
  private web3Url = BlockChainProviders.EthereumConsortium
  
  private coinBase: string;
  private isConnected: boolean = false;

  constructor(private _http: HttpClient, private _winRef: WindowRef) {
      // Instantiate a new instance of Web3 using the configured provider
      this.web3 = new Web3(new Web3.providers.HttpProvider(this.web3Url));

      // Once Web3 connection has been established, set the coin (Ether) base
      // Unlock the necessary accounts
      this.web3.eth.net.isListening().then(isConnected => {
        this.isConnected = isConnected;
        this.setCoinBase();
        this.unlockAccounts();
        console.log('Successfully connected Web3 instance to: ' + this.web3.currentProvider);
      }, error => {
        this.isConnected = false;
        console.log('Error: Unable to connect Web3 instance to: ' + this.web3.currentProvider);
      });

  }

  /// ACCOUNTS ///
  createAccount(): Observable<boolean> {
    return Observable.fromPromise(this.web3.eth.personal.newAccount("mySecureTestPassword123!@#"));
  }

  getAccounts(): Observable<string[]> {
    return Observable.fromPromise(this.web3.eth.getAccounts());
  }

  getAccountBalance(address: string) : Observable<number> {
    return Observable.fromPromise(this.web3.eth.getBalance(address));
  }

  private unlockAccounts() : void {
      this.web3.eth.personal.unlockAccount();
  }

  /// BLOCKS & TRANSACTIONS ///
  sendTransaction(tx: Tx) : PromiEvent<TransactionReceipt> {
    return this.web3.eth.sendTransaction(tx);
  }

  getBlock(blockNumber: number | "latest"): Observable<Block> {
    return Observable.fromPromise(this.web3.eth.getBlock(blockNumber));
  }

  getTransaction(hash: string) : Observable<Transaction> {
    return Observable.fromPromise(this.web3.eth.getTransaction(hash));
  }

  /// CONTRACTS ///
  newContract(abi: any, address?: string) : Contract {
    return new this.web3.eth.Contract(abi, address);
  }

  getContract(name: string) : Observable<Object> {
    return this._http.get("assets/" + name);
  }

  estimateGasPrice(data: Tx) : Promise<number> {
    return this.web3.eth.estimateGas(data);
  }

  /// ETHER HELPERS ///
  toEther(wei: number): any {
    return this.web3.utils.fromWei(wei, "ether");
  }

  toWei(value: string | number, unit?: Unit): any {
    return this.web3.utils.toWei(value.toString(), unit || "ether");
  }

  /// TYPE HELPERS ///
  toHex(val: any) : string {
    return this.web3.utils.toHex(val);
  }

  /// INTERNAL HELPERS ///
  isTestRPC() {
    return this.web3Url === BlockChainProviders.TestRPC;
  }

  isGeth() {
    return this.web3Url === BlockChainProviders.Geth;
  }

  isEthConsortium() {
    return this.web3Url === BlockChainProviders.EthereumConsortium
  }

  getWeb3ConnectionUrl(): string {
    return this.web3Url;
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }

  private setCoinBase() {
    this.web3.eth.getCoinbase().then((cb: string) => {
      this.coinBase = cb;
      console.log('Coinbase: ' + cb);
    });
  }

  getCoinBase(): string {
    return this.coinBase;
  }
}
