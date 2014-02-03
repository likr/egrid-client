/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>

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
  export class Project implements ProjectData {
    private key_: string;
    private createdAt_: Date;
    private updatedAt_: Date;
    public name: string;
    public note: string;

    constructor(obj? : ProjectData) {
      if (obj) {
        // for-in と hasOwnProperty を組み合わせて書き換えるかもしれない
        // そのとき値の変換を考えよう
        this.name = obj.name;
        this.note = obj.note;
      }
    }

    key() : string {
      return this.key_;
    }

    save() : JQueryXHR {
      return $.ajax({
        url: Project.url(this.key()),
        type: this.key() ? 'PUT' : 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          key: this.key(),
          name: this.name,
          note: this.note,
        }),
        dataFilter: data => {
          var obj : ApiProjectData = JSON.parse(data);
          this.key_ = obj.key;
          return this;
        },
      });
    }

    remove() : JQueryXHR {
      return $.ajax({
        url: Project.url(this.key()),
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
      return Project.url(this.key());
    }

    private static load(obj : ApiProjectData) : Project {
      var project = new Project(obj);
      project.key_ = obj.key;
      project.createdAt_ = new Date(obj.createdAt);
      project.updatedAt_ = new Date(obj.updatedAt);
      return project;
    }

    static get(key : string) : JQueryXHR {
      return $.ajax({
        url: Project.url(key),
        type: 'GET',
        dataFilter: data => {
          var obj : ApiProjectData = JSON.parse(data);
          return Project.load(obj);
        },
      });
    }

    static query() : JQueryXHR {
      return $.ajax({
        url: Project.url(),
        type: 'GET',
        dataFilter: data => {
          var objs = JSON.parse(data);
          return objs.map((obj : ApiProjectData) => {
            return Project.load(obj);
          });
        },
      });
    }

    private static url(key? : string) : string {
      if (key) {
        return '/api/projects/' + key;
      } else {
        return '/api/projects';
      }
    }
  }
}