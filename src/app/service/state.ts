export type CRANET = 'crane';
export type WATERT = 'water';

export const CRANEID = 'crane';
export const WATERID = 'water';

export class State {
  eform: CRANET | WATERT;
  locale: string;
  crane: CraneState;
  water: WaterState;
}

export class CraneState {
  shipid: string;
  quayid: string;
  craneid: string;
  workers: boolean[];
  message: string;
}

export class WaterState {
  shipid: string;
  quayid: string;
  workers: boolean[];
  message: string;
}
