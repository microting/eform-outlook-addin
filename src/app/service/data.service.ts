import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of, BehaviorSubject } from 'rxjs'
import { tap } from 'rxjs/operators'

import { Crane, Water, MockEForm } from './data'

// Test purpose
import { MockCrane, MockWater } from './mock-data'
import { StateService } from './state.service';
import { CRANET, WATERT } from './state';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private apiGetCrane = 'https://temp/crane/get'
  // private apiModifyCrane = 'https://temp/crane/modify'
  // private apiGetWater = 'https://temp/water/get'
  // private apiModifyWater = 'https://temp/water/modify'

  crane: Crane
  water: Water
  eform: (CRANET | WATERT)[]

  observableEForm: BehaviorSubject<(CRANET | WATERT)[]>
  observableCrane: BehaviorSubject<Crane>
  observableWater: BehaviorSubject<Water>

  constructor( private http: HttpClient, private injector: Injector ) {
    this.crane = undefined
    this.water = undefined
    this.eform = MockEForm
    this.observableEForm = new BehaviorSubject<(CRANET | WATERT)[]>(this.eform)
    this.observableCrane = new BehaviorSubject<Crane>(this.crane)
    this.observableWater = new BehaviorSubject<Water>(this.water)
  }

  onEFormChange(): void {
    this.observableEForm.next(this.eform)
  }

  onCraneChange(): void {
    this.observableCrane.next(this.crane)
  }

  onWaterChange(): void {
    this.observableWater.next(this.water)
  }

  getCrane(): Observable<Crane> {
    if ( this.crane == undefined ) {
      this.fetchCrane()
    }
    return of(this.crane) // Test purpose
  }

  getWater(): Observable<Water> {
    if ( this.water == undefined ) {
      this.fetchWater()
    }
    return of(this.water) // Test purpose
  }

  getEform(): Observable<(CRANET | WATERT)[]> {
    return of(this.eform)
  }

  fetchCrane() {
    this.crane = MockCrane // Test purpose
    const stateService = this.injector.get(StateService)
    console.log('Crane - StateService fetch')
    console.log(stateService)
    stateService.initCraneState(this.crane)
    this.onCraneChange()
    // return this.http.get<Crane>(this.apiGetCrane).pipe(
    //   tap(c => this.crane = c)
    // )
  }

  fetchWater() {
    this.water = MockWater // Test purpose
    const stateService = this.injector.get(StateService)
    console.log('Water - StateService fetch')
    console.log(stateService)
    stateService.initWaterState(this.water)
    this.onWaterChange()
    // return this.http.get<Water>(this.apiGetWater).pipe(
    //   tap(w => this.water = w)
    // )
  }

  removeEFormItem(item: CRANET | WATERT) {
    let index = this.eform.indexOf(item);
    if (index > -1) {
      this.eform.splice(index, 1);
    }
    this.onEFormChange()
  }
}
