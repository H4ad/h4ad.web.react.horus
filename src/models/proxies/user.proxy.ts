//#region Imports

import { BaseCrudProxy } from './base/base.proxy';

//#endregion

/**
 * A interface que representa as informações de um usuário
 */
export interface UserProxy extends BaseCrudProxy {
  /**
   * O e-mail do usuário
   */
  email: string;
}
