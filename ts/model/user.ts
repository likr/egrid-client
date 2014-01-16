/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>

module egrid {
export module api {
  export interface UserLike {
    nickname : string;
  }


  export interface UserData extends UserLike {
    key : string;
  }


  export class User implements UserLike {
    private key_ : string;
    public nickname : string;


    constructor(obj : UserLike) {
      this.nickname = obj.nickname;
    }


    static load(obj : UserData) : User {
      var user = new User(obj);
      user.key_ = obj.key;
      return user;
    }
  }
}
}
