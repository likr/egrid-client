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

    save() : JQueryXHR {
      return $.ajax({
        url: SemProject.url(this.projectKey),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          name: this.name,
        }),
        dataFilter: data => {
          var obj : ApiSemProjectData = JSON.parse(data);
          this.key_ = obj.key;
          return this;
        }
      });
    }

    key() : string {
      return this.key_;
    }

    static get(projectKey : string, semProjectKey : string) : JQueryXHR {
      return $.ajax({
        url: SemProject.url(projectKey, semProjectKey),
        type: 'GET',
        dataFilter: data => {
          var obj : ApiSemProjectData = JSON.parse(data);
          return SemProject.load(obj);
        },
      });
    }

    static query(projectKey : string) : JQueryXHR {
      return $.ajax({
        url: SemProject.url(projectKey),
        type: 'GET',
        dataFilter: data => {
          var objs = JSON.parse(data);
          return objs.map((obj : ApiSemProjectData) => {
            return SemProject.load(obj);
          });
        },
      });
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

    static parse(s: string) : SemProject {
      var o: any = JSON.parse(s);
      var p: SemProject = new SemProject(o);

      p.key_ = o.key_;

      return p;
    }
  }
}
