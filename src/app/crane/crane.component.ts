import { Component, OnInit, NgZone } from '@angular/core';
import { DataService } from '../service/data.service';
import { i18n } from '../service/i18n';
import { StateService } from '../service/state.service';
import { CraneState } from '../service/state';

@Component({
  selector: 'app-crane',
  templateUrl: './crane.component.html',
  styleUrls: ['./crane.component.css']
})
export class CraneComponent implements OnInit {

  content
  uitext
  state: CraneState

  constructor(private _zone: NgZone, public _data: DataService, public _state: StateService) { }

  ngOnInit() {
    this.uitext = i18n.getTexts(this._state.state.locale)
    this.getCrane()
    this.getState()
  }

  getState(): void {
    this._state.getCraneState().subscribe(cs => {this._zone.run(() => { this.state = cs }) })
  }

  getCrane(): void {
    this._data.getCrane().subscribe(c => {
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
      }
    })
  }

  onWorkers(workerIndex: number) {
    this.state.workers[workerIndex] = !this.state.workers[workerIndex]
  }
}
