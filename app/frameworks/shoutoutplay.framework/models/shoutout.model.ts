export class ShoutoutModel {
  public id: string;
  public tmpId: string;
  public author: string;
  public trackId: string;
  public recordingPath: string;
  public playing: boolean = false;
  public queueDelete: boolean = false;
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
    if (!this.id) {
      // to link shoutout to track without waiting for shoutout to save
      this.tmpId = Math.floor(Math.random() * 100000000000).toString();
    }
  }
}