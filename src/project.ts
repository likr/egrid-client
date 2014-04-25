/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="storage.ts"/>
/// <reference path="entity.ts"/>

module egrid.model {
  var TYPE = 'Project';


  function load(obj : SerializedProjectData, project? : Project) : Project {
    var loaded : any = project === undefined ? new Project(obj) : project;
    loaded.key_ = obj.key;
    loaded.createdAt_ = new Date(obj.createdAt);
    loaded.updatedAt_ = new Date(obj.updatedAt);
    return loaded;
  }


  export interface ProjectData {
    name: string;
    note: string;
  }


  interface SerializedProjectData extends ProjectData, SerializedData {
  }


  /**
  * @class Project
  */
  export class Project extends Entity implements ProjectData {
    public name: string;
    public note: string;

    constructor(obj? : ProjectData) {
      super();

      if (obj) {
        this.name = obj.name;
        this.note = obj.note;
      }
    }

    public static get(key : string) : JQueryPromise<Project> {
      return storage.get<Project>(TYPE, key)
        .then((data : any) => {
          return load(data);
        });
    }

    public static query() : JQueryPromise<Project[]> {
      return storage.retrieve<Project>(TYPE)
        .then(data => {
          var result = {};
          var key
          for (key in data) {
            result[key] = load(data[key]);
          }
          return result;
        });
    }

    /**
     * POST/PUT リクエストを発行します。
     *
     * @throws  Error
     */
    public save(): JQueryPromise<void> {
      return storage.add<Project>(this, TYPE, this.key)
        .done((v : SerializedProjectData) => {
          load(v, this);
        });
    }

    public remove() : JQueryPromise<void> {
      return storage.remove<Project>(TYPE, this.key)
        .then(() => {
          (<any>this).key_ = undefined;
          (<any>this).createdAt_ = undefined;
          (<any>this).updatedAt_ = undefined;
        });
    }
  }
}
