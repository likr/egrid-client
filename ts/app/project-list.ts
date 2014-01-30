/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ProjectListController {
    constructor($q, $scope) {
      $scope.projects = [];
      $scope.itemsPerPage = 2;
      $scope.currentPage = 1;

      $q
        .when(model.Project.query())
        .then((projects : model.Project[]) => {
          $scope.projects = projects;
          $scope.size = projects.length;
        });
    }
  }
}
