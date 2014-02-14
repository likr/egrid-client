/// <reference path="../model/collaborator.ts"/>

module egrid.app {
  export class CollaboratorListController {
    projectKey : string;
    list : model.Collaborator[];

    constructor(private $q, $stateParams, private $scope, private $modal, storage) {
      this.projectKey = $stateParams.projectId;
      this.$q.when(model.Collaborator.query(this.projectKey))
        .then((collaborators : model.Collaborator[]) => {
          storage.set('collaborators', collaborators);
        })
        .finally(() => {
          this.list = storage.get('collaborators');
        })
        ;
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
