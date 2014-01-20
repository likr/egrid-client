/// <reference path="../model/collaborator.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class CollaboratorCreateController {
    public projectKey : string;
    public data : model.Collaborator;

    constructor(private $q, $routeParams, private $location) {
      this.projectKey = $routeParams.projectId;
      this.data = new model.Collaborator({
        projectKey: this.projectKey,
      });
    }

    submit() {
      this.$q.when(this.data.save())
        .then(
            (() => {
              this.$location.path(Url.projectUrl(this.projectKey));
            }),
            (() => {
              console.log('error');
            })
        )
        ;
    }
  }
}
