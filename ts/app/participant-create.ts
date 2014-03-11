/// <reference path="../model/participant.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class ParticipantCreateController implements model.ParticipantData {
    projectKey : string;
    name : string;
    note : string;


    constructor(private $q, $stateParams, private $state) {
      this.projectKey = $stateParams.projectId;
    }

    submit() {
      var participant = new model.Participant(this);
      this.$q.when(participant.save())
        .then((p: model.Participant) => {
          this.$state.go('projects.get.participants.get.detail', { projectId: this.projectKey, participantId: p.key });
        }, () => {
          this.$state.go('projects.get.participants.all.list');
        })
        ;
    }
  }
}
