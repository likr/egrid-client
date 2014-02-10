/// <reference path="../model/sem-project.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class SemProjectCreateController implements model.SemProjectData {
    name : string;
    projectKey : string;

    constructor(private $q, $stateParams, private $state, private $timeout) {
      this.projectKey = $stateParams.projectId;
    }

    submit() {
      var semProject = new model.SemProject(this);
      this.$q.when(semProject.save())
        .then(() => {
          this.$timeout(() => {
            this.$state.go('projects.get.analyses.all.list');
          }, 200);
        })
        ;
    }
  }
}
