export default class Cigarette {
    idCigarette: string
    cigaretteName: string
    cigaretteNicotine: string
    cigaretteGoudron: string
    cigaretteCarbone: string
    cigarettePrice: number
    isSelected: boolean

    constructor(idCigarette: string, cigaretteName: string, cigaretteNicotine: string, cigaretteGoudron: string, cigaretteCarbone: string, cigarettePrice: number, isSelected: boolean) {
      this.idCigarette = idCigarette
      this.cigaretteName = cigaretteName
      this.cigaretteNicotine = cigaretteNicotine
      this.cigaretteGoudron = cigaretteGoudron
      this.cigaretteCarbone = cigaretteCarbone
      this.cigarettePrice = cigarettePrice
      this.isSelected = isSelected
    }
}