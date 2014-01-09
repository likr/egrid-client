/// <reference path="../model/participant.ts"/>

module egrid.app {
  export class ParticipantListController {
    projectId : string;
    list : model.Participant[];

    constructor($q, $routeParams) {
      this.projectId = $routeParams.projectId;
      $q.when(model.Participant.query(this.projectId))
        .then((participants : model.Participant[]) => {
          this.list = participants;
        })
        ;
    }
  }
}
