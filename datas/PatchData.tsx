export default class Patch {
    idPatch: string
    patchName: string
    patchNicotine: number

    constructor(idPatch: string, patchName: string, patchNicotine: number) {
      this.idPatch = idPatch
      this.patchName = patchName
      this.patchNicotine = patchNicotine
    }
}