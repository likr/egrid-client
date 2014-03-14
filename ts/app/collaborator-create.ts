/// <reference path="../model/collaborator.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class CollaboratorCreateController {
    public projectKey : string;
    public data : model.Collaborator;

    constructor(private $q, private $rootScope, $stateParams, private $state, private $timeout, private $filter, private alertLifeSpan) {
      this.projectKey = $stateParams.projectId;
      this.data = new model.Collaborator({ projectKey: this.projectKey });
    }

    submit() {
      this.$q.when(this.data.save())
        .then(
            () => {
              this.$timeout(() => {
                this.$state.go('projects.get.collaborators.all.list', null, { reload: true });
              }, 200); // なぜか即時反映されない
            },
            (...reasons: any[]) => {
              var k: string = reasons[0].status === 401
                ? 'MESSAGES.NOT_AUTHENTICATED'
                : 'MESSAGES.DESTINATION_IS_NOT_REACHABLE';

              this.$rootScope.alerts.push({ type: 'danger', msg: this.$filter('translate')(k) });

              this.$timeout(() => {
                this.$rootScope.alerts.pop();
              }, this.alertLifeSpan);
            }
        )
        ;
    }
  }
}
