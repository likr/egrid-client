/// <reference path="../model/project.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class ProjectCreateController implements model.ProjectData {
    name : string;
    note : string;

    constructor(private $q, private $state) {
    }

    submit() {
      var project = new model.Project(this);
      this.$q.when(project.save())
        .then(() => {
          this.$state.go('projects.get.detail', { projectId: project.key() });
        })
        ;
    }
  }
}
