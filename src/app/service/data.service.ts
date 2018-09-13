import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable, of } from 'rxjs'
import { tap } from 'rxjs/operators'

import { Crane, Water } from './data'

// Test purpose
import { MockCrane, MockWater } from './mock-data'
import { StateService } from './state.service';

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

  constructor( private http: HttpClient, private state: StateService ) {
    this.crane = undefined
    this.water = undefined
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

  fetchCrane() {
    this.crane = MockCrane // Test purpose
    this.state.initCraneState(this.crane)
    // return this.http.get<Crane>(this.apiGetCrane).pipe(
    //   tap(c => this.crane = c)
    // )
  }

  fetchWater() {
    this.water = MockWater // Test purpose
    this.state.initWaterState(this.water)
    // return this.http.get<Water>(this.apiGetWater).pipe(
    //   tap(w => this.water = w)
    // )
  }
}
