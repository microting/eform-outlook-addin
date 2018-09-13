import { Component, OnInit, NgZone } from '@angular/core';
import { DataService } from '../service/data.service';
import { i18n } from '../service/i18n';
import { StateService } from '../service/state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  eform
  uitext
  state: string

  constructor(private zone: NgZone, public data: DataService, public _state: StateService) { }

  ngOnInit() {
    // let lang = Office.context.displayLanguage
    let lang = 'en'
    this.uitext = i18n.getTexts(lang)
    this.eform = {
      label: this.uitext.eform.label_eform,
      value: [{
        label: this.uitext.eform.label_select_crane,
        value: 'crane'
      }, {
        label: this.uitext.eform.label_select_water,
        value: 'water'
      }]
    }
    this.getState()
  }

  getState(): void {
    this._state.getEState().subscribe(es => this.state = es)
  }
}
