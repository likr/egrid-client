/// <reference path="../model/project.ts"/>
/// <reference path="../model/sem-project.ts"/>

module egrid.app {
  export class SemProjectController implements model.SemProjectData {
    name : string;
    project : model.ProjectData;
    projectKey : string;
    semProjectKey : string;

    constructor($q, $stateParams, storage) {
      this.projectKey = $stateParams.projectId;
      this.semProjectKey = $stateParams.semProjectId;

      $q.when(model.SemProject.get(this.projectKey, this.semProjectKey))
        .then((p: model.SemProject) => {
          this.name = p.name;
          this.project = p.project;
        });
    }
  }
}
