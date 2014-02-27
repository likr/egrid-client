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
        .when(this.projects.query(model.Project))
        .then((projects: model.Project[]) => {
          projects.forEach((v) => {
              this.projects.addItem(v);
            });

          if (this.projects.isDirty(model.Project))
            // どうすればいいかわからない
            this.projects
              .flush(model.Project)
              .then((ps) => {
                  ps.forEach((p) => {
                      this.projects.addItem(p);
                    });
                });
        });
    }
  }
}
