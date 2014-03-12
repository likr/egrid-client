/// <reference path="../model/project-grid.ts"/>

module egrid.app {
  export class ProjectGridListController {
    projectKey : string;
    list: model.ProjectGrid[];

    constructor($window, $q, $rootScope, $stateParams) {
      this.projectKey = $stateParams.projectId;

      $q.when(model.ProjectGrid.query(this.projectKey))
        .then((grids : model.ProjectGrid[]) => {
          this.list = grids;
        }, (...reasons: any[]) => {
          if (reasons[0]['status'] === 401) {
            $window.location.href = $rootScope.logoutUrl;
          }
        })
        ;
    }
  }
}
