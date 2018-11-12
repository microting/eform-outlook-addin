import {Component, OnInit, NgZone} from '@angular/core';
import {Water} from '../service/data';
import {DataService} from '../service/data.service';
import {i18n} from '../service/i18n';
import {StateService} from '../service/state.service';
import {CRANEID, WATERID, WaterState} from '../service/state';
import {EntitySelectService} from '../common/services/advanced';
import {
  AdvEntitySelectableGroupEditModel,
  AdvEntitySelectableItemModel
} from '../common/models/advanced';
import {SitesService} from '../common/services/advanced/sites.service';
import {SiteNameDto} from '../common/models/dto';

declare const Office: any;

@Component({
  selector: 'app-water',
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.css']
})

export class WaterComponent implements OnInit {

  // content;
  // uitext;
  state: WaterState;
  selectedShip: AdvEntitySelectableItemModel;
  selectedQuay: AdvEntitySelectableItemModel;
  selectedSites: Array<SiteNameDto> = [];
  currentMessage: string;
  ships: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  quays: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  sitesDto: Array<SiteNameDto> = [];

  constructor(private zone: NgZone,
              public data: DataService,
              public _state: StateService,
              private entitySelectService: EntitySelectService, private sitesService: SitesService) {
  }

  ngOnInit() {
    // this.uitext = i18n.getTexts(this._state.state.locale);
    this.loadShips();
    this.loadQuays();
    this.loadSites();
    // this.getWater();
    // this.getState();
  }

  // getState(): void {
  //   this._state.getWaterState().subscribe(ws => {
  //     this.zone.run(() => {
  //       this.state = ws;
  //     });
  //   });
  // }

  // getWater(): void {
  //   // this.data.getWater().subscribe(c => {
  //   //   this.zone.run(() => {
  //   //     this.content = {
  //   //       ship: {
  //   //         label: this.uitext.water.label_ship,
  //   //         label_edit: this.uitext.water.label_edit,
  //   //         label_refresh: this.uitext.water.label_refresh,
  //   //         value: c.ship
  //   //       },
  //   //       quay: {
  //   //         label: this.uitext.water.label_quay,
  //   //         label_edit: this.uitext.water.label_edit,
  //   //         label_refresh: this.uitext.water.label_refresh,
  //   //         value: c.quay
  //   //       },
  //   //       workers: {
  //   //         label: this.uitext.water.label_workers,
  //   //         label_edit: this.uitext.water.label_edit,
  //   //         label_refresh: this.uitext.water.label_refresh,
  //   //         value: c.workers
  //   //       },
  //   //       message: {
  //   //         label: this.uitext.water.label_message,
  //   //         value: c.message
  //   //       }
  //   //     };
  //   //   });
  //   // });
  // }

  onSites(site: SiteNameDto) {
    // this.selectedSites[siteUId] = !this.selectedSites[siteUId];
    if (this.selectedSites.includes(site)) {
      this.selectedSites.push(site);
    }
  }

  loadShips() {
    console.log('loadShips called');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    const callerUrl = localStorage.getItem('callerUrl');
    // console.log('userIdentityToken is ' + userIdentityToken);
    this.entitySelectService.getEntitySelectableGroupOutlook('5477', userIdentityToken, callerUrl).subscribe((data) => {
      if (data && data.success) {
        this.ships.advEntitySelectableItemModels = data.model.entityGroupItemLst;
      }
    });
  }

  loadQuays() {
    console.log('loadQuays called');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    const callerUrl = localStorage.getItem('callerUrl');
    // console.log('userIdentityToken is ' + userIdentityToken);
    this.entitySelectService.getEntitySelectableGroupOutlook('5482', userIdentityToken, callerUrl).subscribe((data) => {
      if (data && data.success) {
        this.quays.advEntitySelectableItemModels = data.model.entityGroupItemLst;
      }
    });
  }

  loadSites() {
    console.log('loadSites called');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    const callerUrl = localStorage.getItem('callerUrl');
    console.log('userIdentityToken is ' + userIdentityToken);
    this.sitesService.getAllSites(userIdentityToken, callerUrl).subscribe((data) => {
      if (data && data.success) {
        this.sitesDto = data.model;
      }
    });
  }

  onInsert(): void {
    // const lang = this._state.state.locale;
    // this.uitext = i18n.getTexts(lang);

    let txt_subject;
    let txt_body;
    // } else if ( this.state === WATERID ) {
      // txt_subject = WATERID;
      // txt_subject = this.uitext.eform[WATERID];
      txt_subject = 'Vand';
      // txt_body = this.uitext.eform.label_eform + ': ' + this.uitext.eform[WATERID] + '<br>';
      // txt_body = 'Template# ' + this.uitext.eform[WATERID] + '<br>';
      txt_body = 'Template# 1200 <br>';

      // water - ship
      // for ( let i = 0; i < this._data.water.ship.length; i ++ ) {
      //   const shipitem = this._data.water.ship[i];
      //   if ( shipitem.id === this._state.state.water.shipid ) {
      //     txt_subject = txt_subject + ' - ' + shipitem.value;
      //     // txt_body = txt_body + this.uitext.water.label_ship + ': ' + shipitem.value + '<br>';
      //     txt_body = txt_body + 'F1# ' + shipitem.id + '<br>';
      //     break;
      //   }
      // }
      txt_subject = txt_subject + ' - ' + this.selectedShip.name;
      txt_body = txt_body + 'F1#' + this.selectedShip.microtingUUID + '<br>';

      // water - quay
      // for ( let i = 0; i < this._data.water.quay.length; i ++ ) {
      //   const quayitem = this._data.water.quay[i];
      //   if ( quayitem.id === this._state.state.water.quayid ) {
      //     txt_subject = txt_subject + ' - ' + quayitem.value;
      //     // txt_body = txt_body + this.uitext.water.label_quay + ': ' + quayitem.value + '<br>';
      //     txt_body = txt_body + 'F2# ' + quayitem.id + '<br>';
      //     break;
      //   }
      // }

    txt_subject = txt_subject + ' - ' + this.selectedQuay.name;
    txt_body = txt_body + 'F2#' + this.selectedQuay.microtingUUID + '<br>';

      // water - waters
      const cworkerids = [];
      const cworkervalues = [];
      for ( let i = 0; i < this.selectedSites.length; i ++ ) {
        const site = this.selectedSites[i];
        // if ( this._state.state.water.workers[i] ) {
          cworkerids.push(site.siteUId);
          cworkervalues.push(site.siteName);
        // }
      }
      txt_subject = txt_subject + ' - ' + cworkervalues.join(', ');
      // // txt_body = txt_body + this.uitext.water.label_workers + ': ' + cworkers.join(', ') + '<br>';
      txt_body = txt_body + 'Sites# ' + cworkerids.join(', ') + '<br>';

      // txt_body = txt_body + 'Sites#' + '<br>';

      // water - message
      // let txtVal = this._state.state.water.message;
      // txtVal = txtVal.replace(/\r/g, '<br>');
      // txtVal = txtVal.replace(/\n/g, '<br>');
      // // txt_body = txt_body + this.uitext.water.label_message + ': ' + txtVal;
      // txt_body = txt_body + 'F3# ' + txtVal;

      txt_body = txt_body + 'F3#' + this.currentMessage;

    // }

    const item = Office.context.mailbox.item;

    if ( item.itemType === Office.MailboxEnums.ItemType.Appointment ) {
      item.subject.setAsync(txt_subject);
      item.body.setAsync(txt_body, {coercionType: Office.CoercionType.Html});
    }
  }
}
