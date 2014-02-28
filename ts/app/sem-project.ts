/// <reference path="../model/project.ts"/>
/// <reference path="../model/sem-project.ts"/>

module egrid.app {
  export class SemProjectController implements model.SemProjectData {
    name : string;
    project : model.ProjectData;
    projectKey : string;
    semProject : model.SemProject;

    constructor($q, $stateParams, storage) {
      this.semProject = new model.SemProject({ projectKey: $stateParams.projectId });

      $q.when(this.semProject.get($stateParams.semProjectId))
        .then((p: model.SemProject) => {
        }, (jqXHR: JQueryPromise<model.Project>, textStatus: string, errorThrown: string) => {
        });
    }
  }
}
