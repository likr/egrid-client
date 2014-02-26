/// <reference path="../model/collection.ts"/>
/// <reference path="../model/project.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ProjectListController extends PaginationController {
    public projects: model.Collection<model.Project> = new model.Collection<model.Project>();

    constructor(private $q, private $state, private $log) {
      super();

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      this.$q
        .when(this.projects.retrieve(model.Project))
        .then((projects: model.Project[]) => {
          projects.forEach((p: model.Project) => {
            this.projects.setItem(p);
          });
        });
    }

    sync() {
      this.$q.when(this.projects.flush(model.Project))
        .then(() => {
          this.$log.debug('sync completed successfully');
          this.$state.go('projects.all.list');
        });
    }
  }
}
