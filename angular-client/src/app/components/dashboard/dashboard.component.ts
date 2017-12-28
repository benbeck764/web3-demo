import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Account, Web3Service } from '../../services/web3.service';

@Component({
  selector: 'eth-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private accounts: Account[] = [];

  constructor(private _web3Service: Web3Service) { }

  ngOnInit() {
    this.updateAccounts();
  }

  createAccount() {
    this._web3Service.createAccount().subscribe(null, null, () => this.updateAccounts());
  }

  private updateAccounts() {
    var updatedAccounts : Account[] = [];
    this._web3Service.getAccounts().subscribe((accounts: string[]) => {
      accounts.forEach((address: string, idx: number) =>
      {
        var acc = new Account();
        acc.id = idx;
        acc.address = address;
        this._web3Service.getAccountBalance(acc.address).subscribe((balance: number) => {
          acc.balance = balance;
          acc.balanceEth = this._web3Service.toEther(acc.balance);
          updatedAccounts.push(acc);
          updatedAccounts = updatedAccounts.sort((a, b) => a.id - b.id);
        });
      })
      this.accounts = updatedAccounts;
    });
  }
}
