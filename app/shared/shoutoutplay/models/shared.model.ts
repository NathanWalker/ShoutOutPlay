export class SharedModel {
  public id: string;
  public trackId: string // spotify track id
  public sharedBy: string;
  public name: string;
  public artist: string;
  public remoteFilePath: string; // for downloading again or on diff device
  public playing: boolean = false;
  public order: number;
  public type: string;

  constructor(model: any) {
    if (model) {
      for (let key in model) {
        this[key] = model[key];
      }
      if (!this.order) {
        this.order = 0;
      }
    }
    this.type = 'shared';
  }
}