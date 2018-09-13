export class State {
    eform: 'crane' | 'water'
    locale: string
    crane: CraneState
    water: WaterState
}

export class CraneState {
    shipid: string
    quayid: string
    craneid: string
    workers: boolean[]
    message: string
}

export class WaterState {
    shipid: string
    quayid: string
    workers: boolean[]
    message: string
}