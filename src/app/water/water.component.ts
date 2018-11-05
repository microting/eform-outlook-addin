import {Component, OnInit, NgZone} from '@angular/core';
import {Water} from '../service/data';
import {DataService} from '../service/data.service';
import {i18n} from '../service/i18n';
import {StateService} from '../service/state.service';
import {WaterState} from '../service/state';
import {EntitySelectService} from '../common/services/advanced';
import {
  AdvEntitySelectableGroupListModel,
  AdvEntitySelectableGroupListRequestModel, AdvEntitySelectableGroupModel
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
  ships: AdvEntitySelectableGroupModel = new AdvEntitySelectableGroupModel();
  quays: AdvEntitySelectableGroupModel = new AdvEntitySelectableGroupModel();
  workers: AdvEntitySelectableGroupModel = new AdvEntitySelectableGroupModel();

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
    this.entitySelectService.getEntitySelectableGroupOutlook('5477', localStorage.getItem('userIdentityToken')).subscribe((data) => {
      if (data && data.success) {
        this.ships.entityGroupItemLst = data.model.entityGroupItemLst;
      }
    });
  }

  loadQuays() {
    this.entitySelectService.getEntitySelectableGroupOutlook('5482', localStorage.getItem('userIdentityToken')).subscribe((data) => {
      if (data && data.success) {
        this.quays.entityGroupItemLst = data.model.entityGroupItemLst;
      }
    });
  }

  loadWorkers() {
    this.entitySelectService.getEntitySelectableGroupOutlook('5457', localStorage.getItem('userIdentityToken')).subscribe((data) => {
      if (data && data.success) {
        this.workers.entityGroupItemLst = data.model.entityGroupItemLst;
      }
    });
  }
}
