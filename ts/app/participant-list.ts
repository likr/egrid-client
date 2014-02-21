/// <reference path="../model/participant.ts"/>
/// <reference path="pagination.ts"/>

module egrid.app {
  export class ParticipantListController extends PaginationController {
    public projectId : string;
    public participants: model.Participant[] = [];

    constructor(private $q, private $state, $stateParams, private $log) {
      super();

      this.projectId = $stateParams.projectId;
      this.itemsPerPage = 5;
      this.predicate = 'updatedAt';
      this.reverse = true;

      this.$q
        .when(model.Participant.query(this.projectId))
        .then((participants: model.Participant[]) => {
          this.participants = participants;
        });
    }

    sync() {
      this.$q.when(model.Participant.flush())
        .then(() => { return model.Participant.query(this.projectId); })
        .then((participants: model.Participant[]) => {
          this.participants = participants;

          this.$log.debug('sync completed successfully');
          this.$state.go('projects.get.participants.all.list');
        });
    }
  }
}
