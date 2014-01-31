/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ProjectController implements model.ProjectData {
    projectKey : string;
    name : string;
    note : string;
    created_at : number;
    updated_at : number;

    constructor($q, $routeParams) {
      this.projectKey = $routeParams.projectId;
      $q.when(model.Project.get(this.projectKey))
        .then(project => {
          this.name = project.name;
          this.note = project.note;
          this.created_at = project.created_at;
          this.updated_at = project.updated_at;
        })
        ;
    }
  }
}
