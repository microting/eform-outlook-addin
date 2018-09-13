import { Injectable } from '@angular/core';
import { State, CraneState, WaterState } from './state';
import { Observable, of } from 'rxjs';
import { Crane, Water } from './data';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  state: State

  constructor() {
    this.state = {
      eform: 'crane',
      crane: undefined,
      water: undefined
    }
  }

  getEState(): Observable<string> {
    return of(this.state.eform)
  }

  getCraneState(): Observable<CraneState> {
    return of(this.state.crane)
  }

  getWaterState(): Observable<WaterState> {
    return of(this.state.water)
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
    } else {
      // regen water state -> check if current id is in new list ? preserve original id : [0].id
    }
  }

  initWaterState(c: Water) {
    if ( this.state.water == undefined ) {
      this.state.water = {
        shipid: c.ship[0].id,
        quayid: c.quay[0].id,
        workers: Array(c.workers.length).fill(false),
        message: c.message
      }
    } else {
      // regen water state -> check if current id is in new list ? preserve original id : [0].id
    }
  }

}
