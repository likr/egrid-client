/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ProjectController implements model.ProjectData {
    projectKey : string;
    name : string;
    note : string;

    constructor($q, $routeParams) {
      this.projectKey = $routeParams.projectId;
      $q.when(model.Project.get(this.projectKey))
        .then(project => {
          this.name = project.name;
          this.note = project.note;
        })
        ;
    }
  }
}
