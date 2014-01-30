/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ProjectListController {
    constructor($q, $scope) {
      $scope.projects = [];
      $scope.itemsPerPage = 2;
      $scope.currentPage = 1;
      $scope.predicate = 'created_at';
      $scope.reverse = true;

      $q
        .when(model.Project.query())
        .then((projects : model.Project[]) => {
          $scope.projects = projects;
        });
    }
  }
}
