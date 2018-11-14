import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import { EformSpinnerComponent} from './components';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    EformSpinnerComponent
  ],
  exports: [
    EformSpinnerComponent
  ]
})
export class EformSharedModule {
}
