import { Component, OnInit, NgZone } from '@angular/core';
import { DataService } from '../service/data.service';
import { i18n } from '../service/i18n';
import { StateService } from '../service/state.service';
import { CRANET, WATERT, CRANEID, WATERID } from '../service/state';

declare const Office: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  eform: {
    label: string
    value: {label: string, value: (CRANET | WATERT)}[]
  };
  uitext;
  state: string;
  // userIdentityToken: string;

  constructor(private zone: NgZone, public _data: DataService, public _state: StateService) { }

  ngOnInit() {
    this.uitext = i18n.getTexts(this._state.state.locale);
    this.getEForm();
    this.getState();
    this.zone.run(() => {
      this.getAuthToken();
      // Office.context.mailbox.getUserIdentityTokenAsync(function(result) {
      //   console.log('this.window.location.hostname is : ' + window.location.hostname);
      //   localStorage.setItem('callerUrl', window.location.hostname);
      //   if (result.status === Office.AsyncResultStatus.Succeeded) {
      //     // console.log(result.value);
      //     localStorage.setItem('userIdentityToken', result.value);
      //     // this.userIdentityToken = result.value;
      //   } else {
      //     // console.log(result.error.message);
      //   }
      // });
    });
  }

  getAuthToken() {
    console.log('getAuthToken called');
    Office.context.mailbox.getUserIdentityTokenAsync(function(result) {
      console.log('this.window.location.hostname is : ' + window.location.hostname);
      localStorage.setItem('callerUrl', 'https://' + window.location.hostname + '/');
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        console.log('success result for getting new token : ' + result.value);
        localStorage.setItem('userIdentityToken', result.value);
        // this.userIdentityToken = result.value;
      } else {
        console.log('Error on trying to get new token, error was : ' + result.error.message);
      }
    });
  }

  getEForm(): void {
    this._data.getEform().subscribe(e => {
      this.zone.run(() => {
        this.eform = {
          label: this.uitext.eform.label_eform,
          value: []
        };
        for ( let i = 0; i < e.length; i ++ ) {
          const item = e[i];
          this.eform.value.push({label: this.uitext.eform[item], value: item});
        }
      });
    });
  }

  getState(): void {
    this._state.getEState().subscribe(es => {
      this.zone.run(() => {
        this.state = es;
      });
    });
  }

  onInsert(): void {
    const lang = this._state.state.locale;
    this.uitext = i18n.getTexts(lang);

    let txt_subject = '';
    let txt_body = '';
    if ( this.state === CRANEID ) {
      // txt_subject = CRANEID;
      txt_subject = this.uitext.eform[CRANEID];
      // txt_body = this.uitext.eform.label_eform + ': ' + this.uitext.eform[CRANEID] + '<br>';
      // txt_body = 'Template# ' + this.uitext.eform[CRANEID] + '<br>';
      txt_body = 'Template# ' + CRANEID + '<br>';

      // crane - ship
      for ( let i = 0; i < this._data.crane.ship.length; i ++ ) {
        const shipitem = this._data.crane.ship[i];
        if ( shipitem.id === this._state.state.crane.shipid ) {
          txt_subject = txt_subject + ' - ' + shipitem.value;
          // txt_body = txt_body + this.uitext.crane.label_ship + ': ' + shipitem.value + '<br>';
          txt_body = txt_body + 'F1# ' + shipitem.id + '<br>';
          break;
        }
      }

      // crane - quay
      for ( let i = 0; i < this._data.crane.quay.length; i ++ ) {
        const quayitem = this._data.crane.quay[i];
        if ( quayitem.id === this._state.state.crane.quayid ) {
          txt_subject = txt_subject + ' - ' + quayitem.value;
          // txt_body = txt_body + this.uitext.crane.label_quay + ': ' + quayitem.value + '<br>';
          txt_body = txt_body + 'F2# ' + quayitem.id + '<br>';
          break;
        }
      }

      // crane - crane
      for ( let i = 0; i < this._data.crane.crane.length; i ++ ) {
        const craneitem = this._data.crane.crane[i];
        if ( craneitem.id === this._state.state.crane.craneid ) {
          txt_subject = txt_subject + ' - ' + craneitem.value;
          // txt_body = txt_body + this.uitext.crane.label_crane + ': ' + craneitem.value + '<br>';
          txt_body = txt_body + 'F3# ' + craneitem.id + '<br>';
          break;
        }
      }

      // crane - workers
      const cworkerids = [];
      const cworkervalues = [];
      for ( let i = 0; i < this._data.crane.workers.length; i ++ ) {
        const worker = this._data.crane.workers[i];
        if ( this._state.state.crane.workers[i] ) {
          cworkerids.push(worker.id);
          cworkervalues.push(worker.value);
        }
      }
      txt_subject = txt_subject + ' - ' + cworkervalues.join(', ');
      // txt_body = txt_body + this.uitext.crane.label_workers + ': ' + cworkers.join(', ') + '<br>';
      txt_body = txt_body + 'Sites# ' + cworkerids.join(', ') + '<br>';

      // crane - message
      let txtVal = this._state.state.crane.message;
      txtVal = txtVal.replace(/\r/g, '<br>');
      txtVal = txtVal.replace(/\n/g, '<br>');
      // txt_body = txt_body + this.uitext.crane.label_message + ': ' + txtVal
      txt_body = txt_body + 'F4# ' + txtVal;

    } else if ( this.state === WATERID ) {
      // txt_subject = WATERID;
      txt_subject = this.uitext.eform[WATERID];
      // txt_body = this.uitext.eform.label_eform + ': ' + this.uitext.eform[WATERID] + '<br>';
      // txt_body = 'Template# ' + this.uitext.eform[WATERID] + '<br>';
      txt_body = 'Template# ' + WATERID + '<br>';

      // water - ship
      for ( let i = 0; i < this._data.water.ship.length; i ++ ) {
        const shipitem = this._data.water.ship[i];
        if ( shipitem.id === this._state.state.water.shipid ) {
          txt_subject = txt_subject + ' - ' + shipitem.value;
          // txt_body = txt_body + this.uitext.water.label_ship + ': ' + shipitem.value + '<br>';
          txt_body = txt_body + 'F1# ' + shipitem.id + '<br>';
          break;
        }
      }

      // water - quay
      for ( let i = 0; i < this._data.water.quay.length; i ++ ) {
        const quayitem = this._data.water.quay[i];
        if ( quayitem.id === this._state.state.water.quayid ) {
          txt_subject = txt_subject + ' - ' + quayitem.value;
          // txt_body = txt_body + this.uitext.water.label_quay + ': ' + quayitem.value + '<br>';
          txt_body = txt_body + 'F2# ' + quayitem.id + '<br>';
          break;
        }
      }

      // water - waters
      const cworkerids = [];
      const cworkervalues = [];
      for ( let i = 0; i < this._data.water.workers.length; i ++ ) {
        const worker = this._data.water.workers[i];
        if ( this._state.state.water.workers[i] ) {
          cworkerids.push(worker.id);
          cworkervalues.push(worker.value);
        }
      }
      txt_subject = txt_subject + ' - ' + cworkervalues.join(', ');
      // txt_body = txt_body + this.uitext.water.label_workers + ': ' + cworkers.join(', ') + '<br>';
      txt_body = txt_body + 'Sites# ' + cworkerids.join(', ') + '<br>';

      // water - message
      let txtVal = this._state.state.water.message;
      txtVal = txtVal.replace(/\r/g, '<br>');
      txtVal = txtVal.replace(/\n/g, '<br>');
      // txt_body = txt_body + this.uitext.water.label_message + ': ' + txtVal;
      txt_body = txt_body + 'F3# ' + txtVal;

    }

    const item = Office.context.mailbox.item;

    if ( item.itemType === Office.MailboxEnums.ItemType.Appointment ) {
      item.subject.setAsync(txt_subject);
      item.body.setAsync(txt_body, {coercionType: Office.CoercionType.Html});
    }
  }
}
