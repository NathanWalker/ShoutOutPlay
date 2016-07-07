import {t} from '../../test.framework/index';
import {CoreConfigService} from '../index';
import * as _ from 'lodash';

export function main() {
  t.describe('core.framework: CoreConfigService', () => {
    t.be(() => CoreConfigService.RESET());
    
    t.it('DEBUG', () => {
      t.e(CoreConfigService.DEBUG.LEVEL_1).toBe(false);
      t.e(CoreConfigService.DEBUG.LEVEL_2).toBe(false);
      t.e(CoreConfigService.DEBUG.LEVEL_3).toBe(false);
      t.e(CoreConfigService.DEBUG.LEVEL_4).toBe(false);
      t.e(CoreConfigService.IS_DEBUG_MODE()).toBe(false);
    });
  });
}
