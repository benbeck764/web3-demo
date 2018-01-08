import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule }     from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import 'rxjs/add/observable/fromPromise';
import { IfObservable } from 'rxjs/observable/IfObservable';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './components/app/app.component';
import { NavmenuComponent } from './components/navmenu/navmenu.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionsComponent, NgbdModalContent } from './components/transactions/transactions.component';

import { WindowRef } from './services/WindowRef';3
import { Web3Service } from './services/web3.service';
import { HistoryComponent } from './components/history/history.component';
import { ContractComponent } from './components/contract/contract.component';

@NgModule({
  declarations: [
    AppComponent,
    NavmenuComponent,
    DashboardComponent,
    TransactionsComponent,
    NgbdModalContent,
    HistoryComponent,
    ContractComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  entryComponents: [
    NgbdModalContent
  ],
  providers: [WindowRef, Web3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
