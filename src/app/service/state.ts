export type CRANET = '1734';
export type WATERT = '1200';

export const CRANEID = '1734';
export const WATERID = '1200';

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
