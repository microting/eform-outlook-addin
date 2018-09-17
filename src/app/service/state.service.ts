import { Injectable, NgZone, Injector } from '@angular/core';
import { State, CraneState, WaterState, WATERID, CRANEID, CRANET, WATERT} from './state';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Crane, Water } from './data';
import { i18n } from '../service/i18n';
import { DataService } from './data.service';

declare const Office: any

@Injectable({
  providedIn: 'root'
})
export class StateService {

  state: State
  observableEForm: BehaviorSubject<CRANET | WATERT>
  observableCrane: BehaviorSubject<CraneState>
  observableWater: BehaviorSubject<WaterState>

  constructor(private zone: NgZone, private injector: Injector) {
    this.state = {
      eform: CRANEID,
      locale: Office.context.displayLanguage,
      crane: undefined,
      water: undefined
    }
    this.observableEForm = new BehaviorSubject<CRANET | WATERT>(this.state.eform)
    this.observableCrane = new BehaviorSubject<CraneState>(this.state.crane)
    this.observableWater = new BehaviorSubject<WaterState>(this.state.water)
  }

  onEFormChange(): void {
    this.observableEForm.next(this.state.eform)
  }

  onCraneChange(): void {
    this.observableCrane.next(this.state.crane)
  }

  onWaterChange(): void {
    this.observableWater.next(this.state.water)
  }

  getEState(): Observable<(CRANET | WATERT)> {
    return this.observableEForm
  }

  getCraneState(): Observable<CraneState> {
    return this.observableCrane
  }

  getWaterState(): Observable<WaterState> {
    return this.observableWater
  }

  initCraneState(c: Crane) {
    if ( this.state.crane == undefined ) {
      this.state.crane = {
        shipid: c.ship[0].id,
        quayid: c.quay[0].id,
        craneid: c.crane[0].id,
        workers: Array(c.workers.length).fill(false),
        message: c.message
      }
      this.parseCraneBody(c)
    } else {
      // regen water state -> check if current id is in new list ? preserve original id : [0].id
    }
  }

  initWaterState(w: Water) {
    this.zone.run(() => {
      if ( this.state.water == undefined ) {
        this.state.water = {
          shipid: w.ship[0].id,
          quayid: w.quay[0].id,
          workers: Array(w.workers.length).fill(false),
          message: w.message
        }
        this.parseWaterBody(w)
      } else {
        // regen water state -> check if current id is in new list ? preserve original id : [0].id
      }
    })
  }

