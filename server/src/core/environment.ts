export class Env {
  //#region Server
  static PORT = 3000;
  static SECRET_KEY = 'secret_key';
  /**
   * Token expiration in seconds
   */
  static TOKEN_EXPIRATION = 60;
  //#endregion

  //#region Database
  static DATABASE_NAME = 'geekychat';
  // static USERS_DATABASE_NAME = 'users';
  // static ROOMS_DATABASE_NAME = 'rooms';
  // static MESSAGES_DATABASE_NAME = 'messages';
  static USERS_VIEW_URL = '_design/users/_view/';
  static ROOMS_VIEW_URL = '_design/rooms/_view/';
  static MESSAGES_VIEW_URL = '_design/messages/_view/';
  // static JOIN_TOKEN_VIEW_URL = '_design/all_join_token/_view/all?include_docs=false';
  //#endregion
}
