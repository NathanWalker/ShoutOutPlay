export class ShoutoutModel {
  public id: number;
  public name: string;
  public author: string;
  public trackId: string;
  public recordingPath: string;
  
  constructor(model?: any) {
    if (model) {
      for (let key in model) {
        this[key] = model[key];
      }
    }
    if (!this.id) {
      this.id = Math.floor(Math.random()*100000000000000000);  
    }
  }
}