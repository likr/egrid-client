/// <reference path="typings/jquery/jquery.d.ts"/>
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
      return this.createdAt_ ? this.createdAt_.value : null;
    }

    public get updatedAt() : Date {
      return this.updatedAt_ ? this.updatedAt_.value : null;
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
      return egrid.storage.get<SemProject>(SemProject.type, this.projectKey, key).then((semProject: SemProject) => {
          return this.load(semProject);
        });
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

      $.ajax({
          url: key ? this.url(key) : SemProject.listUrl(this.projectKey),
          type: key ? 'PUT' : 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            key: key,
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
            var storageKey = 'unsavedItems.' + CollectionBase.pluralize(SemProject.type);
            var unsavedItems = JSON.parse(window.localStorage.getItem(storageKey)) || {};
            var irregulars: any;

            if (this.key) {
              o[this.key] = this;
            } else {
              o[Object.keys(unsavedItems).length] = this; // FIXME
            }

            irregulars = $.extend({}, unsavedItems, o);

            window.localStorage.setItem(storageKey, JSON.stringify(irregulars));

            return $deferred.reject();
          });

      return $deferred.promise();
    }

    /**
     * @override
     * @param   key   string  Project Key
     */
    public static listUrl(key? : string) : string {
      return '/api/projects/' + key + '/sem-projects';
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
