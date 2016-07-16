interface IShoutOutPlayUser {
  uid: string;
  email: string;
  product: number;
  playlists: any;
  shoutouts: any;
}

export class ShoutOutPlayUser implements IShoutOutPlayUser {
  public uid: string;
  public email: string;
  public product: number;
  public playlists: any;
  public shoutouts: any;

  constructor(model?: any) {
    if (model) {
      for (let key in model) {
        this[key] = model[key];  
      }
    }
  }
}