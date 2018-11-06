import {Component, OnInit, NgZone} from '@angular/core';
import {Water} from '../service/data';
import {DataService} from '../service/data.service';
import {i18n} from '../service/i18n';
import {StateService} from '../service/state.service';
import {WaterState} from '../service/state';
import {EntitySelectService} from '../common/services/advanced';
import {
  AdvEntitySelectableGroupEditModel
} from '../common/models/advanced';


@Component({
  selector: 'app-water',
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.css']
})

export class WaterComponent implements OnInit {

  content;
  uitext;
  state: WaterState;
  ships: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  quays: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  workers: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();

  constructor(private zone: NgZone,
              public data: DataService,
              public _state: StateService,
              private entitySelectService: EntitySelectService) {
  }

  ngOnInit() {
    this.uitext = i18n.getTexts(this._state.state.locale);
    this.loadShips();
    this.loadQuays();
    this.loadWorkers();
    this.getWater();
    this.getState();
  }

  getState(): void {
    this._state.getWaterState().subscribe(ws => {
      this.zone.run(() => {
        this.state = ws;
      });
    });
  }

  getWater(): void {
    this.data.getWater().subscribe(c => {
      this.zone.run(() => {
        this.content = {
          ship: {
            label: this.uitext.water.label_ship,
            label_edit: this.uitext.water.label_edit,
            label_refresh: this.uitext.water.label_refresh,
            value: c.ship
          },
          quay: {
            label: this.uitext.water.label_quay,
            label_edit: this.uitext.water.label_edit,
            label_refresh: this.uitext.water.label_refresh,
            value: c.quay
          },
          workers: {
            label: this.uitext.water.label_workers,
            label_edit: this.uitext.water.label_edit,
            label_refresh: this.uitext.water.label_refresh,
            value: c.workers
          },
          message: {
            label: this.uitext.water.label_message,
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
    console.log('userIdentityToken is ' + userIdentityToken);
    this.entitySelectService.getEntitySelectableGroupOutlook('5477', userIdentityToken).subscribe((data) => {
      if (data && data.success) {
        this.ships.advEntitySelectableItemModels = data.model.entityGroupItemLst;
      }
    });
  }

  loadQuays() {
    console.log('loadQuays called');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    console.log('userIdentityToken is ' + userIdentityToken);
    this.entitySelectService.getEntitySelectableGroupOutlook('5482', userIdentityToken).subscribe((data) => {
      if (data && data.success) {
        this.quays.advEntitySelectableItemModels = data.model.entityGroupItemLst;
      }
    });
  }

  loadWorkers() {
    console.log('loadWorkers called');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    console.log('userIdentityToken is ' + userIdentityToken);
    this.entitySelectService.getEntitySelectableGroupOutlook('5457', userIdentityToken).subscribe((data) => {
      if (data && data.success) {
        this.workers.advEntitySelectableItemModels = data.model.entityGroupItemLst;
      }
    });
  }
}
