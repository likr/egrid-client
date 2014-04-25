/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="storage.ts"/>
/// <reference path="entity.ts"/>

module egrid.model {
  var TYPE = 'Project';


  function load(obj : SerializedProjectData) : Project {
    var project : any = new Project(obj);
    project.key_ = obj.key;
    project.createdAt_ = new Date(obj.createdAt);
    project.updatedAt_ = new Date(obj.updatedAt);
    return project;
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
    public save(): JQueryPromise<Project> {
      return storage.add<Project>(this, TYPE, this.key)
        .done((v : SerializedProjectData) => {
          load(v);
        });
    }

    public remove() : JQueryPromise<boolean> {
      return storage.remove<Project>(TYPE, this.key);
    }
  }
}
