/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="entity.ts"/>
/// <reference path="value-object.ts"/>

module egrid.model {
  export interface ProjectData {
    name: string;
    note: string;
  }


  interface ApiProjectData extends ProjectData {
    key: string;
    createdAt: string;
    updatedAt: string;
  }


  /**
  * @class Project
  */
  export class Project extends Entity implements ProjectData {
    private createdAt_: ValueObject<Date>;
    private updatedAt_: ValueObject<Date>;

    public name: string;
    public note: string;

    constructor(obj? : ProjectData) {
      super();

      if (obj) {
        this.name = obj.name;
        this.note = obj.note;
      }
    }

    remove() : JQueryXHR {
      return $.ajax({
        url: Project.url(this.getKey()),
        type: 'DELETE',
      });
    }

    private setCreatedAt(date: Date) : void {
      if (!this.createdAt_)
        this.createdAt_ = new ValueObject<Date>(date);
    }

    private setUpdatedAt(date: Date) : void {
      if (!this.updatedAt_)
        this.updatedAt_ = new ValueObject<Date>(date);
    }

    public get createdAt() : Date {
      return this.createdAt_.vomit();
    }

    public get updatedAt() : Date {
      return this.updatedAt_.vomit();
    }

    private url() : string {
      return Project.url(this.getKey());
    }

    public getUri(): string {
      return Project.url();
    }

    public fetch(key: string): JQueryPromise<Project> {
      var $deferred = $.Deferred();

      $.ajax({
          url: Project.url(key),
          type: 'GET',
          dataFilter: data => {
            var obj : ApiProjectData = JSON.parse(data);

            return this.deserialize(obj);
          },
        })
        .then((project : Project) => {
          return $deferred.resolve(project);
        }, () => {
          var target: Project = JSON
            .parse(window.localStorage.getItem('projects'))
            .map((o: any) => {
              return this.deserialize(o);
            })
            .filter((value: Project) => {
              return value.getKey() === key;
            });

          return target ? $deferred.resolve(target[0]) : $deferred.reject();
        });

      return $deferred.promise();
    }

    static url(key? : string) : string {
      if (key) {
        return '/api/projects/' + key;
      } else {
        return '/api/projects';
      }
    }

    /**
     * Object から Project に変換します。
     *
     * @override
     * @param   object
     */
    public deserialize(o: any): Entity {
      this.setKey(o.key);

      this.name = o.name;
      this.note = o.note;

      this.setCreatedAt(o.createdAt);
      this.setUpdatedAt(o.updatedAt);

      return this;
    }

    /**
     * POST/PUT リクエストを発行します。
     *
     * @override
     * @throws  Error
     */
    public publish(): JQueryPromise<Project> {
      var $deferred = $.Deferred();

      return $.ajax({
          url: Project.url(this.getKey()),
          type: this.getKey() ? 'PUT' : 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            key: this.getKey(),
            name: this.name,
            note: this.note,
          }),
          dataFilter: data => {
            var obj : ApiProjectData = JSON.parse(data);

            return new Project().deserialize(obj);
          },
        })
        .then((p: Project) => {
          return $deferred.resolve(p);
        }, () => {
          var q = 'unsavedItems.' + Collection.pluralize(this.getType());

          window.localStorage.setItem(q, JSON.stringify(this));

          return $deferred.reject();
        });

      return $deferred.promise();
    }

    /**
     * クラス情報を取得します。
     *
     * @override
     */
    public getType(): string {
      return 'Project';
    }
  }
}
