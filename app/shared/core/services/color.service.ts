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

export class ColorService {

  public static Active: ICOLORS = DEFAULT_SCHEME;

  public static swapScheme(index: number) {
    switch (index) {
      case 0:
        ColorService.Active = DEFAULT_SCHEME;
        break;
      // TODO: support more (gray/yellow theme for sure)
    }
  }
}