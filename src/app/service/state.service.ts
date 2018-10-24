import { Injectable, NgZone, Injector } from '@angular/core';
import { State, CraneState, WaterState, WATERID, CRANEID, CRANET, WATERT} from './state';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Crane, Water } from './data';
import { i18n } from '../service/i18n';
import { DataService } from './data.service';

declare const Office: any;

@Injectable({
  providedIn: 'root'
})
export class StateService {

  state: State;
  observableEForm: BehaviorSubject<CRANET | WATERT>;
  observableCrane: BehaviorSubject<CraneState>;
  observableWater: BehaviorSubject<WaterState>;

  constructor(private zone: NgZone, private injector: Injector) {
    this.state = {
      eform: CRANEID,
      locale: Office.context.displayLanguage,
      crane: undefined,
      water: undefined
    };
    this.observableEForm = new BehaviorSubject<CRANET | WATERT>(this.state.eform);
    this.observableCrane = new BehaviorSubject<CraneState>(this.state.crane);
    this.observableWater = new BehaviorSubject<WaterState>(this.state.water);
  }

  onEFormChange(): void {
    this.observableEForm.next(this.state.eform);
  }

  onCraneChange(): void {
    this.observableCrane.next(this.state.crane);
  }

  onWaterChange(): void {
    this.observableWater.next(this.state.water);
  }

  getEState(): Observable<(CRANET | WATERT)> {
    return this.observableEForm;
  }

  getCraneState(): Observable<CraneState> {
    return this.observableCrane;
  }

  getWaterState(): Observable<WaterState> {
    return this.observableWater;
  }

  initCraneState(c: Crane) {
    if ( this.state.crane === undefined ) {
      this.state.crane = {
        shipid: c.ship[0].id,
        quayid: c.quay[0].id,
        craneid: c.crane[0].id,
        workers: Array(c.workers.length).fill(false),
        message: c.message
      };
      this.parseCraneBody(c);
    } else {
      // regen water state -> check if current id is in new list ? preserve original id : [0].id
    }
  }

  initWaterState(w: Water) {
    this.zone.run(() => {
      if ( this.state.water === undefined ) {
        this.state.water = {
          shipid: w.ship[0].id,
          quayid: w.quay[0].id,
          workers: Array(w.workers.length).fill(false),
          message: w.message
        };
        this.parseWaterBody(w);
      } else {
        // regen water state -> check if current id is in new list ? preserve original id : [0].id
      }
    });
  }

  parseCraneBody(c: Crane): void {
    const uitext = i18n.getTexts(this.state.locale);

    this.zone.run(() => {
      const item = Office.context.mailbox.item;
      if ( item.itemType === Office.MailboxEnums.ItemType.Appointment ) {
        const __this = this;
        item.body.getAsync(Office.CoercionType.Text, function(result) {
          if ( result.status === Office.AsyncResultStatus.Succeeded ) {
            const txtVal: string = result.value;
            const textLines = txtVal.split( '\n' );
            let stringText = '';
            let itemMode: boolean;
            itemMode = false;
            let newLine = false;
            for ( let i = 0; i < textLines.length; i ++ ) {
              const textLine = textLines[i];
              itemMode = false;
              if ( newLine === false && textLine.length === 0 ) {
                continue;
              } else {
                newLine = true;
              }
              // if ( textLine.startsWith( uitext.eform.label_eform ) ) {
              if ( textLine.startsWith( 'Template#' ) ) {
                const optionValue = textLine.split( ':' )[1].trim();
                const waterVal = uitext.eform[WATERID];
                if ( optionValue === waterVal ) {
                  __this.state.eform = WATERID;
                  __this.onEFormChange();
                  itemMode = false;
                  return
                } else {
                  itemMode = true;
                }
              // } else if ( textLine.startsWith( uitext.crane.label_ship ) ) {
              } else if ( textLine.startsWith( 'F1#' ) ) {
                const optionValue = textLine.split( ':' )[1].trim();
                for (let j = 0; j < c.ship.length; j ++) {
                  if ( c.ship[j].value === optionValue ) {
                    __this.state.crane.shipid = c.ship[j].id;
                    itemMode = true;
                  }
                }
              // } else if ( textLine.startsWith( uitext.crane.label_quay ) ) {
              } else if ( textLine.startsWith( 'F2#' ) ) {
                const optionValue = textLine.split( ':' )[1].trim();
                for (let j = 0; j < c.quay.length; j ++) {
                  if ( c.quay[j].value === optionValue ) {
                    __this.state.crane.quayid = c.quay[j].id;
                    itemMode = true;
                  }
                }
              // } else if ( textLine.startsWith( uitext.crane.label_crane ) ) {
              } else if ( textLine.startsWith( 'F3#' ) ) {
                const optionValue = textLine.split( ':' )[1].trim();
                for (let j = 0; j < c.crane.length; j ++) {
                  if ( c.crane[j].value === optionValue ) {
                    __this.state.crane.craneid = c.crane[j].id;
                    itemMode = true;
                  }
                }
              // } else if ( textLine.startsWith( uitext.crane.label_workers ) ) {
              } else if ( textLine.startsWith( 'Sites#' ) ) {
                itemMode = true;
                const optionValue = textLine.split( ':' )[1].trim();
                const cworkers = optionValue.split(', ');
                if ( cworkers.length > 0 ) {
                  for (let j = 0; j < c.workers.length; j ++) {
                    for (let k = 0; k < cworkers.length; k ++) {
                      if ( c.workers[j].value === cworkers[k] ) {
                        __this.state.crane.workers[j] = true;
                      }
                    }
                  }
                }
              // } else if (textLine.startsWith( uitext.crane.label_message )) {
              } else if (textLine.startsWith( 'F4#' )) {
                stringText = textLine.replace(uitext.crane.label_message + ': ', '') + '\n';
                itemMode = true;
              } else {
                if ( stringText.length > 0 ) {
                  itemMode = true;
                }
                stringText = stringText + textLine + '\n';
              }

              if ( itemMode === false ) {
                break;
              }
            }

            __this.state.crane.message = stringText;

            if ( itemMode === true ) {
              const data = __this.injector.get(DataService);
              data.removeEFormItem(WATERID);
            }

            __this.onCraneChange();
          }
        });
      }
    });
  }

