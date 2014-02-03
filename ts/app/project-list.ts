/// <reference path="../model/project.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ProjectListController extends PaginationController {
    public projects: model.Project[] = [];

    constructor($q) {
      super();

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      $q
        .when(model.Project.query())
        .then((projects : model.Project[]) => {
          this.projects = projects;
        });
    }
  }
}
