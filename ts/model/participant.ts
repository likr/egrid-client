/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="collection-base.ts"/>
/// <reference path="value-object.ts"/>
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


  export class Participant extends Entity {
    private createdAt_: ValueObject<Date>;
    private updatedAt_: ValueObject<Date>;

    public name : string;
    public note : string;
    public project : ProjectData;
    public projectKey : string;

    public static type: string = 'Participant';
    public static url: string = '/api/projects/:projectId/participants/:participantId';

    constructor(obj? : ParticipantData) {
      super();

      if (obj) {
        this.name = obj.name;
        this.note = obj.note;
        this.project = obj.project;
        this.projectKey = obj.projectKey;
      }
    }

    public get createdAt() : Date {
      return this.createdAt_ ? this.createdAt_.value : null;
    }

    public get updatedAt() : Date {
      return this.updatedAt_ ? this.updatedAt_.value : null;
    }

    private setCreatedAt(date: Date) : void {
      if (!this.createdAt_)
        this.createdAt_ = new ValueObject<Date>(date);
    }

    private setUpdatedAt(date: Date) : void {
      if (!this.updatedAt_)
        this.updatedAt_ = new ValueObject<Date>(date);
    }

    /**
     * Object から Participant に変換します。
     *
     * @override
     * @param   object
     */
    public load(o: any): Participant {
      this.key = o.key;

      this.name = o.name;
      this.note = o.note;

      this.project = o.project;

      this.setCreatedAt(o.createdAt);
      this.setUpdatedAt(o.updatedAt);

      return this;
    }

    /**
     * @override
     */
    public get(key: string): JQueryPromise<Participant> {
      return egrid.storage.get<Participant>(Participant.type, this.projectKey, key).then((participant: Participant) => {
          this.load(participant);
        });
    }

    /**
     * POST/PUT リクエストを発行します。
     *
     * @override
     * @throws  Error
     */
    public save(): JQueryPromise<Participant> {
      return egrid.storage.add<Participant>(this, Participant.type, this.projectKey, this.key);
    }

    /**
     * @override
     * @param   key   string  Project Key
     */
    public static listUrl(key? : string) : string {
      return Project.listUrl() + '/' + key + '/participants';
    }

    /**
     * @override
     * @param   key   string  Participant Key
     */
    public url(key? : string) : string {
      return Participant.listUrl(this.projectKey) + '/' + key;
    }

    public remove() : JQueryXHR {
      return $.ajax({
        url: this.url(this.key),
        type: 'DELETE',
      });
    }
  }
}
