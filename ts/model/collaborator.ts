/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="project.ts"/>
/// <reference path="user.ts"/>

module egrid {
export module api {
  export class CollaboratorLike {
    is_manager : boolean;
    project : ProjectLike;
    user : UserLike;
  }


  export interface CollaboratorData extends CollaboratorLike {
    key : string;
    user : UserData;
  }


  export class Collaborator implements CollaboratorLike {
    public is_manager : boolean;
    public project : Project;
    public user : User;


    constructor() {
    }


    static load(obj : CollaboratorData) : Collaborator {
      var collaborator = new Collaborator;
      collaborator.key_ = obj.key;
      collaborator.is_manager = obj.is_manager;
      collaborator.user = User.load(obj.user);
      return collaborator;
    }
  }
}
}
