import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { TransactionsComponent } from './components/transactions/transactions.component';
import { HistoryComponent } from './components/history/history.component';
import { ContractComponent } from './components/contract/contract.component';
import { TelemetryComponent } from './components/telemetry/telemetry.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'contract', component: ContractComponent },
  { path: 'telemetry', component: TelemetryComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
