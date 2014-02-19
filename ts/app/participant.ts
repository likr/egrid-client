/// <reference path="../model/participant.ts"/>
/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ParticipantController implements model.ParticipantData {
    name : string;
    note : string;
    participantKey : string;
    project : model.ProjectData;
    projectKey : string;

    constructor(private $q, $stateParams, private $scope, private $location, private $modal, storage: angularLocalStorage.IStorageService) {
      var stored: string[] = storage
        .get('participants');
      var participant: model.Participant;

      this.participantKey = $stateParams.participantId;
      this.projectKey = $stateParams.projectId;

      this.$q.when(model.Participant.get(this.projectKey, this.participantKey))
        .then((p: model.Participant) => {
          this.name = p.name;
          this.note = p.note;
          this.project = p.project;
        }, (reason: any) => {
          if (!stored) throw new Error();

          participant = stored
            .map(model.Participant.parse)
            .filter((value: model.Participant, index: number, ar: model.Participant[]) => {
              return value.key() === this.participantKey;
            })[0]; // FIXME

          this.name = participant.name;
          this.note = participant.note;
          this.project = participant.project;
        });
    }

    public update() {
      this.$q.when(model.Participant.get(this.projectKey, this.participantKey))
        .then((participant: model.Participant) => {
          participant.name = this.name;
          participant.note = this.note;

          return participant.save();
        })
        .then((participant: model.Participant) => {
          this.name = participant.name;
          this.note = participant.note;
        });
    }

    public confirm() {
      var modalInstance = this.$modal.open({
        templateUrl: '/partials/remove-item-dialog.html',
        controller: ($scope, $modalInstance) => {
          $scope.ok = () => {
            $modalInstance.close();
          },
          $scope.cancel = () => {
            $modalInstance.dismiss();
          }
        }
      });

      modalInstance.result.then(() => { this.remove(); });
    }

    private remove() {
      this.$q.when(model.Participant.get(this.projectKey, this.participantKey))
        .then((participant: model.Participant) => {
          return participant.remove();
        })
        .then(() => {
          this.$location.path(egrid.app.Url.projectUrl(this.projectKey));
          this.$scope.$apply();
        });
    }
  }
}
