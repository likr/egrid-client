/// <reference path="../model/project.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class ProjectCreateController implements model.ProjectData {
    name : string;
    note : string;

    constructor(private $q, private $rootScope, private $state, private $timeout, private $filter) {
    }

    submit() {
      var project = new model.Project(this);
      this.$q.when(project.save())
        .then(() => {
          this.$timeout(() => {
            this.$state.go('projects.get.detail', { projectId: project.key }, { reload: true });
          }, 200); // なぜか即時反映されない
        }, (...reasons: any[]) => {
          this.$rootScope.alerts.push({ type: 'danger', msg: this.$filter('translate')('PROJECT.MESSAGES.CREATE.FAILED') });

          this.$timeout(() => {
            this.$rootScope.alerts.pop();
          }, 2500);
        })
        ;
    }
  }
}
