export class ShoutoutModel {
  public id: string;
  public author: string;
  public trackId: string;
  public playlistId: string;
  public filename: string;
  public playing: boolean = false;
  public type: string = 'shoutout';
  
  constructor(model?: any) {
    if (model) {
      if (model.id) 
        this.id = model.id;
      for (let key in model) {
        if (key !== 'id') {
          this[key] = model[key];
        }
      }
    }
  }
}