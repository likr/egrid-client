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
          participants.forEach((v) => {
              this.participants.addItem(v);
            });

          if (this.participants.isDirty())
            // どうすればいいかわからない
            this.participants
              .flush()
              .then((ps) => {
                  ps.forEach((p) => {
                      this.participants.addItem(p);
                    });
                });
        });
    }
  }
}
