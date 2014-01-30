/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ProjectListController {
    constructor($q, $scope) {
      $scope.projects = [];
      $scope.itemsPerPage = 2;
      $scope.currentPage = 1;
      $scope.predicate = 'created_at';
      $scope.reverse = false;
      $scope.subjects = ['name', 'created_at', 'updated_at'];

      $q
        .when(model.Project.query())
        .then((projects : model.Project[]) => {
          $scope.projects = projects;
        });
    }
  }
}
