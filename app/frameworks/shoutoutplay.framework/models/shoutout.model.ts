export class ShoutoutModel {
  public id: string;
  public name: string;
  public author: string;
  public trackId: string;
  public recordingPath: string;
  public type: string = 'shoutout';
  
  constructor(model?: any) {
    if (model) {
      for (let key in model) {
        if (key === '_id') {
          // couchbase id
          this.id = model[key];
        } else {
          this[key] = model[key];  
        }
      }
    }
  }
}