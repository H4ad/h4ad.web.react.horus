/**
 * As informações enviadas para criar um usuário
 */
export interface CreateUserPayload {

  /**
   * O nome do usuário
   */
  name: string;

  /**
   * O e-mail do usuário
   */
  username: string;

  /**
   * A senha do usuário
   */
  password: string;

}
