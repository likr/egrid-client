/// <reference path="../model/participant.ts"/>
/// <reference path="../model/participant-collection.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ParticipantListController extends PaginationController {
    public projectId : string;
    public participants = new model.ParticipantCollection();

    constructor($q, $stateParams) {
      super();

      this.projectId = $stateParams.projectId;
      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      $q
        .when(this.participants.query(this.projectId))
        .then((participants: model.Participant[]) => {
          Object.keys(participants).forEach((v, i, ar) => {
              this.participants.addItem(participants[v]);
            });
        });
    }
  }
}
