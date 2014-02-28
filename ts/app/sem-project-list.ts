/// <reference path="../model/sem-project.ts"/>
/// <reference path="../model/sem-project-collection.ts"/>

module egrid.app {
  export class SemProjectListController {
    public projectId : string;
    public semProjects = new model.SemProjectCollection();

    constructor(private $q, $stateParams, private $state, private $log) {
      this.projectId = $stateParams.projectId;

      this.$q.when(this.semProjects.query(this.projectId))
        .then((semProjects : model.SemProject[]) => {
          semProjects.forEach((v) => {
              this.semProjects.addItem(v);
            });

          if (this.semProjects.isDirty())
            // どうすればいいかわからない
            this.semProjects
              .flush()
              .then((ps) => {
                  ps.forEach((p) => {
                      this.semProjects.addItem(p);
                    });
                });
        });
    }
  }
}
