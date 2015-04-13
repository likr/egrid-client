/// <reference path="../typings/jquery/jquery.d.ts"/>
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


  export class Collaborator extends Entity {
    public isManager : boolean;
    public project : ProjectData;
    public projectKey : string;
    public user : UserData;
    public userEmail : string;

    public static type: string = 'Collaborator';
    public static url: string = '/api/projects/:projectId/collaborators/:collaboratorId';

    constructor(obj? : CollaboratorData) {
      super();

      if (obj) {
        this.isManager = obj.isManager;
        this.project = obj.project;
        this.projectKey = obj.projectKey;
        this.user = obj.user;
        this.userEmail = obj.userEmail;
      }
    }

    /**
     * Object から Participant に変換します。
     *
     * @param   object
     */
    public load(o: any): Collaborator {
      this.key = o.key;

      this.project = o.project;

      return this;
    }

    /**
     */
    public get(key: string): JQueryPromise<Collaborator> {
      throw new Error('NotSupportedException');
    }

    public static query(projectKey : string) : JQueryPromise<Collaborator[]> {
      return storage.retrieve<Collaborator>(Collaborator.type, projectKey);
    }

    /**
     * POST/PUT リクエストを発行します。
     *
     * @throws  Error
     */
    public save(): JQueryPromise<void> {
      return storage.add<Collaborator>(this, Collaborator.type, this.projectKey, this.key);
    }

    public remove() : JQueryPromise<void> {
      return storage.remove<Collaborator>(Collaborator.type, this.projectKey, this.key);
    }
  }
}
