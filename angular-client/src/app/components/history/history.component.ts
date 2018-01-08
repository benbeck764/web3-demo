import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../services/web3.service';
import { Block, Transaction } from 'web3/types';

import * as moment from 'moment';

@Component({
  selector: 'eth-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public blockNumber: number;
  public block: Block;
  public transactions: Transaction[] = [];

  constructor(private _web3Service: Web3Service) { }

  ngOnInit() {
    this._web3Service.getBlock("latest").subscribe((block: Block) => {
      this.blockNumber = block.number;
      this.block = block;
      this.getTransactions();
    });
  }

  getBlock() {
    this._web3Service.getBlock(this.blockNumber).subscribe((block: Block) => {
      this.block = block;
      if(this.block != null) {
        this.getTransactions();
      } else {
        this.transactions = [];
      }
    });
  }

  private getTransactions() {
    var txs: Transaction[] = [];
    var hashes: any[] = [];
    this.block.transactions.forEach((tx: Transaction) => {
      hashes.push(tx);
    });

    hashes.forEach((hash: string) => {
      this._web3Service.getTransaction(hash).subscribe((tx: Transaction) => {
        txs.push(tx);
      });
    });
    this.transactions = txs;
  }

  decrementBlockNum() {
    this.blockNumber--;
    this.getBlock();
  }

  incrementBlockNum() {
    this.blockNumber++;
    this.getBlock();
  }

}
