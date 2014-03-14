/// <reference path="../model/sem-project.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class SemProjectCreateController implements model.SemProjectData {
    name : string;
    projectKey : string;

    constructor(private $q, private $rootScope, $stateParams, private $state, private $timeout, private $filter, private alertLifeSpan) {
      this.projectKey = $stateParams.projectId;
    }

    submit() {
      var semProject = new model.SemProject(this);
      this.$q.when(semProject.save())
        .then(() => {
          this.$timeout(() => {
            this.$state.go('projects.get.analyses.all.list');
          }, 200);
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
