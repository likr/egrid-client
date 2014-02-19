/// <reference path="../model/project.ts"/>
/// <reference path="../model/sem-project.ts"/>

module egrid.app {
  export class SemProjectController implements model.SemProjectData {
    name : string;
    project : model.ProjectData;
    projectKey : string;
    semProjectKey : string;

    constructor($q, $stateParams, storage) {
      var stored: string[] = storage
        .get('sem');
      var project: model.SemProject;

      this.projectKey = $stateParams.projectId;
      this.semProjectKey = $stateParams.semProjectId;

      $q.when(model.SemProject.get(this.projectKey, this.semProjectKey))
        .then((p: model.SemProject) => {
          this.name = p.name;
          this.project = p.project;
        }, (reason: any) => {
          if (!stored) throw new Error();

          project = stored
            .map(model.SemProject.parse)
            .filter((value: model.SemProject, index: number, ar: model.SemProject[]) => {
              return value.key() === this.semProjectKey;
            })[0]; // FIXME

          this.name = project.name;
          this.project = project.project;
        });
    }
  }
}
