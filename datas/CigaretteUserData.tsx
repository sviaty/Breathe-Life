export default class CigaretteUser {
    idCigarette: string
    cigaretteName: string
    cigaretteNicotine: number
    cigaretteGoudron: number
    cigaretteCarbone: number
    cigarettePrice: number
    cigaretteNbr: number
    cigarettePriceUnit: number
    idUser: string

    constructor(idCigarette: string, 
      cigaretteName: string, 
      cigaretteNicotine: number, 
      cigaretteGoudron: number, 
      cigaretteCarbone: number, 
      cigarettePrice: number,
      cigaretteNbr: number,
      cigarettePriceUnit: number,
      idUser: string
    ) {
      this.idCigarette = idCigarette
      this.cigaretteName = cigaretteName
      this.cigaretteNicotine = cigaretteNicotine
      this.cigaretteGoudron = cigaretteGoudron
      this.cigaretteCarbone = cigaretteCarbone
      this.cigarettePrice = cigarettePrice
      this.cigaretteNbr = cigaretteNbr
      this.cigarettePriceUnit = cigarettePriceUnit
      this.idUser = idUser
    }
}