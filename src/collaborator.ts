/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="collection-base.ts"/>
/// <reference path="value-object.ts"/>
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
     * @override
     * @param   object
     */
    public load(o: any): Collaborator {
      this.key = o.key;

      this.project = o.project;

      return this;
    }

    /**
     * @override
     */
    public get(key: string): JQueryPromise<Collaborator> {
      throw new Error('NotSupportedException');
    }

    /**
     * POST/PUT リクエストを発行します。
     *
     * @override
     * @throws  Error
     */
    public save(): JQueryPromise<Collaborator> {
      return egrid.storage.add<Collaborator>(this, Collaborator.type, this.projectKey, this.key);
    }

    /**
     * @override
     * @param   key   string  Project Key
     */
    public static listUrl(key? : string) : string {
      return Project.listUrl() + '/' + key + '/collaborators';
    }

    /**
     * @override
     * @param   key   string  Collaborator Key
     */
    public url(key? : string) : string {
      return Collaborator.listUrl(this.projectKey) + '/' + key;
    }

    public remove() : JQueryPromise<boolean> {
      return egrid.storage.remove<Collaborator>(Collaborator.type, this.projectKey, this.key);
    }
  }
}
