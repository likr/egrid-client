/// <reference path="../model/collaborator.ts"/>

module egrid.app {
  export class CollaboratorListController {
    projectKey : string;
    list : model.Collaborator[];

    constructor($q, $routeParams) {
      this.projectKey = $routeParams.projectId;
      $q.when(model.Collaborator.query(this.projectKey))
        .then((collaborators : model.Collaborator[]) => {
          this.list = collaborators;
        })
        ;
    }
  }
}
