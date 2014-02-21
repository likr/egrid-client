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

    key() : string {
      return this.key_;
    }

    remove() : JQueryXHR {
      return $.ajax({
        url: Collaborator.url(this.projectKey, this.key()),
        type: 'DELETE',
      });
    }

    static get(projectKey : string, collaboratorKey : string) : JQueryPromise<Collaborator> {
      var $deferred = $.Deferred();

      $.ajax({
          url: Collaborator.url(projectKey, collaboratorKey),
          type: 'GET',
          dataFilter: data => {
            var obj = JSON.parse(data);
            return Collaborator.load(obj);
          },
        })
        .then((collaborator: Collaborator) => {
          return $deferred.resolve(collaborator);
        }, () => {
          var target: Collaborator = JSON
            .parse(window.localStorage.getItem('collaborators'))
            .map(Collaborator.load)
            .filter((value: Collaborator) => {
              return value.key() === collaboratorKey;
            });

          return target ? $deferred.resolve(target[0]) : $deferred.reject();
        });

      return $deferred.promise();
    }

    static query(projectKey : string) : JQueryPromise<Collaborator[]> {
      var $deferred = $.Deferred();

      $.ajax({
          url: Collaborator.url(projectKey),
          type: 'GET',
          dataFilter: data => {
            var objs = JSON.parse(data);
            return objs.map((obj : ApiCollaboratorData) => {
              return Collaborator.load(obj);
            });
          },
        })
        .then((collaborators: Collaborator[]) => {
          window.localStorage.setItem('collaborators', JSON.stringify(collaborators));

          return $deferred.resolve(collaborators);
        }, () => {
          return $deferred.resolve(JSON.parse(window.localStorage.getItem('collaborators')).map(Collaborator.load));
        });

      return $deferred.promise();
    }

    private static load(obj : ApiCollaboratorData) : Collaborator {
      var collaborator = new Collaborator(obj);
      collaborator.key_ = obj.key;
      return collaborator;
    }

    private static url(projectKey : string, key? : string) : string {
      if (key) {
        return '/api/projects/'  + projectKey + '/collaborators/' + key;
      } else {
        return '/api/projects/'  + projectKey + '/collaborators';
      }
    }

    /**
     * POST/PUT リクエストを発行します。
     *
     * TODO: StorableBase<T> に移動…するかも
     * @throws  Error
     */
    public publish() : JQueryPromise<Collaborator> {
      var $deferred = $.Deferred();

      return $.ajax({
          url: Collaborator.url(this.projectKey, this.key()),
          type: this.key() ? 'PUT' : 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            key: this.key(),
            isManager: this.isManager,
            projectKey: this.projectKey,
            userEmail: this.userEmail,
          }),
          dataFilter: data => {
            var obj : ApiCollaboratorData = JSON.parse(data);
            this.key_ = obj.key;
            return this;
          },
        })
        .then((p: Collaborator) => {
          return $deferred.resolve(p);
        }, () => {
          return $deferred.reject();
        });

      return $deferred.promise();
    }

    /**
     * localStorage に格納されている各要素に対して publish メソッドを発行します。
     *
     * TODO: Collection<T> に IFlushable を実装…かも
     * @see Collaborator.publish
     */
    public static flush() : JQueryPromise<Collaborator[]> {
      var $deferred = $.Deferred();
      var unsavedItems: any[];

      unsavedItems = JSON.parse(window.localStorage.getItem('unsavedCollaborators')) || [];

      $.when.apply($, unsavedItems
        .map((o: any) => {
          var p = Collaborator.load(o);

          return p.publish();
        }))
        .then((...collaborators: Collaborator[]) => {
          window.localStorage.removeItem('unsavedCollaborators');

          return $deferred.resolve(collaborators);
        }, () => {
          return $deferred.reject();
        });

      return $deferred.promise();
    }

    /**
     * localStorage と this を保存するラッパーメソッドです。
     * flush メソッドを実行します。
     *
     * TODO: StorableBase<T> に移動…するかも
     * @see Collaborator.flush
     */
    public save() : JQueryPromise<Collaborator> {
      var $deferred = $.Deferred();
      var items = JSON.parse(window.localStorage.getItem('unsavedCollaborators')) || [];

      items.push(this);

      window.localStorage.setItem('unsavedCollaborators', JSON.stringify(items));

      Collaborator.flush()
        .then(() => {
          return $deferred.resolve();
        }, () => {
          return $deferred.reject();
        });

      return $deferred.promise();
    }
  }
}
