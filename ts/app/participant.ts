/// <reference path="../model/participant.ts"/>
/// <reference path="../model/project.ts"/>

module egrid.app {
  export class ParticipantController implements model.ParticipantData {
    name : string;
    note : string;
    participantKey : string;
    project : model.ProjectData;
    projectKey : string;

    constructor(private $q, $routeParams) {
      this.participantKey = $routeParams.participantId;
      this.projectKey = $routeParams.projectId;
      this.$q.when(model.Participant.get(this.projectKey, this.participantKey))
        .then((participant : model.Participant) => {
          this.name = participant.name;
          this.note = participant.note;
          this.project = participant.project;
        })
        ;
    }

    public update() {
      this.$q.when(model.Participant.get(this.projectKey, this.participantKey))
        .then((participant: model.Participant) => {
          participant.name = this.name;
          participant.note = this.note;

          return participant.save();
        })
        .then((participant: model.Participant) => {
          this.name = participant.name;
          this.note = participant.note;
        });
    }
  }
}
