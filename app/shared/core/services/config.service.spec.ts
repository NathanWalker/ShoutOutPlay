import {t} from '../../test/index';
import {Config} from '../index';
import * as _ from 'lodash';

export function main() {
  t.describe('core: Config', () => {
    t.be(() => Config.RESET());
    
    t.it('DEBUG', () => {
      t.e(Config.DEBUG.LEVEL_1).toBe(false);
      t.e(Config.DEBUG.LEVEL_2).toBe(false);
      t.e(Config.DEBUG.LEVEL_3).toBe(false);
      t.e(Config.DEBUG.LEVEL_4).toBe(false);
      t.e(Config.IS_DEBUG_MODE()).toBe(false);
    });
  });
}
