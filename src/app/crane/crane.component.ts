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

  constructor(private zone: NgZone, public _data: DataService, public _state: StateService) { }

  ngOnInit() {
    // let lang = Office.context.displayLanguage
    let lang = 'en'
    this.uitext = i18n.getTexts(lang)
    this.getCrane()
    this.getState()
  }

  getState(): void {
    this._state.getCraneState().subscribe(cs => this.state = cs)
  }

  getCrane(): void {
    this._data.getCrane().subscribe(c => {
      this.content = {
        ship: {
          label: this.uitext.crane.label_ship,
          value: c.ship
        },
        quay: {
          label: this.uitext.crane.label_quay,
          value: c.quay
        },
        crane: {
          label: this.uitext.crane.label_crane,
          value: c.crane
        },
        workers: {
          label: this.uitext.crane.label_workers,
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
