/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="entity.ts"/>

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
    private createdAt_: Date;
    private updatedAt_: Date;

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

    public get createdAt() : Date {
      return this.createdAt_;
    }

    public get updatedAt() : Date {
      return this.updatedAt_;
    }

    private url() : string {
      return Project.url(this.getKey());
    }

    public static getUri(): string {
      return Project.url();
    }

    public fetch(key: string): JQueryPromise<Project> {
      var $deferred = $.Deferred();

      $.ajax({
          url: Project.url(key),
          type: 'GET',
          dataFilter: data => {
            var obj : ApiProjectData = JSON.parse(data);
            return new Project().deserialize(obj);
          },
        })
        .then((project : Project) => {
          return $deferred.resolve(project);
        }, () => {
          var target: Project = JSON
            .parse(window.localStorage.getItem('projects'))
            .map((p: any) => {
              new Project().deserialize(p);
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
          return $deferred.reject();
        });

      return $deferred.promise();
    }

    /**
     * クラス情報を取得します。
     *
     * @override
     */
    public static getType(): string {
      return 'Project';
    }
  }
}
