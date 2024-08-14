export default class Cigarette {
    idCigarette: string
    cigaretteName: string
    cigaretteNicotine: number
    cigaretteGoudron: number
    cigaretteCarbone: number
    cigarettePrice: number
    cigaretteNbr: number
    cigarettePriceUnit: number


    constructor(idCigarette: string, 
      cigaretteName: string, 
      cigaretteNicotine: number, 
      cigaretteGoudron: number, 
      cigaretteCarbone: number, 
      cigarettePrice: number,
      cigaretteNbr: number,
      cigarettePriceUnit: number
    ) {
      this.idCigarette = idCigarette
      this.cigaretteName = cigaretteName
      this.cigaretteNicotine = cigaretteNicotine
      this.cigaretteGoudron = cigaretteGoudron
      this.cigaretteCarbone = cigaretteCarbone
      this.cigarettePrice = cigarettePrice
      this.cigaretteNbr = cigaretteNbr
      this.cigarettePriceUnit = cigarettePriceUnit
    }
}