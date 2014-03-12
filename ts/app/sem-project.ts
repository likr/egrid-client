/// <reference path="../model/project.ts"/>
/// <reference path="../model/sem-project.ts"/>

module egrid.app {
  export class SemProjectController implements model.SemProjectData {
    name : string;
    project : model.ProjectData;
    projectKey : string;
    semProject : model.SemProject;

    constructor($window, $q, $rootScope, $stateParams) {
      this.semProject = new model.SemProject({ projectKey: $stateParams.projectId });

      $q.when(this.semProject.get($stateParams.semProjectId))
        .then((p: model.SemProject) => {
        }, (reason) => {
          if (reason.status === 401) {
            $window.location.href = $rootScope.logoutUrl;
          }
        });
    }
  }
}
