/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="collection-base.ts"/>
/// <reference path="value-object.ts"/>
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


  export class SemProject extends Entity {
    private createdAt_: ValueObject<Date>;
    private updatedAt_: ValueObject<Date>;

    public name : string;
    public project : ProjectData;
    public projectKey : string;

    public static type: string = 'SemProject';
    public static url: string = '/api/projects/:projectId/sem-projects/:semProjectId';

    constructor(obj? : SemProjectData) {
      super();

      if (obj) {
        this.name = obj.name;
        this.project = obj.project;
        this.projectKey = obj.projectKey;
      }
    }

    public get createdAt() : Date {
      return this.createdAt_.value;
    }

    public get updatedAt() : Date {
      return this.updatedAt_.value;
    }

    private setCreatedAt(date: Date) : void {
      if (!this.createdAt_)
        this.createdAt_ = new ValueObject<Date>(date);
    }

    private setUpdatedAt(date: Date) : void {
      if (!this.updatedAt_)
        this.updatedAt_ = new ValueObject<Date>(date);
    }

    /**
     * Object から Participant に変換します。
     *
     * @override
     * @param   object
     */
    public load(o: any): SemProject {
      this.key = o.key;

      this.name = o.name;

      this.project = o.project;

      this.setCreatedAt(o.createdAt);
      this.setUpdatedAt(o.updatedAt);

      return this;
    }

    /**
     * @override
     */
    public get(key: string): JQueryPromise<SemProject> {
      var $deferred = $.Deferred();

      $.ajax({
          url: this.url(key),
          type: 'GET',
          dataFilter: data => {
            var obj = JSON.parse(data);

            return this.load(obj);
          },
        })
        .then((semProject : SemProject) => {
          return $deferred.resolve(semProject);
        }, () => {
          var k = CollectionBase.pluralize(SemProject.type);
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
    public save(): JQueryPromise<SemProject> {
      var $deferred = $.Deferred();
      var key = this.key;

      return $.ajax({
          url: key ? this.url(key) : SemProject.listUrl(this.projectKey),
          type: this.key ? 'PUT' : 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            key: this.key,
            name: this.name,
          }),
          dataFilter: data => {
            var obj : ApiSemProjectData = JSON.parse(data);

            return this.load(obj);
          },
        })
        .then((p: Project) => {
            return $deferred.resolve(p);
          }, (...reasons) => {
            var o = {};
            var key = 'unsavedItems.' + CollectionBase.pluralize(SemProject.type);
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
      return Project.listUrl() + '/' + key + '/sem-projects';
    }

    /**
     * @override
     * @param   key   string  SemProject Key
     */
    public url(key? : string) : string {
      return SemProject.listUrl(this.projectKey) + '/' + key;
    }
  }
}