  parseCraneBody(c: Crane): void {
    let uitext = i18n.getTexts(this.state.locale)

    this.zone.run(() => {
      let item = Office.context.mailbox.item
      if ( item.itemType == Office.MailboxEnums.ItemType.Appointment ) {
        const __this = this
        item.body.getAsync(Office.CoercionType.Text, function(result) {
          if ( result.status == Office.AsyncResultStatus.Succeeded ) {
            let txtVal: string = result.value
            let textLines = txtVal.split( '\n' )
            if ( textLines.length > 0 && textLines[0] == '' ) {
              textLines.shift()
            }
            if ( textLines.length > 0 && textLines[textLines.length-1] == '' ) {
              textLines.pop()
            }
            let stringText = ''
            let itemMode: boolean
            itemMode = false
            console.log('textLines')
            console.log(textLines)
            for ( let i = 0; i < textLines.length; i ++ ) {
              itemMode = false
              const textLine = textLines[i]
              if ( textLine.startsWith( uitext.eform.label_eform ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                let waterVal = uitext.eform[WATERID]
                if ( optionValue == waterVal ) {
                  __this.state.eform = WATERID
                  __this.onEFormChange()
                  itemMode = false
                  return
                } else {
                  itemMode = true
                }
              } else if ( textLine.startsWith( uitext.crane.label_ship ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                for (let j = 0; j < c.ship.length; j ++) {
                  if ( c.ship[j].value == optionValue ) {
                    __this.state.crane.shipid = c.ship[j].id
                    itemMode = true
                  }
                }
              } else if ( textLine.startsWith( uitext.crane.label_quay ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                for (let j = 0; j < c.quay.length; j ++) {
                  if ( c.quay[j].value == optionValue ) {
                    __this.state.crane.quayid = c.quay[j].id
                    itemMode = true
                  }
                }
              } else if ( textLine.startsWith( uitext.crane.label_crane ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                for (let j = 0; j < c.crane.length; j ++) {
                  if ( c.crane[j].value == optionValue ) {
                    __this.state.crane.craneid = c.crane[j].id
                    itemMode = true
                  }
                }
              } else if ( textLine.startsWith( uitext.crane.label_workers ) ) {
                itemMode = true
                let optionValue = textLine.split( ':' )[1].trim()
                let cworkers = optionValue.split(', ')
                if ( cworkers.length > 0 ) {
                  for (let j = 0; j < c.workers.length; j ++) {
                    for (let k = 0; k < cworkers.length; k ++) {
                      if ( c.workers[j].value == cworkers[k] ) {
                        __this.state.crane.workers[j] = true
                      }
                    }
                  }
                }
              } else if (textLine.startsWith( uitext.crane.label_message )) {
                stringText = textLine.replace(uitext.crane.label_message + ': ', '') + '\n'
                itemMode = true
              } else {
                stringText = stringText + textLine + '\n'
              }

              if ( itemMode == false ) break
            }

            __this.state.crane.message = stringText

            if ( itemMode == true ) {
              const data = __this.injector.get(DataService)
              data.removeEFormItem(WATERID)
            }

            console.log('crane itemMode = ' + itemMode)
            __this.onCraneChange()
          }
        })
      }
    })
  }

  parseWaterBody(c: Water): void {
    let uitext = i18n.getTexts(this.state.locale)

    this.zone.run(() => {
      let item = Office.context.mailbox.item
      if ( item.itemType == Office.MailboxEnums.ItemType.Appointment ) {
        const __this = this
        item.body.getAsync(Office.CoercionType.Text, function(result) {
          if ( result.status == Office.AsyncResultStatus.Succeeded ) {
            let txtVal: string = result.value
            let textLines = txtVal.split( '\n' )
            if ( textLines.length > 0 && textLines[0] == '' ) {
              textLines.shift()
            }
            if ( textLines.length > 0 && textLines[textLines.length-1] == '' ) {
              textLines.pop()
            }
            let stringText = ''
            let itemMode = false
            for ( let i = 0; i < textLines.length; i ++ ) {
              itemMode = false
              const textLine = textLines[i]
              if ( textLine.startsWith( uitext.eform.label_eform ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                let craneVal = uitext.eform[CRANEID]
                if ( optionValue == craneVal ) {
                  return
                } else {
                  itemMode = true
                }
              } else if ( textLine.startsWith( uitext.water.label_ship ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                for (let j = 0; j < c.ship.length; j ++) {
                  if ( c.ship[j].value == optionValue ) {
                    __this.state.water.shipid = c.ship[j].id
                    itemMode = true
                  }
                }
              } else if ( textLine.startsWith( uitext.water.label_quay ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                for (let j = 0; j < c.quay.length; j ++) {
                  if ( c.quay[j].value == optionValue ) {
                    __this.state.water.quayid = c.quay[j].id
                    itemMode = true
                  }
                }
              } else if ( textLine.startsWith( uitext.water.label_workers ) ) {
                itemMode = true
                let optionValue = textLine.split( ':' )[1].trim()
                let cworkers = optionValue.split(', ')
                for (let j = 0; j < c.workers.length; j ++) {
                  for (let k = 0; k < cworkers.length; k ++) {
                    if ( c.workers[j].value == cworkers[k] ) {
                      __this.state.water.workers[j] = true
                    }
                  }
                }
              } else if (textLine.startsWith( uitext.water.label_message )) {
                stringText = textLine.replace(uitext.water.label_message + ': ', '') + '\n'
                itemMode = true
              } else {
                stringText = stringText + textLine + '\n'
              }

              if ( itemMode == false ) break
            }

            __this.state.water.message = stringText

            if ( itemMode == true ) {
              const data = __this.injector.get(DataService)
              data.removeEFormItem(CRANEID)
            }

            console.log('water itemMode = ' + itemMode)
            __this.onWaterChange()
          }
        })
      }
    })
  }

}
