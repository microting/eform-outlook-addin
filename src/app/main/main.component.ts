import { Component, OnInit, NgZone } from '@angular/core';
import { DataService } from '../service/data.service';
import { i18n } from '../service/i18n';
import { StateService } from '../service/state.service';

declare const Office: any

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  eform
  uitext
  state: string

  constructor(private zone: NgZone, public _data: DataService, public _state: StateService) { }

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

  onInsert(): void {
    this.zone.run(() => {
      console.log('insert action')
      let txt_subject = ''
      if ( this._state.state.eform == 'crane' ) {
        txt_subject = 'crane'
        for ( let i = 0; i < this._data.crane.ship.length; i ++ ) {
          let shipitem = this._data.crane.ship[i]
          if ( shipitem.id == this._state.state.crane.shipid ) {
            txt_subject = txt_subject + ' - ' + shipitem.value
            break
          }
        }
        for ( let i = 0; i < this._data.crane.quay.length; i ++ ) {
          let quayitem = this._data.crane.quay[i]
          if ( quayitem.id == this._state.state.crane.quayid ) {
            txt_subject = txt_subject + ' - ' + quayitem.value
            break
          }
        }
        for ( let i = 0; i < this._data.crane.crane.length; i ++ ) {
          let craneitem = this._data.crane.quay[i]
          if ( craneitem.id == this._state.state.crane.craneid ) {
            txt_subject = txt_subject + ' - ' + craneitem.value
            break
          }
        }
        let cworkers = []
        for ( let i = 0; i < this._data.crane.workers.length; i ++ ) {
          let worker = this._data.crane.quay[i]
          if ( this._state.state.crane.workers[i] ) {
            cworkers.push(worker.value)
          }
        }
        txt_subject = txt_subject + ' - ' + cworkers.join(', ')
      } else if ( this._state.state.eform == 'water' ) {
        txt_subject = 'water'
        for ( let i = 0; i < this._data.water.ship.length; i ++ ) {
          let shipitem = this._data.water.ship[i]
          if ( shipitem.id == this._state.state.water.shipid ) {
            txt_subject = txt_subject + ' - ' + shipitem.value
            break
          }
        }
        for ( let i = 0; i < this._data.water.quay.length; i ++ ) {
          let quayitem = this._data.water.quay[i]
          if ( quayitem.id == this._state.state.water.quayid ) {
            txt_subject = txt_subject + ' - ' + quayitem.value
            break
          }
        }
        let cworkers = []
        for ( let i = 0; i < this._data.water.workers.length; i ++ ) {
          let worker = this._data.water.quay[i]
          if ( this._state.state.water.workers[i] ) {
            cworkers.push(worker.value)
          }
        }
        txt_subject = txt_subject + ' - ' + cworkers.join(', ')
      }

      let item = Office.context.mailbox.item

      if ( item.itemType == Office.MailboxEnums.ItemType.Appointment ) {
        item.subject.setAsync(txt_subject)
      }
    })
  }
}
