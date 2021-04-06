/**
 * A interface que representa o payload enviado para realizar login através de uma organização
 */
export interface LoginPayload {

  /**
   * O e-mail do usuário
   */
  username: string;

  /**
   * A senha do usuário
   */
  password: string;

}
