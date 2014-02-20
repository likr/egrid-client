/// <reference path="../ts-definitions/DefinitelyTyped/angularLocalStorage/angularLocalStorage.d.ts"/>
/// <reference path="../model/project.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ProjectListController extends PaginationController {
    public projects: model.Project[] = [];

    constructor(private $q, $scope, private $state, private $log) {
      super();

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      this.$q
        .when(model.Project.query())
        .then((projects: model.Project[]) => {
          this.projects = projects;
        });
    }

    sync() {
      this.$q.when(model.Project.flush())
        .then(() => {
          this.$log.debug('sync completed successfully');
          this.$state.go('projects.all.list');
        });
    }
  }
}
