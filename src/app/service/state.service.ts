import { Injectable, NgZone } from '@angular/core';
import { State, CraneState, WaterState } from './state';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Crane, Water } from './data';
import { i18n } from '../service/i18n';

declare const Office: any

@Injectable({
  providedIn: 'root'
})
export class StateService {

  state: State
  observableEForm: BehaviorSubject<string>
  observableCrane: BehaviorSubject<CraneState>
  observableWater: BehaviorSubject<WaterState>

  constructor(private ngZone: NgZone) {
    this.state = {
      eform: 'crane',
      locale: Office.context.displayLanguage,
      crane: undefined,
      water: undefined
    }
    this.observableEForm = new BehaviorSubject<string>(this.state.eform)
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

  getEState(): Observable<string> {
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
    this.ngZone.run(() => {
      if ( this.state.water == undefined ) {
        this.state.water = {
          shipid: w.ship[0].id,
          quayid: w.quay[0].id,
          workers: Array(w.workers.length).fill(false),
          message: w.message
        }
      } else {
        // regen water state -> check if current id is in new list ? preserve original id : [0].id
      }
    })
  }

  parseCraneBody(c: Crane): void {
    let uitext = i18n.getTexts(this.state.locale)
    console.log('start parsing crane')

    this.ngZone.run(() => {
      let item = Office.context.mailbox.item
      if ( item.itemType == Office.MailboxEnums.ItemType.Appointment ) {
        const __this = this
        item.body.getAsync(Office.CoercionType.Text, function(result) {
          if ( result.status == Office.AsyncResultStatus.Succeeded ) {
            let txtVal: string = result.value
            console.log(':: - value' + txtVal)
            let textLines = txtVal.split( '\n' )
            if ( textLines[0] == '' ) {
              textLines.shift()
            }
            if ( textLines[textLines.length-1] == '' ) {
              textLines.pop()
            }
            let stringText = ''
            for ( let i = 0; i < textLines.length; i ++ ) {
              const textLine = textLines[i]
              if ( textLine.startsWith( uitext.eform.label_eform ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                if ( optionValue == 'water' ) {
                  __this.state.eform = 'water'
                  console.log('parsing crane - state eform - water')
                  __this.onEFormChange()
                  break
                }
              } else if ( textLine.startsWith( uitext.crane.label_ship ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                console.log('parsing crane - state ship - ' + optionValue)
                for (let j = 0; j < c.ship.length; j ++) {
                  if ( c.ship[j].value == optionValue ) {
                    __this.state.crane.shipid = c.ship[j].id
                  }
                }
              } else if ( textLine.startsWith( uitext.crane.label_quay ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                console.log('parsing crane - state quay - ' + optionValue)
                for (let j = 0; j < c.quay.length; j ++) {
                  if ( c.quay[j].value == optionValue ) {
                    __this.state.crane.quayid = c.quay[j].id
                  }
                }
              } else if ( textLine.startsWith( uitext.crane.label_crane ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                console.log('parsing crane - state crane - ' + optionValue)
                for (let j = 0; j < c.crane.length; j ++) {
                  if ( c.crane[j].value == optionValue ) {
                    __this.state.crane.craneid = c.crane[j].id
                  }
                }
              } else if ( textLine.startsWith( uitext.crane.label_workers ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                console.log('parsing crane - state workers - ' + optionValue)
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
              } else {
                stringText = stringText + textLine + '\n'
              }
            }
            __this.state.crane.message = stringText
            __this.onCraneChange()
          }
        })
      }
    })
  }

  parseWaterBody(c: Water): void {
    let uitext = i18n.getTexts(this.state.locale)
    console.log('start parsing water')

    this.ngZone.run(() => {
      let item = Office.context.mailbox.item
      if ( item.itemType == Office.MailboxEnums.ItemType.Appointment ) {
        const __this = this
        item.body.getAsync(Office.CoercionType.Text, function(result) {
          if ( result.status == Office.AsyncResultStatus.Succeeded ) {
            let txtVal: string = result.value
            console.log(':: - value' + txtVal)
            let textLines = txtVal.split( '\n' )
            if ( textLines[0] == '' ) {
              textLines.shift()
            }
            if ( textLines[textLines.length-1] == '' ) {
              textLines.pop()
            }
            let stringText = ''
            for ( let i = 0; i < textLines.length; i ++ ) {
              const textLine = textLines[i]
              if ( textLine.startsWith( uitext.eform.label_eform ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                if ( optionValue == 'crane' ) {
                  __this.state.eform = 'crane'
                  console.log('parsing water - state eform - crane')
                  __this.onEFormChange()
                  break
                }
              } else if ( textLine.startsWith( uitext.water.label_ship ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                console.log('parsing water - state ship - ' + optionValue)
                for (let j = 0; j < c.ship.length; j ++) {
                  if ( c.ship[j].value == optionValue ) {
                    __this.state.water.shipid = c.ship[j].id
                  }
                }
              } else if ( textLine.startsWith( uitext.water.label_quay ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                console.log('parsing water - state quay - ' + optionValue)
                for (let j = 0; j < c.quay.length; j ++) {
                  if ( c.quay[j].value == optionValue ) {
                    __this.state.water.quayid = c.quay[j].id
                  }
                }
              } else if ( textLine.startsWith( uitext.water.label_workers ) ) {
                let optionValue = textLine.split( ':' )[1].trim()
                console.log('parsing water - state workers - ' + optionValue)
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
              } else {
                stringText = stringText + textLine + '\n'
              }
            }
            __this.state.water.message = stringText
            __this.onWaterChange()
          }
        })
      }
    })
  }

}
