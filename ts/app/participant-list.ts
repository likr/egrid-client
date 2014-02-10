/// <reference path="../model/participant.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ParticipantListController extends PaginationController {
    public projectId : string;
    public participants: model.Participant[] = [];

    constructor($q, $stateParams) {
      super();

      this.projectId = $stateParams.projectId;
      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      $q.when(model.Participant.query(this.projectId))
        .then((participants : model.Participant[]) => {
          this.participants = participants;
        })
        ;
    }
  }
}
