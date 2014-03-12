/// <reference path="../model/project.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class ProjectCreateController implements model.ProjectData {
    name : string;
    note : string;

    constructor(private $q, private $state, private $timeout) {
    }

    submit() {
      var project = new model.Project(this);
      this.$q.when(project.save())
        .then(() => {
          this.$timeout(() => {
            this.$state.go('projects.get.detail', { projectId: project.key }, { reload: true });
          }, 200); // なぜか即時反映されない
        }, () => {
          this.$state.go('projects.all.list');
        })
        ;
    }
  }
}
