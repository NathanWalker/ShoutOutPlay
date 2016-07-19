import {knownFolders} from 'file-system';

export class Utils {
  
  public static getFilename(path: string) {
    if (path) {
      let parts = path.split('/');
      return parts[parts.length - 1];
    }
  }

  public static documentsPath(filename: string) {
    return `${knownFolders.documents().path}/${filename}`;
  }
}