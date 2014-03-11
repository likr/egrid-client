/// <reference path="../model/collaborator.ts"/>
/// <reference path="../model/collaborator-collection.ts"/>

module egrid.app {
  export class CollaboratorListController {
    public projectId : string;
    public collaborators = new model.CollaboratorCollection();

    constructor(private $q, $stateParams, private $state, private $log, private $scope, private $modal) {
      this.projectId = $stateParams.projectId;

      $q
        .when(this.collaborators.query(this.projectId))
        .then((collaborators: model.Collaborator[]) => {
          Object.keys(collaborators).forEach((v, i, ar) => {
              this.collaborators.addItem(collaborators[v]);
            });
        });
    }

    public confirm(key: string) {
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

      modalInstance.result.then(() => { this.remove(key); });
    }

    private remove(key) {
      this.$q.when(this.collaborators.getItem(key).remove())
        .then(() => {
          this.collaborators.removeItem(key);
        });
    }
  }
}
