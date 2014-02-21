/// <reference path="../model/sem-project.ts"/>

module egrid.app {
  export class SemProjectListController {
    list : model.SemProject[];
    projectId : string;

    constructor(private $q, $stateParams, private $state, private $log) {
      this.projectId = $stateParams.projectId;

      this.$q.when(model.SemProject.query(this.projectId))
        .then((semProjects : model.SemProject[]) => {
          this.list = semProjects;
        });
    }

    sync() {
      this.$q.when(model.SemProject.flush())
        .then(() => { return model.SemProject.query(this.projectId); })
        .then((semProjects: model.SemProject[]) => {
          this.list = semProjects;

          this.$log.debug('sync completed successfully');
          this.$state.go('projects.get.analyses.all.list');
        });
    }
  }
}
