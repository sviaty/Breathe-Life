export default class Pill {
    idPill: string
    pillName: string
    pillNicotine: string
    isSelected: boolean

    constructor(idPill: string, pillName: string, pillNicotine: string, isSelected: boolean) {
      this.idPill = idPill
      this.pillName = pillName
      this.pillNicotine = pillNicotine
      this.isSelected = isSelected
    }
}