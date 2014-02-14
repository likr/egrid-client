/// <reference path="../ts-definitions/DefinitelyTyped/angularLocalStorage/angularLocalStorage.d.ts"/>
/// <reference path="../model/project.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ProjectListController extends PaginationController {
    public projects: model.Project[] = [];

    constructor($q, $scope, storage: angularLocalStorage.IStorageService) {
      super();

      storage.bind($scope, 'projects');

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      $q
        .when(model.Project.query())
        .then((projects: model.Project[]) => {
          storage.set('projects', projects);
        })
        .finally(() => {
          this.projects = storage.get('projects');
        });
    }
  }
}
