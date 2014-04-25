/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="project.ts"/>

module egrid.model {
  var TYPE = 'Participant';


  function load(obj : SerializedParticipantData) : Participant {
    var participant : any = new Participant(obj);
    participant.key_ = obj.key;
    participant.createdAt_ = new Date(obj.createdAt);
    participant.updatedAt_ = new Date(obj.updatedAt);
    return participant;
  }


  export interface ParticipantData {
    name? : string;
    note? : string;
    project? : ProjectData;
    projectKey : string;
  }


  interface SerializedParticipantData extends ParticipantData {
    key : string;
    createdAt: string;
    updatedAt: string;
  }


  export class Participant extends Entity {
    public name : string;
    public note : string;
    public project : ProjectData;
    public projectKey : string;

    constructor(obj? : ParticipantData) {
      super();

      if (obj) {
        this.name = obj.name;
        this.note = obj.note;
        this.project = obj.project;
        this.projectKey = obj.projectKey;
      }
    }

    public get(key : string) : JQueryPromise<Participant> {
      return storage.get<Participant>(TYPE, this.projectKey, key)
        .then((data : SerializedParticipantData) => {
          return load(data);
        });
    }

    public static query(projectKey : string) : JQueryPromise<Participant[]> {
      return storage.retrieve<Participant>(TYPE, projectKey);
    }

    public save(): JQueryPromise<void> {
      return storage.add<Participant>(this, TYPE, this.projectKey, this.key);
    }

    public remove() : JQueryPromise<boolean> {
      return storage.remove<Participant>(TYPE, this.projectKey, this.key);
    }
  }
}
