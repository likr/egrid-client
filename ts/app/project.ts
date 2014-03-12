/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ProjectController {
    public project: model.Project = new model.Project();

    constructor(private $window, private $q, private $rootScope, $stateParams, private $state, $scope, private $modal) {
      var key = $stateParams.projectId;

      this.$q.when(this.project.get(key))
        .then((p: model.Project) => {
        }, (reason) => {
          if (reason.status === 401) {
            this.$window.location.href = this.$rootScope.logoutUrl;
          }
        });
    }

    public update() {
      this.$q.when(this.project.save())
        .then((project: model.Project) => {
          // バインドしてるから要らない気はする
          this.project.name = project.name;
          this.project.note = project.note;
        }, (reason) => {
          if (reason.status === 401) {
            this.$window.location.href = this.$rootScope.logoutUrl;
          }
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
      this.$q.when(this.project.remove())
        .then(() => {
          this.$state.go('projects.all.list');
        }, (reason) => {
          if (reason.status === 401) {
            this.$window.location.href = this.$rootScope.logoutUrl;
          }
        });
    }
  }
}
