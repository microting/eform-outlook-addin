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
    this.loadShips();
    this.loadQuays();
    this.loadSites();
  }

  onSites(site: SiteNameDto) {
    if (!this.selectedSites.includes(site)) {
      this.selectedSites.push(site);
    } else {
      this.selectedSites.splice(this.selectedSites.indexOf(site), 1);
    }
    console.log('selectedSites now contains ' + JSON.stringify(this.selectedSites));
  }

  loadShips() {
    // console.log('loadShips called');
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
    // console.log('loadQuays called');
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
    // console.log('loadSites called');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    const callerUrl = localStorage.getItem('callerUrl');
    // console.log('userIdentityToken is ' + userIdentityToken);
    this.sitesService.getAllSites(userIdentityToken, callerUrl).subscribe((data) => {
      if (data && data.success) {
        this.sitesDto = data.model;
      }
    });
  }

  onInsert(): void {

    let txt_subject;
    let txt_body;
    txt_subject = 'Vand';
    txt_body = 'Template# 1200 <br>';

    // water - ship
    txt_subject = txt_subject + ' - ' + this.selectedShip.name;
    txt_body = txt_body + 'F1#' + this.selectedShip.microtingUUID + '<br>';

    // water - quay
    txt_subject = txt_subject + ' - ' + this.selectedQuay.name;
    txt_body = txt_body + 'F2#' + this.selectedQuay.microtingUUID + '<br>';

    // water - waters
    const cworkerids = [];
    const cworkervalues = [];
    for (let site of this.selectedSites) {
      cworkerids.push(site.siteUId);
      cworkervalues.push(site.siteName);
    }
    txt_subject = txt_subject + ' - ' + cworkervalues.join(', ');
    txt_body = txt_body + 'Sites# ' + cworkerids.join(', ') + '<br>';


    // water - message
    let txtVal = this.currentMessage;
    txtVal = txtVal.replace(/\r/g, '<br>');
    txtVal = txtVal.replace(/\n/g, '<br>');
    txt_body = txt_body + 'F3# ' + txtVal;


    // }

    const item = Office.context.mailbox.item;

    if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
      item.subject.setAsync(txt_subject);
      item.body.setAsync(txt_body, {coercionType: Office.CoercionType.Html});
    }
  }
}
