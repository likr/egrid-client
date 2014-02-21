/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="project.ts"/>

module egrid.model {
  export interface SemProjectData {
    name? : string;
    project? : ProjectData;
    projectKey : string;
  }


  interface ApiSemProjectData extends SemProjectData {
    key : string;
  }


  export class SemProject implements SemProjectData {
    private key_ : string;
    public name : string;
    public project : ProjectData;
    public projectKey : string;


    constructor(obj : SemProjectData) {
      this.name = obj.name;
      this.project = obj.project;
      this.projectKey = obj.projectKey;
    }

    key() : string {
      return this.key_;
    }

    static get(projectKey : string, semProjectKey : string) : JQueryPromise<SemProject> {
      var $deferred = $.Deferred();

      $.ajax({
          url: SemProject.url(projectKey, semProjectKey),
          type: 'GET',
          dataFilter: data => {
            var obj : ApiSemProjectData = JSON.parse(data);
            return SemProject.load(obj);
          },
        })
        .then((semProject: SemProject) => {
          return $deferred.resolve(semProject);
        }, () => {
          var target: SemProject = JSON
            .parse(window.localStorage.getItem('semProjects'))
            .map(SemProject.import)
            .filter((value: SemProject) => {
              return value.key() === semProjectKey;
            });

          return target ? $deferred.resolve(target[0]) : $deferred.reject();
        });

      return $deferred.promise();
    }

    static query(projectKey : string) : JQueryPromise<SemProject[]> {
      var $deferred = $.Deferred();

      $.ajax({
          url: SemProject.url(projectKey),
          type: 'GET',
          dataFilter: data => {
            var objs = JSON.parse(data);
            return objs.map((obj : ApiSemProjectData) => {
              return SemProject.load(obj);
            });
          },
        })
        .then((semProjects: SemProject[]) => {
          window.localStorage.setItem('semProjects', JSON.stringify(semProjects));

          return $deferred.resolve(semProjects);
        }, () => {
          return $deferred.resolve(JSON.parse(window.localStorage.getItem('semProjects')).map(SemProject.import));
        });

      return $deferred.promise();
    }

    private static load(obj : ApiSemProjectData) : SemProject {
      var semProject = new SemProject(obj);
      semProject.key_ = obj.key;
      return semProject;
    }

    private static url(projectKey : string, semProjectKey? : string) : string {
      if (semProjectKey) {
        return '/api/projects/' + projectKey + '/sem-projects/' + semProjectKey;
      } else {
        return '/api/projects/' + projectKey + '/sem-projects';
      }
    }

    static import(o: any) : SemProject {
      var p: SemProject = new SemProject(o);

      p.key_ = o.key_;

      return p;
    }

    /**
     * POST/PUT リクエストを発行します。
     *
     * TODO: StorableBase<T> に移動…するかも
     * @throws  Error
     */
    public publish() : JQueryPromise<SemProject> {
      var $deferred = $.Deferred();

      return $.ajax({
          url: SemProject.url(this.projectKey, this.key()),
          type: this.key() ? 'PUT' : 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            key: this.key(),
            name: this.name,
          }),
          dataFilter: data => {
            var obj : ApiSemProjectData = JSON.parse(data);
            this.key_ = obj.key;
            return this;
          },
        })
        .then((p: SemProject) => {
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
     * @see SemProject.publish
     */
    public static flush() : JQueryPromise<SemProject[]> {
      var $deferred = $.Deferred();
      var unsavedItems: any[];

      unsavedItems = JSON.parse(window.localStorage.getItem('unsavedSemProjects')) || [];

      $.when.apply($, unsavedItems
        .map((o: any) => {
          var p = SemProject.import(o);

          return p.publish();
        }))
        .then((...projects: SemProject[]) => {
          window.localStorage.removeItem('unsavedSemProjects');

          return $deferred.resolve(projects);
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
     * @see SemProject.flush
     */
    public save() : JQueryPromise<SemProject> {
      var $deferred = $.Deferred();

      var items = JSON.parse(window.localStorage.getItem('unsavedSemProjects')) || [];

      items.push(this);

      window.localStorage.setItem('unsavedSemProjects', JSON.stringify(items));

      SemProject.flush()
        .then(() => {
          return $deferred.resolve();
        }, () => {
          return $deferred.reject();
        });

      return $deferred.promise();
    }
  }
}
