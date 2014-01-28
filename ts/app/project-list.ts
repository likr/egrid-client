/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ProjectListController {
    constructor($q, $scope) {
      $scope.items = [];

      $q
        .when(model.Project.query())
        .then((items : model.Project[]) => {
          $scope.items = items;
        });
    }
  }
}
