import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PellModule} from './pell/pell.module';

@NgModule({
  imports: [
    CommonModule,
    PellModule
  ],
  declarations: [
  ],
  exports: [
    PellModule
  ]
})
export class EformImportedModule {
}
