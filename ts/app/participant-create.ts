/// <reference path="../model/participant.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class ParticipantCreateController implements model.ParticipantData {
    projectKey : string;
    name : string;
    note : string;


    constructor(private $q, $routeParams, private $location) {
      this.projectKey = $routeParams.projectId;
    }

    submit() {
      var participant = new model.Participant(this);
      this.$q.when(participant.save())
        .then(() => {
          this.$location.path(Url.participantUrl(participant));
        })
        ;
    }
  }
}
