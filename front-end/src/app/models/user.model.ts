export class User {
  private _name:string;
  private _lastName:string;
  private _email:string;
  private _password:string;


  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  toRequestObject(): { [key: string]: string } {
    return {
      name: this._name,
      lastName: this._lastName,
      email: this._email,
      password: this._password, // Include password only if it's safe to do so
    };
  }

}
