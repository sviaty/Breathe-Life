export default class Cigarette {
    idCigarette: string
    cigaretteName: string
    cigaretteNicotine: number
    cigaretteGoudron: number
    cigaretteCarbone: number
    cigarettePrice: number


    constructor(idCigarette: string, cigaretteName: string, cigaretteNicotine: number, cigaretteGoudron: number, cigaretteCarbone: number, cigarettePrice: number) {
      this.idCigarette = idCigarette
      this.cigaretteName = cigaretteName
      this.cigaretteNicotine = cigaretteNicotine
      this.cigaretteGoudron = cigaretteGoudron
      this.cigaretteCarbone = cigaretteCarbone
      this.cigarettePrice = cigarettePrice
    }
}