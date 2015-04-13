/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="project.ts"/>


module egrid.model {
  function load(obj : SerializedSemProjectData) : SemProject {
    var semProject : any = new SemProject(obj);
    semProject.key_ = obj.key;
    semProject.createdAt_ = new Date(obj.createdAt);
    semProject.updatedAt_ = new Date(obj.updatedAt);
    return semProject;
  }


  export interface SemProjectData {
    name? : string;
    project? : ProjectData;
    projectKey : string;
  }


  interface SerializedSemProjectData extends SemProjectData, SerializedData {
  }


  export class SemProject extends Entity {
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

    /**
     */
    public get(key: string): JQueryPromise<SemProject> {
      return storage.get<SemProject>(SemProject.type, this.projectKey, key)
        .then((data : any) => {
          return load(data);
        });
    }

    public static query(projectKey : string) : JQueryPromise<SemProject[]> {
      return storage.retrieve<SemProject>(SemProject.type, projectKey);
    }

    public save(): JQueryPromise<SemProject> {
      return $.ajax({
          url: this.key ? this.url(this.key) : SemProject.listUrl(this.projectKey),
          type: this.key ? 'PUT' : 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            key: this.key,
            name: this.name,
          }),
          dataFilter: data => {
            var obj : SerializedSemProjectData = JSON.parse(data);
            return load(obj);
          },
      });
    }

    /**
     * @param   key   string  Project Key
     */
    public static listUrl(key? : string) : string {
      return '/api/projects/' + key + '/sem-projects';
    }

    /**
     * @param   key   string  SemProject Key
     */
    public url(key? : string) : string {
      return SemProject.listUrl(this.projectKey) + '/' + key;
    }
  }
}
