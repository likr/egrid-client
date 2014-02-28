/// <reference path="../model/project-grid.ts"/>

module egrid.app {
  export class ProjectGridListController {
    projectKey : string;
    list: model.ProjectGrid[];

    constructor($q, $routeParams) {
      this.projectKey = $routeParams.projectId;

      $q.when(model.ProjectGrid.query(this.projectKey))
        .then((grids : model.ProjectGrid[]) => {
          this.list = grids;
        })
        ;
    }
  }
}
