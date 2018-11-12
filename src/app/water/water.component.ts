import {Component, OnInit, NgZone} from '@angular/core';
import {Water} from '../service/data';
import {DataService} from '../service/data.service';
import {i18n} from '../service/i18n';
import {StateService} from '../service/state.service';
import {WaterState} from '../service/state';
import {EntitySelectService} from '../common/services/advanced';
import {
  AdvEntitySelectableGroupEditModel,
  AdvEntitySelectableItemModel
} from '../common/models/advanced';
import {SitesService} from '../common/services/advanced/sites.service';
import {SiteNameDto} from '../common/models/dto';


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
  selectedSites: Array<SiteNameDto>;
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
}
