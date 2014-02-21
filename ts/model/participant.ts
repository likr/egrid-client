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

    static get(projectKey : string, participantKey : string) : JQueryPromise<Participant> {
      var $deferred = $.Deferred();

      $.ajax({
          url: Participant.url(projectKey, participantKey),
          type: 'GET',
          dataFilter: data => {
            var obj = JSON.parse(data);
            return Participant.load(obj);
          },
        })
        .then((participant: Participant) => {
          return $deferred.resolve(participant);
        }, () => {
          var target: Participant = JSON
            .parse(window.localStorage.getItem('participants'))
            .map(Participant.import)
            .filter((value: Participant) => {
              return value.key() === participantKey;
            });

          return target ? $deferred.resolve(target[0]) : $deferred.reject();
        });

      return $deferred.promise();
    }

    static query(projectKey : string) : JQueryPromise<Participant[]> {
      var $deferred = $.Deferred();

      $.ajax({
          url: Participant.url(projectKey),
          type: 'GET',
          dataFilter: data => {
            var objs = JSON.parse(data);
            return objs.map((obj : ApiParticipantData) => {
              return Participant.load(obj);
            });
          },
        })
        .then((participants: Participant[]) => {
          window.localStorage.setItem('participants', JSON.stringify(participants));

          return $deferred.resolve(participants);
        }, () => {
          return $deferred.resolve(JSON.parse(window.localStorage.getItem('participants')).map(Participant.import));
        });

      return $deferred.promise();
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

    static import(o: any) : Participant {
      var p: Participant = new Participant(o);

      p.key_ = o.key_;
      p.createdAt_ = o.createdAt_;
      p.updatedAt_ = o.updatedAt_;

      return p;
    }

    /**
     * POST/PUT リクエストを発行します。
     *
     * TODO: StorableBase<T> に移動…するかも
     * @throws  Error
     */
    public publish() : JQueryPromise<Participant> {
      var $deferred = $.Deferred();

      return $.ajax({
          url: Participant.url(this.projectKey, this.key()),
          type: this.key() ? 'PUT' : 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            key: this.key(),
            name: this.name,
            note: this.note,
          }),
          dataFilter: data => {
            var obj : ApiParticipantData = JSON.parse(data);
            this.key_ = obj.key;
            return this;
          },
        })
        .then((p: Participant) => {
          return $deferred.resolve(p);
        }, () => {
          return $deferred.reject();
        });

      return $deferred.promise();
    }

    /**
     * localStorage に格納されている各要素に対して publish メソッドを発行します。
     *
     * TODO: Collection<T> に IFlushable を実装…かも
     * @see Participant.publish
     */
    public static flush() : JQueryPromise<Participant[]> {
      var $deferred = $.Deferred();
      var unsavedItems: any[];

      unsavedItems = JSON.parse(window.localStorage.getItem('unsavedParticipants')) || [];

      $.when.apply($, unsavedItems
        .map((o: any) => {
          var p = Participant.import(o);

          return p.publish();
        }))
        .then((...participants: Participant[]) => {
          window.localStorage.removeItem('unsavedParticipants');

          return $deferred.resolve(participants);
        }, () => {
          return $deferred.reject();
        });

      return $deferred.promise();
    }

    /**
     * localStorage と this を保存するラッパーメソッドです。
     * flush メソッドを実行します。
     *
     * TODO: StorableBase<T> に移動…するかも
     * @see Participant.flush
     */
    public save() : JQueryPromise<Participant> {
      var $deferred = $.Deferred();
      var promises: JQueryPromise<Participant[]>;

      var items = JSON.parse(window.localStorage.getItem('unsavedParticipants')) || [];

      items.push(this);

      window.localStorage.setItem('unsavedParticipants', JSON.stringify(items));

      Participant.flush()
        .then(() => {
          return $deferred.resolve();
        }, () => {
          return $deferred.reject();
        });

      return $deferred.promise();
    }
  }
}
