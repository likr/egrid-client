/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="project.ts"/>

module egrid.model {
  export interface ParticipantData {
    name? : string;
    note? : string;
    project? : ProjectData;
    projectKey : string;
  }


  interface ApiParticipantData extends ParticipantData {
    key : string;
    created_at: string;
    updated_at: string;
  }


  export class Participant implements ParticipantData {
    private key_ : string;
    private createdAt_: Date;
    private updatedAt_: Date;
    public name : string;
    public note : string;
    public project : ProjectData;
    public projectKey : string;

    constructor(obj : ParticipantData) {
      this.name = obj.name;
      this.note = obj.note;
      this.project = obj.project;
      this.projectKey = obj.projectKey;
    }

    save() : JQueryXHR {
      return $.ajax({
        url: Participant.url(this.projectKey),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          name: this.name,
          note: this.note,
        }),
        dataFilter: data => {
          var obj : ApiParticipantData = JSON.parse(data);
          this.key_ = obj.key;
          return this;
        }
      });
    }

    key() : string {
      return this.key_;
    }

    public createdAt() : Date {
      return this.createdAt_;
    }

    public updatedAt() : Date {
      return this.updatedAt_;
    }

    static get(projectKey : string, participantKey : string) : JQueryXHR {
      return $.ajax({
        url: Participant.url(projectKey, participantKey),
        type: 'GET',
        dataFilter: data => {
          var obj = JSON.parse(data);
          return Participant.load(obj);
        },
      });
    }

    static query(projectKey : string) : JQueryXHR {
      return $.ajax({
        url: Participant.url(projectKey),
        type: 'GET',
        dataFilter: data => {
          var objs = JSON.parse(data);
          return objs.map((obj : ApiParticipantData) => {
            return Participant.load(obj);
          });
        },
      });
    }

    private static load(obj : ApiParticipantData) : Participant {
      var participant = new Participant(obj);
      participant.key_ = obj.key;
      participant.createdAt_ = new Date(obj.created_at);
      participant.updatedAt_ = new Date(obj.updated_at);
      return participant;
    }

    private static url(projectKey : string, key? : string) : string {
      if (key) {
        return '/api/projects/' + projectKey + '/participants/' + key;
      } else {
        return '/api/projects/' + projectKey + '/participants';
      }
    }
  }
}
