import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { ErrorComponent } from './error/error.component';
import { LoaderComponent } from './loader/loader.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { UiRoutingModule } from './ui.routing';

const component = [LoaderComponent, ErrorComponent, NotfoundComponent];

@NgModule({
  declarations: [...component],
  exports: [...component],
  imports: [SharedModule, UiRoutingModule]
})

export class UiModule { }

