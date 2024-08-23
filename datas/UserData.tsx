export default class User {
    userId: string
    userName: string
    userMail: string 
    userToken: string
    userBirthDate: string
    userSmokeAvgNbr: number
    idPatch: string
    idPill: string
    idCigarette: string

    constructor(userId: string, 
      userName: string, 
      userMail: string | null, 
      userToken: string, 
      userBirthDate: string,
      userSmokeAvgNbr: number,
      idPatch: string, 
      idPill: string, 
      idCigarette: string) {

      this.userId = userId
      this.userName = userName

      if(userMail != null){
        this.userMail = userMail
      } else {
        this.userMail = ''
      }

      this.userToken = userToken

      this.userBirthDate = userBirthDate
      this.userSmokeAvgNbr = userSmokeAvgNbr

      this.idPatch = idPatch
      this.idPill = idPill
      this.idCigarette = idCigarette
    }

}