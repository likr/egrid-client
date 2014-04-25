/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="storage.ts"/>
/// <reference path="collection-base.ts"/>
/// <reference path="entity.ts"/>
/// <reference path="value-object.ts"/>

module egrid.model {
  var TYPE = 'Project';

  export interface ProjectData {
    name: string;
    note: string;
  }


  interface SerializedProjectData extends ProjectData, interfaces.IEntity {
    createdAt: string;
    updatedAt: string;
  }


  /**
  * @class Project
  */
  export class Project implements ProjectData, interfaces.IEntity {
    private key_ : string;
    private createdAt_ : Date;
    private updatedAt_ : Date;

    public name: string;
    public note: string;

    constructor(obj? : ProjectData) {
      if (obj) {
        this.name = obj.name;
        this.note = obj.note;
      }
    }

    public get key() : string {
      return this.key_;
    }

    public get createdAt() : Date {
      return this.createdAt_;
    }

    public get updatedAt() : Date {
      return this.updatedAt_;
    }

    private load(o : SerializedProjectData) : Project {
      this.key_ = o.key;
      this.name = o.name;
      this.note = o.note;
      this.createdAt_ = new Date(o.createdAt);
      this.updatedAt_ = new Date(o.updatedAt);

      return this;
    }

    private static load(o : any) : Project {
      return new Project().load(o);
    }

    public static get(key : string) : JQueryPromise<Project> {
      return egrid.storage.get<Project>(TYPE, key)
        .then((data : any) => {
          return Project.load(data);
        });
    }

    public static query() : JQueryPromise<Project[]> {
      return egrid.storage.retrieve<Project>(TYPE)
        .then(data => {
          var result = {};
          var key
          for (key in data) {
            result[key] = Project.load(data[key]);
          }
          return result;
        });
    }

    /**
     * POST/PUT リクエストを発行します。
     *
     * @override
     * @throws  Error
     */
    public save(): JQueryPromise<Project> {
      return egrid.storage.add<Project>(this, TYPE, this.key)
        .done((v : SerializedProjectData) => {
          this.load(v);
        });
    }

    public remove() : JQueryPromise<boolean> {
      return egrid.storage.remove<Project>(TYPE, this.key);
    }
  }
}
