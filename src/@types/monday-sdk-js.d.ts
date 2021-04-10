// Type definitions for monday-sdk-js 0.1
// Project: https://github.com/mondaycom/monday-sdk-js#readme
// Definitions by: Josh Parnham <https://github.com/josh->
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Modified to add export by Vinícius Lourenço <https://github.com/H4ad>

interface APIOptions {
  /**
   * Access token for the API
   * If not set, will use the credentials of the current user (client only)
   */
  token?: string;

  /**
   * An object containing GraphQL query variables
   */
  variables?: Record<string, unknown>;
}

type SubscribableEvents = 'context' | 'settings' | 'itemIds' | 'events';

interface OAuthOptions {
  /**
   * The OAuth client ID of the requesting application
   * Defaults to your client ID
   */
  clientId?: string;

  /**
   * The URL of the monday OAuth endpoint
   */
  mondayOauthUrl?: string;
}

interface GetResponse {
  value: any;
  version: any;
}

interface SetResponse {
  success: boolean;
  reason?: string;
}

interface MondayClientSdk {
  /**
   * Used for querying the monday.com GraphQL API seamlessly on behalf of the connected user, or using a provided API token.
   * For more information about the GraphQL API and all queries and mutations possible, read the [API Documentation](https://monday.com/developers/v2)
   * @param query A [GraphQL](https://graphql.org/) query, can be either a query (retrieval operation) or a mutation (creation/update/deletion operation).
   * Placeholders may be used, which will be substituted by the variables object passed within the options.
   * @param options
   */
  api<T>(query: string, options?: APIOptions): Promise<T>;

  /**
   * Instead of passing the API token to the `api()` method on each request, you can set the API token once using:
   * @param token Access token for the API
   */
  setToken(token: string): void;

  /**
   * Used for retrieving data from the parent monday.com application where your app is currently running.
   * This object can only be used when your app is running inside an `iframe`. This can only be used in client-side apps.
   * @param type The type of requested information (available values below)
   * - `'context'` Information about where this app is currently displayed, depending on the type of feature
   * - `'settings'` The application settings as configured by the user that installed the app
   * - `'itemIds'` The list of item IDs that are filtered in the current board (or all items if no filters are applied)
   * - `'sessionToken'` A JWT token which is decoded with your app's secret and can be used as a session token between your app's frontend & backend
   * @param params Reserved for future use
   */
  get<T>(type: 'context' | 'settings' | 'itemIds' | 'sessionToken', params?: Record<string, unknown>): Promise<T>;

  /**
   * Creates a listener which allows subscribing to certain types of client-side events.
   * @param typeOrTypes The type, or array of types, of events to subscribe to
   * @param callback A callback function that is fired when the listener is triggered by a client-side event
   * @param params Reserved for future use
   */
  listen<T>(
    typeOrTypes: SubscribableEvents | ReadonlyArray<SubscribableEvents>,
    callback: (res: T) => void,
    params?: Record<string, unknown>,
  ): void;

  /**
   * Opens a popup card with information from the selected item
   * @param type Which action to perform
   * @param params Optional parameters for the action
   */
  execute<T>(
    type: 'openItemCard',
    params: {
      /**
       * The ID of the item to open
       */
      itemId: number;

      /**
       * On which view to open the item card.
       * Can be "updates" / "columns"
       * Defaults to "columns"
       */
      kind?: 'updates' | 'columns';
    },
  ): Promise<T>;

  /**
   * Opens a confirmation dialog to the user **type** `'confirm'`
   * @param type Which action to perform
   * @param params Optional parameters for the action
   */
  execute<T>(
    type: 'confirm',
    params: {
      /**
       * The message to display in the dialog
       */
      message: string;

      /**
       * The text for the confirmation button
       * Defaults to "OK"
       */
      confirmButton?: string;

      /**
       * The text for the cancel button
       * Defaults to "Cancel"
       */
      cancelButton?: string;

      /**
       * Either to exclude the cancel button
       * Defaults to `false`
       */
      excludeCancelButton?: boolean;
    },
  ): Promise<T>;

  /**
   * Display a message at the top of the user's page. Useful for success, error & general messages.
   * @param type Which action to perform
   * @param params Optional parameters for the action
   */
  execute<T>(
    type: 'notice',
    params: {
      /**
       * The message to display
       */
      message: string;

      /**
       * The type of message to display. Can be "success" (green), "error" (red) or "info" (blue)
       * Defaults to "info"
       */
      type?: 'success' | 'error' | 'info';

      /**
       * The number of milliseconds to show the message until it closes
       * Defaults to 5000
       */
      timeout?: number;
    },
  ): Promise<T>;

  /**
   * Performs a client-side redirection of the user to the monday OAuth screen with your client ID embedded in the URL,
   * sin order to get their approval to generate a temporary OAuth token based on your requested permission scopes.
   * @param object An object with options
   */
  oauth(object?: OAuthOptions): void;

  /**
   * The Storage API is in early beta stages, its API is likely to change
   *
   * The monday apps infrastructure includes a persistent, key-value database storage that developers
   * can leverage to store data without having to create their own backend and maintain their own database.
   *
   * The database currently offers instance-level storage only, meaning that each application instance (i.e. a single board view or a dashboard widget) maintains its own storage.
   * Apps cannot share storage across accounts or even across apps installed in the same location.
   */
  storage: {
    instance: {
      /**
       * Returns a stored value from the database under `key`
       * @param key
       */
      getItem(key: string): Promise<GetResponse>;

      /**
       * Stores `value` under `key` in the database
       * @param key
       * @param value
       */
      setItem(key: string, value: unknown): Promise<SetResponse>;
    };
  };
}

interface MondayServerSdk {
  setToken(token: string): void;

  api<T>(query: string, options?: Partial<{ token: string }>): Promise<T>;

  oauthToken<T>(code: string, clientId: string, clientSecret: string): Promise<T>;
}

export { MondayClientSdk, APIOptions, MondayServerSdk, OAuthOptions, GetResponse, SetResponse, init, SubscribableEvents };

