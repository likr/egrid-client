/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ProjectController implements model.ProjectData {
    projectKey : string;
    name : string;
    note : string;

    constructor(private $q, $stateParams, private $location, private $scope, private $modal, storage: angularLocalStorage.IStorageService) {
      // TODO: 非同期にする
      var stored: string[] = storage
        .get('projects');
      var project: model.Project;

      this.projectKey = $stateParams.projectId;

      this.$q.when(model.Project.get(this.projectKey))
        .then((p: model.Project) => {
          this.name = p.name;
          this.note = p.note;
        });
    }

    public update() {
      this.$q.when(model.Project.get(this.projectKey))
        .then((project: model.Project) => {
          project.name = this.name;
          project.note = this.note;

          return project.save();
        })
        .then((project: model.Project) => {
          // バインドしてるから要らない気はする
          this.name = project.name;
          this.note = project.note;
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
      this.$q.when(model.Project.get(this.projectKey))
        .then((project: model.Project) => {
          return project.remove();
        })
        .then(() => {
          this.$location.path(egrid.app.Url.projectListUrl());
          this.$scope.$apply();
        });
    }
  }
}
