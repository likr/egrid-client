/// <reference path="../model/participant.ts"/>

module egrid.app {
  export class ParticipantListController {
    public projectId : string;
    public participants: model.Participant[] = [];
    public itemsPerPage = 2;
    public currentPage = 1;
    public predicate = 'created_at';
    public reverse = false;

    constructor($q, $routeParams) {
      this.projectId = $routeParams.projectId;

      $q.when(model.Participant.query(this.projectId))
        .then((participants : model.Participant[]) => {
          this.participants = participants;
        })
        ;
    }
  }
}
