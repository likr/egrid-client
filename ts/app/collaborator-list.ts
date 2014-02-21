/// <reference path="../model/collaborator.ts"/>

module egrid.app {
  export class CollaboratorListController {
    projectId : string;
    list : model.Collaborator[];

    constructor(private $q, $stateParams, private $state, private $log, private $scope, private $modal) {
      this.projectId = $stateParams.projectId;
      this.$q.when(model.Collaborator.query(this.projectId))
        .then((collaborators : model.Collaborator[]) => {
          this.list = collaborators;
        });
    }

    sync() {
      this.$q.when(model.Collaborator.flush())
        .then(() => { return model.Collaborator.query(this.projectId); })
        .then((collaborators: model.Collaborator[]) => {
          this.list = collaborators;

          this.$log.debug('sync completed successfully');
          this.$state.go('projects.get.collaborators.all.list');
        });
    }

    public confirm(index) {
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

      modalInstance.result.then(() => { this.remove(index); });
    }

    private remove(index) {
      this.$q.when(this.list[index].remove())
        .then(() => {
          this.list.splice(index, 1);
        });
    }
  }
}
