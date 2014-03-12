/// <reference path="../model/collaborator.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class CollaboratorCreateController {
    public projectKey : string;
    public data : model.Collaborator;

    constructor($window, private $q, $stateParams, private $state, private $timeout) {
      this.projectKey = $stateParams.projectId;
      this.data = new model.Collaborator({ projectKey: this.projectKey });
    }

    submit() {
      this.$q.when(this.data.save())
        .then(
            (() => {
              this.$timeout(() => {
                this.$state.go('projects.get.collaborators.all.list', null, { reload: true });
              }, 200); // なぜか即時反映されない
            }),
            (() => {
              console.log('error');
            })
        )
        ;
    }
  }
}
