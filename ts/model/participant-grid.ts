/// <reference path="../ts-definitions/DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../utils/storage.ts"/>
/// <reference path="interfaces/ientity.ts"/>
/// <reference path="collection-base.ts"/>
/// <reference path="participant-grid-node.ts"/>
/// <reference path="participant-grid-link.ts"/>

module egrid.model {
  export interface ParticipantGridData {
    projectKey : string;
    participantKey : string;
    nodes : ParticipantGridNodeData[];
    links : ParticipantGridLinkData[];
  }


  export class ParticipantGrid implements ParticipantGridData, interfaces.IEntity {
    key : string;
    participantKey : string;
    projectKey : string;
    nodes : ParticipantGridNodeData[];
    links : ParticipantGridLinkData[];
    static type : string = 'ParticipantGrid';

    constructor(obj : ParticipantGridData) {
      this.projectKey = obj.projectKey;
      this.participantKey = this.key = obj.participantKey;
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
            return this;
          },
        })
        .then((p: ParticipantGrid) => {
            return $deferred.resolve(p);
          }, (...reasons) => {
            // ストレージにぶち込む
            var o = {};
            var b = {};

            b[this.key] = this;
            o[this.projectKey] = b;

            window.localStorage.setItem('unsavedItems.' + storageKey, JSON.stringify(o));

            return $deferred.resolve(new ParticipantGrid(o[this.projectKey][this.key]));
          });

      return $deferred.promise();
    }

    private url() : string {
      return ParticipantGrid.url(this.projectKey, this.key);
    }

    static get(projectKey : string, participantKey : string) : JQueryPromise<ParticipantGrid> {
      return egrid.storage.get<ParticipantGrid>(ParticipantGrid.type, projectKey, participantKey)
        .then((pg: ParticipantGrid) => {
            return new ParticipantGrid(pg);
          });
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
