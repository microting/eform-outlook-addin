import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { MainComponent } from './main/main.component';
import { EditComponent } from './edit/edit.component';
import { CraneComponent } from './crane/crane.component';
import { WaterComponent } from './water/water.component';

import { EntitySelectService } from './common/services/advanced';
import { SitesService } from './common/services/advanced';
import { IdentityService } from './common/services/advanced/identity.service';
import { EformSharedModule } from './common/modules/eform-shared/eform-shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { EformImportedModule } from './common/modules/eform-imported/eform-imported.module';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'eform' }),
    FormsModule,
    AppRoutingModule,
    EformSharedModule,
    NgSelectModule,
    EformImportedModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    MainComponent,
    EditComponent,
    CraneComponent,
    WaterComponent
  ],
  providers: [ EntitySelectService, SitesService, IdentityService ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
