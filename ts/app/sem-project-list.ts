/// <reference path="../model/sem-project.ts"/>

module egrid.app {
  export class SemProjectListController {
    list : model.SemProject[];

    constructor($q, $routeParams) {
      var projectId = $routeParams.projectId;
      $q.when(model.SemProject.query(projectId))
        .then((semProjects : model.SemProject[]) => {
          this.list = semProjects;
        })
    }
  }
}
