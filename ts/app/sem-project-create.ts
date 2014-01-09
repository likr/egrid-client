/// <reference path="../model/sem-project.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class SemProjectCreateController implements model.SemProjectData {
    name : string;
    projectKey : string;

    constructor(private $q, $routeParams, private $location) {
      this.projectKey = $routeParams.projectId;
    }

    submit() {
      var semProject = new model.SemProject(this);
      this.$q.when(semProject.save())
        .then(() => {
          this.$location.path(Url.semProjectUrl(semProject));
        })
        ;
    }
  }
}
