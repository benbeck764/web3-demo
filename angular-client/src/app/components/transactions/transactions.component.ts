import { Component, OnInit, Input, transition } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Account, Web3Service } from '../../services/web3.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tx, TransactionReceipt, Transaction } from 'web3/types';
import { access } from 'fs';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Confirm Transaction</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>To: {{transaction.to}}</p>
      <p>From: {{transaction.from}}</p>
      <p>Amount: {{_web3Service.toEther(transaction.value)}} ETH</p>
      <pre>{{txHash}}</pre>
      <pre>{{txReceipt | json}}</pre>
      <pre *ngIf="txConfirmationsNumber >= 0">Confirmations: {{txConfirmationsNumber}}</pre>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
      <button type="button" class="btn btn-primary" (click)="confirmTransaction()">Confirm</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() transaction: Tx;
  private txHash: string;
  private txReceipt: TransactionReceipt;
  private txConfirmationsNumber: number = -1;

  constructor(public activeModal: NgbActiveModal, private _web3Service: Web3Service) {}

  confirmTransaction() {
    if(this.transaction.from !== "" && this.transaction.to !== "" && this.transaction.value && this.transaction.value > 0) {
      this._web3Service.sendTransaction(this.transaction)
        .on('transactionHash', (hash: string) => {
           this.txHash = hash;
        })
        .on('receipt', (receipt: TransactionReceipt) => {
            this.txReceipt = receipt;
        })
        .on('confirmation', (confirmationsNumber: number, receipt: TransactionReceipt) => {  
            this.txConfirmationsNumber = confirmationsNumber;
        })
        .on('error', (error: Error,) => {
          console.log(error.message);
        }); // If a out of gas error, the second parameter is the receipt.
      }
  }
}

@Component({
  selector: 'eth-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  private accounts: string[] = [];
  private fromAccountAddr: string = "";
  private toAccountAddr: string = "";
  private amount: number;
  
  constructor(private _web3Service: Web3Service, private _modalService: NgbModal) { }

  ngOnInit() {
    this._web3Service.getAccounts().subscribe((accounts: string[]) => {
      this.accounts = accounts;
    });
  }

  openTransactionModal(): void {
    if(this.fromAccountAddr !== "" && this.toAccountAddr !== "" && this.amount && this.amount > 0) {
      const modalRef = this._modalService.open(NgbdModalContent);
      var transaction: Tx = {
        from: this.fromAccountAddr,
        to: this.toAccountAddr,
        // (!) Important (!) -- Need to calculate value based upon Wei and NOT Ether
        value: this._web3Service.toWei(this.amount)
      }
      modalRef.componentInstance.transaction = transaction;
    }
  }
}
