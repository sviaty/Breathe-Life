export default class Patch {
    idPatch: string
    patchName: string
    patchNicotine: string
    isSelected: boolean

    constructor(idPatch: string, patchName: string, patchNicotine: string, isSelected: boolean) {
      this.idPatch = idPatch
      this.patchName = patchName
      this.patchNicotine = patchNicotine
      this.isSelected = isSelected
    }
}