/// <reference path="../model/collaborator.ts"/>
/// <reference path="url.ts"/>

module egrid.app {
  export class CollaboratorCreateController {
    public projectKey : string;
    public userEmail : string;
    public isManager : string;

    constructor(private $q, $stateParams, private $state, private $timeout) {
      this.projectKey = $stateParams.projectId;
    }

    submit() {
      var c = new model.Collaborator(this);

      this.$q.when(c.save())
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
