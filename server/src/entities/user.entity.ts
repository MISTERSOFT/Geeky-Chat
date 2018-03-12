export class User {
  id: string;
  email: string;
  password: string;
  username: string;
  constructor(data?) {
    if (data) {
      for (const key in data) {
        if (this.hasOwnProperty(key)) {
          this[key] = data[key];
        }
      }
    }
  }
}
