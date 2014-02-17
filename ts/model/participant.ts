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
    createdAt: string;
    updatedAt: string;
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

    key() : string {
      return this.key_;
    }

    save() : JQueryXHR {
      return $.ajax({
        url: Participant.url(this.projectKey, this.key()),
        type: this.key() ? 'PUT' : 'POST',
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

    remove() : JQueryXHR {
      return $.ajax({
        url: Participant.url(this.projectKey, this.key()),
        type: 'DELETE',
      });
    }

    public get createdAt() : Date {
      return this.createdAt_;
    }

    public get updatedAt() : Date {
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
      participant.createdAt_ = new Date(obj.createdAt);
      participant.updatedAt_ = new Date(obj.updatedAt);
      return participant;
    }

    private static url(projectKey : string, key? : string) : string {
      if (key) {
        return '/api/projects/' + projectKey + '/participants/' + key;
      } else {
        return '/api/projects/' + projectKey + '/participants';
      }
    }

    static parse(s: string) : Participant {
      var o: any = JSON.parse(s);
      var p: Participant = new Participant(o);

      p.key_ = o.key_;
      p.createdAt_ = o.createdAt_;
      p.updatedAt_ = o.updatedAt_;

      return p;
    }
  }
}
