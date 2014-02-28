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
      var $deferred = $.Deferred();

      $.ajax({
          url: this.url(key),
          type: 'GET',
          dataFilter: data => {
            var obj = JSON.parse(data);

            return this.load(obj);
          },
        })
        .then((collaborator : Collaborator) => {
          return $deferred.resolve(collaborator);
        }, () => {
          var k = CollectionBase.pluralize(Collaborator.type);
          var objects = window.localStorage.getItem(k) || [];
          var unsaved = window.localStorage.getItem('unsavedItems.' + k) || [];

          var target = $.extend(JSON.parse(objects), JSON.parse(unsaved));

          return target[key] ? $deferred.resolve(this.load(target[key])) : $deferred.reject();
        });

      return $deferred.promise();
    }

    /**
     * POST/PUT リクエストを発行します。
     *
     * @override
     * @throws  Error
     */
    public save(): JQueryPromise<Collaborator> {
      var $deferred = $.Deferred();
      var key = this.key;

      return $.ajax({
          url: key ? this.url(key) : Collaborator.listUrl(this.projectKey),
          type: this.key ? 'PUT' : 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            key: this.key,
            isManager: this.isManager,
            projectKey: this.projectKey,
            userEmail: this.userEmail,
          }),
          dataFilter: data => {
            var obj : ApiCollaboratorData = JSON.parse(data);

            return this.load(obj);
          },
        })
        .then((c: Collaborator) => {
            return $deferred.resolve(c);
          }, (...reasons) => {
            var o = {};
            var key = 'unsavedItems.' + CollectionBase.pluralize(Collaborator.type);
            var unsavedItems: any[];

            o[this.key] = this;

            unsavedItems = $.extend({}, JSON.parse(window.localStorage.getItem(key)), o);

            window.localStorage.setItem(key, JSON.stringify(unsavedItems));

            return $deferred.reject();
          });

      return $deferred.promise();
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

    public remove() : JQueryXHR {
      return $.ajax({
        url: this.url(this.key),
        type: 'DELETE',
      });
    }
  }
}
