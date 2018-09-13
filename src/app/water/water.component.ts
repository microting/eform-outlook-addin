import { Component, OnInit, NgZone } from '@angular/core';
import { Water } from '../service/data';
import { DataService } from '../service/data.service';
import { i18n } from '../service/i18n';
import { StateService } from '../service/state.service';
import { WaterState } from '../service/state';

@Component({
  selector: 'app-water',
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.css']
})
export class WaterComponent implements OnInit {

  content
  uitext
  state: WaterState

  constructor(private zone: NgZone, public data: DataService, public _state: StateService) { }

  ngOnInit() {
    // let lang = Office.context.displayLanguage
    let lang = 'en'
    this.uitext = i18n.getTexts(lang)
    this.getWater()
    this.getState()
  }

  getState(): void {
    this._state.getWaterState().subscribe(ws => this.state = ws)
  }

  getWater(): void {
    this.data.getWater().subscribe(c => {
      this.content = {
        ship: {
          label: this.uitext.water.label_ship,
          value: c.ship
        },
        quay: {
          label: this.uitext.water.label_quay,
          value: c.quay
        },
        workers: {
          label: this.uitext.water.label_workers,
          value: c.workers
        },
        message: {
          label: this.uitext.water.label_message,
          value: c.message
        }
      }
    })
  }

  onWorkers(workerIndex: number) {
    this.state.workers[workerIndex] = !this.state.workers[workerIndex]
  }
}