  parseWaterBody(c: Water): void {
    const uitext = i18n.getTexts(this.state.locale);

    this.zone.run(() => {
      const item = Office.context.mailbox.item;
      if ( item.itemType === Office.MailboxEnums.ItemType.Appointment ) {
        const __this = this;
        item.body.getAsync(Office.CoercionType.Text, function(result) {
          if ( result.status === Office.AsyncResultStatus.Succeeded ) {
            const txtVal: string = result.value;
            const textLines = txtVal.split( '\n' );
            let stringText = '';
            let itemMode = false;
            let newLine = false;
            for ( let i = 0; i < textLines.length; i ++ ) {
              const textLine = textLines[i];
              itemMode = false;
              if ( newLine === false && textLine.length === 0 ) {
                continue;
              } else {
                newLine = true;
              }
              // if ( textLine.startsWith( uitext.eform.label_eform ) ) {
              if ( textLine.startsWith( 'Template#' ) ) {
                const optionValue = textLine.split( ':' )[1].trim();
                const craneVal = uitext.eform[CRANEID];
                if ( optionValue === craneVal ) {
                  return;
                } else {
                  itemMode = true;
                }
              // } else if ( textLine.startsWith( uitext.water.label_ship ) ) {
              } else if ( textLine.startsWith( 'F1#' ) ) {
                const optionValue = textLine.split( ':' )[1].trim();
                for (let j = 0; j < c.ship.length; j ++) {
                  if ( c.ship[j].value === optionValue ) {
                    __this.state.water.shipid = c.ship[j].id;
                    itemMode = true;
                  }
                }
              // } else if ( textLine.startsWith( uitext.water.label_quay ) ) {
              } else if ( textLine.startsWith( 'F2#' ) ) {
                const optionValue = textLine.split( ':' )[1].trim();
                for (let j = 0; j < c.quay.length; j ++) {
                  if ( c.quay[j].value === optionValue ) {
                    __this.state.water.quayid = c.quay[j].id;
                    itemMode = true;
                  }
                }
              // } else if ( textLine.startsWith( uitext.water.label_workers ) ) {
              } else if ( textLine.startsWith( 'Sites#' ) ) {
                itemMode = true;
                const optionValue = textLine.split( ':' )[1].trim();
                const cworkers = optionValue.split(', ');
                for (let j = 0; j < c.workers.length; j ++) {
                  for (let k = 0; k < cworkers.length; k ++) {
                    if ( c.workers[j].value === cworkers[k] ) {
                      __this.state.water.workers[j] = true;
                    }
                  }
                }
              // } else if (textLine.startsWith( uitext.water.label_message )) {
              } else if (textLine.startsWith( 'F4#' )) {
                stringText = textLine.replace(uitext.water.label_message + ': ', '') + '\n';
                itemMode = true;
              } else {
                if ( stringText.length > 0 ) {
                  itemMode = true;
                }
                stringText = stringText + textLine + '\n';
              }

              if ( itemMode === false ) {
                break;
              }
            }

            __this.state.water.message = stringText;

            if ( itemMode === true ) {
              const data = __this.injector.get(DataService);
              data.removeEFormItem(CRANEID);
            }

            __this.onWaterChange();
          }
        });
      }
    });
  }

}
