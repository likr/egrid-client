/// <reference path="../model/participant.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ParticipantListController extends PaginationController {
    public projectId : string;
    public participants: model.Participant[] = [];

    constructor($q, $stateParams, storage) {
      super();

      this.projectId = $stateParams.projectId;
      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      $q.when(model.Participant.query(this.projectId))
        .then((participants : model.Participant[]) => {
          storage.set('participants', participants.map(JSON.stringify));
        })
        .finally(() => {
          this.participants = storage.get('participants').map(model.Participant.parse);
        })
        ;
    }
  }
}
