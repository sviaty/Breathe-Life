export default class Pill {
    idPill: string
    pillName: string
    pillNicotine: number

    constructor(idPill: string, pillName: string, pillNicotine: number) {
      this.idPill = idPill
      this.pillName = pillName
      this.pillNicotine = pillNicotine
    }
}