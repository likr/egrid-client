/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="project.ts"/>
/// <reference path="user.ts"/>

module egrid.model {
  export interface CollaboratorData {
    isManager? : boolean;
    project? : ProjectData;
    projectKey : string;
    user? : UserData;
    userEmail? : string;
  }


  interface ApiCollaboratorData extends CollaboratorData {
    key : string;
  }


  export class Collaborator implements CollaboratorData {
    private key_ : string;
    public isManager : boolean;
    public project : ProjectData;
    public projectKey : string;
    public user : UserData;
    public userEmail : string;

    constructor(obj : CollaboratorData) {
      this.isManager = obj.isManager;
      this.project = obj.project;
      this.projectKey = obj.projectKey;
      this.user = obj.user;
      this.userEmail = obj.userEmail;
    }

    save() : JQueryXHR {
      return $.ajax({
        url: Collaborator.url(this.projectKey),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          isManager: this.isManager,
          projectKey: this.projectKey,
          userEmail: this.userEmail,
        }),
        dataFilter: data => {
          var obj : ApiCollaboratorData = JSON.parse(data);
          this.key_ = obj.key;
          return this;
        },
      });
    }

    static query(projectKey : string) : JQueryXHR {
      return $.ajax({
        url: Collaborator.url(projectKey),
        type: 'GET',
        dataFilter: data => {
          var objs = JSON.parse(data);
          return objs.map((obj : ApiCollaboratorData) => {
            return Collaborator.load(obj);
          });
        },
      });
    }

    private static load(obj : ApiCollaboratorData) : Collaborator {
      var collaborator = new Collaborator(obj);
      collaborator.key_ = obj.key;
      return collaborator;
    }

    private static url(projectKey : string, key? : string) : string {
      if (key) {
        return '/api/projects/'  + projectKey + '/collaborators' + key;
      } else {
        return '/api/projects/'  + projectKey + '/collaborators';
      }
    }
  }
}
