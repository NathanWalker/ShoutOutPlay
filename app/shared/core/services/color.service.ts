interface ICOLORS {
  BASE: string;
  COMPLIMENTARY: string;
  PRIMARY: string;
  SECONDARY: string;
  HIGHLIGHT: string;
  BRIGHT: string;
  RED: string;
  WHITE: string;
  YELLOW: string;
  BRIGHT_ALT?: string;
}

const DEFAULT_SCHEME: ICOLORS = {
  BASE: '#010006',
  COMPLIMENTARY: '#010027',
  PRIMARY: '#6a2ecd',
  SECONDARY: '#000077',
  HIGHLIGHT: '#9f64d8',
  BRIGHT: '#4EFF0B',
  RED: '#BC1224',
  WHITE: '#fff',
  YELLOW: '#FFD110'
};

const GRAY_SCHEME: ICOLORS = {
  BASE: '#333333',
  COMPLIMENTARY: '#444444',
  PRIMARY: '#efefef',
  SECONDARY: '#555555',
  HIGHLIGHT: '#999999',
  BRIGHT: '#FFD110',
  RED: '#BC1224',
  WHITE: '#fff',
  YELLOW: '#FFD110',
  BRIGHT_ALT: '#FF9505'
};

export class ColorService {

  public static ActiveId: number = 0;  
  public static Active: ICOLORS = DEFAULT_SCHEME;

  public static swapScheme(index: number) {
    ColorService.ActiveId = index;
    switch (index) {
      case 0:
        ColorService.Active = DEFAULT_SCHEME;
        break;
      case 1:
        ColorService.Active = GRAY_SCHEME;
        break;
      // TODO: support more
    }
  }
}