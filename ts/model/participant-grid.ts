/// <reference path="../ts-definitions/Definitelytyped/jquery/jquery.d.ts"/>
/// <reference path="participant-grid-node.ts"/>
/// <reference path="participant-grid-link.ts"/>

module egrid.model {
  export interface ParticipantGridData {
    projectKey : string;
    participantKey : string;
    nodes : ParticipantGridNodeData[];
    links : ParticipantGridLinkData[];
  }


  export class ParticipantGrid implements ParticipantGridData {
    projectKey : string;
    participantKey : string;
    nodes : ParticipantGridNodeData[];
    links : ParticipantGridLinkData[];
    static type : string = 'ParticipantGrid';

    constructor(obj : ParticipantGridData) {
      this.projectKey = obj.projectKey;
      this.participantKey = obj.participantKey;
      this.nodes = obj.nodes;
      this.links = obj.links;
    }

    update() : JQueryPromise<ParticipantGrid> {
      var $deferred = $.Deferred();
      var storageKey = CollectionBase.pluralize(ParticipantGrid.type);

      return $.ajax({
          url: this.url(),
          type: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify({
            nodes: this.nodes,
            links: this.links,
          }),
          dataFilter: data => {
            window.localStorage.removeItem('unsavedItems.' + storageKey);

            return this;
          },
        })
        .then((p: ParticipantGrid) => {
            return $deferred.resolve(p);
          }, (...reasons) => {
            // ストレージにぶち込む
            var o = {};
            var b = {};

            b[this.participantKey] = this;
            o[this.projectKey] = b;

            window.localStorage.setItem('unsavedItems.' + storageKey, JSON.stringify(o));

            return $deferred.resolve(new ParticipantGrid(o[this.projectKey][this.participantKey]));
          });

      return $deferred.promise();
    }

    private url() : string {
      return ParticipantGrid.url(this.projectKey, this.participantKey);
    }

    static get(projectKey : string, participantKey : string) : JQueryPromise<ParticipantGrid> {
      var storageKey = CollectionBase.pluralize(ParticipantGrid.type);
      var stored = JSON.parse(window.localStorage.getItem('unsavedItems.' + storageKey));

      // save 呼ぶかい？
      if (stored) {
        new ParticipantGrid(stored[projectKey][participantKey]).update().then(() => { return ParticipantGrid.__get(projectKey, participantKey); });
      }

      return ParticipantGrid.__get(projectKey, participantKey);
    }

    private static __get(projectKey : string, participantKey : string) : JQueryPromise<ParticipantGrid> {
      var $deferred = $.Deferred();
      var storageKey = CollectionBase.pluralize(ParticipantGrid.type);

      return $.ajax({
          url: ParticipantGrid.url(projectKey, participantKey),
          type: 'GET',
          dataFilter: data => {
            var obj = JSON.parse(data);

            return new ParticipantGrid(obj);
          },
        })
        .then((grid : ParticipantGrid) => {
          // 保存する
          var o = {};
          var b = {};

          b[participantKey] = grid;
          o[projectKey] = b;

          window.localStorage.setItem(storageKey, JSON.stringify(o));

          return $deferred.resolve(grid);
        }, () => {
          // 取得して返す
          var o = JSON.parse(window.localStorage.getItem(storageKey)) || {};
          var u = JSON.parse(window.localStorage.getItem('unsavedItems.' + storageKey)) || {};

          o = o[projectKey] || {};
          u = u[projectKey] || {};

          var r = $.extend(o[participantKey], u[participantKey]);

          return $deferred.resolve(new ParticipantGrid(r));
        });

      return $deferred.promise();
    }

    private static url(projectKey : string, participantKey : string) : string {
      return '/api/projects/' + projectKey + '/participants/' + participantKey + '/grid';
    }
  }
}
