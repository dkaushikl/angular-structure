import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { NotfoundComponent } from './notfound/notfound.component';

const routes: Routes = [
  { path: 'error', component: ErrorComponent },
  { path: 'notfound', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UiRoutingModule { }

