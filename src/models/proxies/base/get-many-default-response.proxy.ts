/**
 * A classe que representa as informações básicas de toda entidade que será enviada para o usuário
 */
export interface GetManyDefaultResponseProxy {

  /**
   * A contagem de quantos items veio nessa busca limitado pelo pageCount
   */
  count: number;

  /**
   * O total de itens que essa busca pode retornar
   */
  total: number;

  /**
   * A página na qual está essa busca
   */
  page: number;

  /**
   * A quantidade de itens que deve retornar por página
   */
  pageCount: number;

}
