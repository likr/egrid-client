/// <reference path="../model/project.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class ProjectCreateController implements model.ProjectData {
    name : string;
    note : string;

    constructor(private $q, private $rootScope, private $state, private $timeout, private $filter, private alertLifeSpan) {
    }

    submit() {
      var project = new model.Project(this);
      this.$q.when(project.save())
        .then(() => {
          this.$timeout(() => {
            this.$state.go('projects.get.detail', { projectId: project.key }, { reload: true });
          }, 200); // なぜか即時反映されない
        }, (...reasons: any[]) => {
          var k: string = reasons[0].status === 401
            ? 'MESSAGES.NOT_AUTHENTICATED'
            : 'MESSAGES.DESTINATION_IS_NOT_REACHABLE';

          this.$rootScope.alerts.push({ type: 'danger', msg: this.$filter('translate')(k) });

          this.$timeout(() => {
            this.$rootScope.alerts.pop();
          }, this.alertLifeSpan);
        })
        ;
    }
  }
}
