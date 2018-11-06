import { Component, OnInit, NgZone } from '@angular/core';
import { DataService } from '../service/data.service';
import { i18n } from '../service/i18n';
import { StateService } from '../service/state.service';
import { CraneState } from '../service/state';
import {
  AdvEntitySelectableGroupEditModel,
  AdvEntitySelectableGroupListModel,
  AdvEntitySelectableGroupListRequestModel, AdvEntitySelectableGroupModel
} from '../common/models/advanced';
import {EntitySelectService} from '../common/services/advanced';

@Component({
  selector: 'app-crane',
  templateUrl: './crane.component.html',
  styleUrls: ['./crane.component.css']
})
export class CraneComponent implements OnInit {

  content;
  uitext;
  state: CraneState;

  ships: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  quays: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  cranes: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  workers: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();

  constructor(private _zone: NgZone,
              public _data: DataService,
              public _state: StateService,
              private entitySelectService: EntitySelectService) { }

  ngOnInit() {
    this.uitext = i18n.getTexts(this._state.state.locale);
    this.loadShips();
    this.loadQuays();
    this.loadWorkers();
    this.loadCranes();
    this.getCrane();
    this.getState();
  }

  getState(): void {
    this._state.getCraneState().subscribe(cs => {this._zone.run(() => { this.state = cs; }); });
  }

  getCrane(): void {
    this._data.getCrane().subscribe(c => {
      this._zone.run(() => {
        this.content = {
          ship: {
            label: this.uitext.crane.label_ship,
            label_edit: this.uitext.crane.label_edit,
            label_refresh: this.uitext.crane.label_refresh,
            value: c.ship
          },
          quay: {
            label: this.uitext.crane.label_quay,
            label_edit: this.uitext.crane.label_edit,
            label_refresh: this.uitext.crane.label_refresh,
            value: c.quay
          },
          crane: {
            label: this.uitext.crane.label_crane,
            label_edit: this.uitext.crane.label_edit,
            label_refresh: this.uitext.crane.label_refresh,
            value: c.crane
          },
          workers: {
            label: this.uitext.crane.label_workers,
            label_edit: this.uitext.crane.label_edit,
            label_refresh: this.uitext.crane.label_refresh,
            value: c.workers
          },
          message: {
            label: this.uitext.crane.label_message,
            value: c.message
          }
        };
      });
    });
  }

  onWorkers(workerIndex: number) {
    this.state.workers[workerIndex] = !this.state.workers[workerIndex];
  }


  loadShips() {
    console.log('loadShips called');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    const callerUrl = localStorage.getItem('callerUrl');
    console.log('userIdentityToken is ' + userIdentityToken);
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
    console.log('userIdentityToken is ' + userIdentityToken);
    this.entitySelectService.getEntitySelectableGroupOutlook('5482', userIdentityToken, callerUrl).subscribe((data) => {
      if (data && data.success) {
        this.quays.advEntitySelectableItemModels = data.model.entityGroupItemLst;
      }
    });
  }

  loadCranes() {
    console.log('loadWorkers called');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    const callerUrl = localStorage.getItem('callerUrl');
    console.log('userIdentityToken is ' + userIdentityToken);
    this.entitySelectService.getEntitySelectableGroupOutlook('5487', userIdentityToken, callerUrl).subscribe((data) => {
      if (data && data.success) {
        this.cranes.advEntitySelectableItemModels = data.model.entityGroupItemLst;
      }
    });
  }

  loadWorkers() {
    console.log('loadWorkers called');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    const callerUrl = localStorage.getItem('callerUrl');
    console.log('userIdentityToken is ' + userIdentityToken);
    this.entitySelectService.getEntitySelectableGroupOutlook('5457', userIdentityToken, callerUrl).subscribe((data) => {
      if (data && data.success) {
        this.workers.advEntitySelectableItemModels = data.model.entityGroupItemLst;
      }
    });
  }
}
