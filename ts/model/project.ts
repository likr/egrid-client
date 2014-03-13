/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../utils/storage.ts"/>
/// <reference path="collection-base.ts"/>
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
  export class Project extends Entity {
    private createdAt_: ValueObject<Date>;
    private updatedAt_: ValueObject<Date>;

    public name: string;
    public note: string;

    public static type: string = 'Project';

    constructor(obj? : ProjectData) {
      super();

      if (obj) {
        this.name = obj.name;
        this.note = obj.note;
      }
    }

    public get createdAt() : Date {
      return this.createdAt_ ? this.createdAt_.value : null;
    }

    public get updatedAt() : Date {
      return this.updatedAt_ ? this.updatedAt_.value : null;
    }

    // Accessors は同じ Accessibility を持っていなければいけないのでメソッドを用意する
    private setCreatedAt(date: Date) : void {
      if (!this.createdAt_)
        this.createdAt_ = new ValueObject<Date>(date);
    }

    private setUpdatedAt(date: Date) : void {
      if (!this.updatedAt_)
        this.updatedAt_ = new ValueObject<Date>(date);
    }

    /**
     * Object から Project に変換します。
     *
     * @override
     * @param   object
     */
    public load(o: any): Project {
      this.key = o.key;

      this.name = o.name;
      this.note = o.note;

      this.setCreatedAt(o.createdAt);
      this.setUpdatedAt(o.updatedAt);

      return this;
    }

    /**
     * @override
     */
    public get(key: string): JQueryPromise<Project> {
      return egrid.storage.get<Project>(Project.type, key).then((project: Project) => {
          this.load(project);
        });
    }

    /**
     * POST/PUT リクエストを発行します。
     *
     * @override
     * @throws  Error
     */
    public save(): JQueryPromise<Project> {
      return egrid.storage.add<Project>(this, Project.type, this.key)
        .done((v: Project) => {
            this.load(v);
          });
    }

    /**
     * @override
     */
    public static listUrl() : string {
      return '/api/projects';
    }

    /**
     * @override
     */
    public url(key? : string) : string {
      return Project.listUrl() + '/' + key;
    }

    public remove() : JQueryPromise<boolean> {
      return egrid.storage.remove<Project>(Project.type, this.key);
    }
  }
}
