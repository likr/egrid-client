/// <reference path="../model/project-grid.ts"/>

module egrid.app {
  export class ProjectGridListController {
    projectKey : string;
    list: model.ProjectGrid[];

    constructor($window, $q, $stateParams) {
      this.projectKey = $stateParams.projectId;

      $q.when(model.ProjectGrid.query(this.projectKey))
        .then((grids : model.ProjectGrid[]) => {
          this.list = grids;
        })
        ;
    }
  }
}
