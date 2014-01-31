/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ProjectController implements model.ProjectData {
    projectKey : string;
    name : string;
    note : string;

    constructor(private $q, $routeParams, private $location, private $scope) {
      this.projectKey = $routeParams.projectId;
      this.$q.when(model.Project.get(this.projectKey))
        .then(project => {
          this.name = project.name;
          this.note = project.note;
        })
        ;
    }

    public edit() {
      this.$q.when(model.Project.get(this.projectKey))
        .then((project: model.Project) => {
          project.name = this.name;
          project.note = this.note;

          return project.edit();
        })
        .then((project: model.Project) => {
          // バインドしてるから要らない気はする
          this.name = project.name;
          this.note = project.note;
        });
    }

    public remove() {
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
