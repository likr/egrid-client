/// <reference path="../ts-definitions/DefinitelyTyped/angularLocalStorage/angularLocalStorage.d.ts"/>
/// <reference path="../model/project.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ProjectListController extends PaginationController {
    public projects: model.Project[] = [];

    constructor($q, $scope, $window) {
      super();

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      $q
        .when(model.Project.query())
        // rejected の引数が reason じゃないとか、そのうち直す
        .then((projects: model.Project[]) => {
          this.projects = projects;
        }, (projects: model.Project[]) => {
          this.projects = projects;
        });
    }
  }
}
