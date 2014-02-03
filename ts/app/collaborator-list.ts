/// <reference path="../model/collaborator.ts"/>

module egrid.app {
  export class CollaboratorListController {
    projectKey : string;
    list : model.Collaborator[];

    constructor(private $q, $routeParams, private $scope, private $modal) {
      this.projectKey = $routeParams.projectId;
      this.$q.when(model.Collaborator.query(this.projectKey))
        .then((collaborators : model.Collaborator[]) => {
          this.list = collaborators;
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
