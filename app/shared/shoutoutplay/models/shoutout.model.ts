export class ShoutoutModel {
  public id: string;
  public author: string;
  public trackId: string;
  public playlistId: string;
  public recordingPath: string;
  public playing: boolean = false;
  public type: string = 'shoutout';
  
  constructor(model?: any) {
    if (model) {
      for (let key in model) {
        if (key === '_id') {
          // firebase id
          this.id = model[key];
        } else {
          this[key] = model[key];  
        }
      }
    }
  }
}