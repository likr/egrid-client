/// <reference path="../model/participant.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class ParticipantCreateController implements model.ParticipantData {
    projectKey : string;
    name : string;
    note : string;


    constructor(private $q, private $rootScope, $stateParams, private $state, private $timeout, private $filter, private alertLifeSpan) {
      this.projectKey = $stateParams.projectId;
    }

    submit() {
      var participant = new model.Participant(this);
      this.$q.when(participant.save())
        .then((p: model.Participant) => {
          this.$state.go('projects.get.participants.get.detail', { projectId: this.projectKey, participantId: p.key });
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
