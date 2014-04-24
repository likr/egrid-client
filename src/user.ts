/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>

module egrid.model {
  export interface UserData {
    email? : string;
    location? : string;
    nickname? : string;
  }


  interface ApiUserData extends UserData {
    key : string;
  }


  export class User implements UserData {
    private key_ : string;
    public email : string;
    public location : string;
    public nickname : string;
  }
}
