/// <reference path="../model/collection.ts"/>
/// <reference path="../model/project.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ProjectListController extends PaginationController {
    public projects: model.Collection<model.Project> = new model.Collection<model.Project>();

    constructor($q) {
      super();

      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      $q
        .when(this.projects.retrieve(model.Project))
        .then((projects: model.Project[]) => {
          // 保存されていなければ
          if (this.projects.isDirty(model.Project)) {
            // flush
            this.projects.flush(model.Project);
          }

          projects.forEach((p: model.Project) => {
              this.projects.addItem(p);
            });
        });
    }
  }
}
