export class User {
  _id: string;
  _rev: string;
  doc_type: string = 'user';
  email: string;
  password: string;
  username: string;
  constructor(data?) {
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
