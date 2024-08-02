export default class User {
    userId: string
    userName: string
    userMail: string 
    userToken: string

    constructor(userId: string, userName: string, userMail: string | null, userToken: string) {
      this.userId = userId
      this.userName = userName

      if(userMail != null){
        this.userMail = userMail
      } else {
        this.userMail = ''
      }

      this.userToken = userToken
    }

    toString() {
        return this.userId + ', ' + this.userName + ', ' + this.userMail;
    }
}