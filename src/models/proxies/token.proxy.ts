/**
 * A interface que representa as informações do token de autenticação enviado pela API
 */
export interface TokenProxy {

  /**
   * O Bearer Token gerado pelo JWT
   */
  token: string;

  /**
   * A data de quando irá expirar
   */
  expiresAt: string;

}
