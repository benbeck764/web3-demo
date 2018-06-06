import { Component, OnInit } from '@angular/core';
import { Block, Transaction } from 'web3/types';
import { Web3Service } from '../../services/web3.service';
import * as InputDataDecoder from 'ethereum-input-data-decoder';

export class TelemetryTransaction implements Transaction {
  hash: string
  nonce: number
  blockHash: string
  blockNumber: number
  transactionIndex: number
  from: string
  to: string
  value: string
  gasPrice: string
  gas: number
  input: string
  v?: string
  r?: string
  s?: string
  vehicleId: string
  temperature: number
  humidity: number
  positionFromBeacons: string
  accelX: number
  accelY: number
  accelZ: number
}

@Component({
  selector: 'eth-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.scss']
})
export class TelemetryComponent implements OnInit {

  private transactions: Array<TelemetryTransaction> = [];
  private ingestTelemetryFunctionAbi = [{"constant":false,"inputs":[{"name":"vehicleId","type":"string"},{"name":"humidity","type":"int256"},{"name":"temperature","type":"int256"},{"name":"beaconData","type":"string"},{"name":"accelX","type":"int256"},{"name":"accelY","type":"int256"},{"name":"accelZ","type":"int256"}],"name":"IngestTelemetry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
  constructor(private _web3Service: Web3Service) { }

  ngOnInit() {
    this._web3Service.getBlock("latest").subscribe((block: Block) => {
      this.getLatestTransactions(block.number);
    });
  }

  getLatestTransactions(startingBlock: number) {

    const decoder = new InputDataDecoder(this.ingestTelemetryFunctionAbi);
    let txHashes: Array<any> = [];
    for(let i = 0; i < 100; i++) {
      this._web3Service.getBlock(startingBlock - i).subscribe((block: Block) => {
        if(block.transactions.length > 0) {
          for(let b = 0; b < block.transactions.length; b++) {
            this._web3Service.getTransaction(block.transactions[b].toString()).subscribe((tx: Transaction) => {

              const decodedTxParams = decoder.decodeData(tx.input);
              let telemetryTx: TelemetryTransaction = {
                hash: tx.hash,
                nonce: tx.nonce,
                blockHash: tx.blockHash,
                blockNumber: tx.blockNumber,
                transactionIndex: tx.transactionIndex,
                from: tx.from,
                to: tx.to,
                value: tx.value,
                gasPrice: tx.gasPrice,
                gas: tx.gas,
                input: tx.input,
                v: tx.v,
                r: tx.r,
                s: tx.s,
                vehicleId: decodedTxParams.inputs[0],
                temperature: decodedTxParams.inputs[1].words[0],
                humidity: decodedTxParams.inputs[2].words[0],
                positionFromBeacons: decodedTxParams.inputs[3],
                accelX: decodedTxParams.inputs[4].words[0],
                accelY: decodedTxParams.inputs[5].words[0],
                accelZ: decodedTxParams.inputs[6].words[0],
              }

              this.transactions.push(telemetryTx);
            });
          }
        }
      });
    }
  }
}
