/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="entity.ts"/>
/// <reference path="remote.ts"/>

module egrid.model.storage {
var KEY: string = 'lindo_de_remedio';
var OUT_OF_SERVICE: string = 'unsavedItems';
var STORE: any = JSON.parse(localStorage.getItem(KEY)) || {};
flush();


function flush<T extends StorableData>(): JQueryPromise<void> {
  var $deferred = $.Deferred();
  var $promises = [];
  var n = OUT_OF_SERVICE;

  if (STORE[n]) {
    for (var type in STORE[n]) {
      if (STORE[n].hasOwnProperty(type)) {
        var v = STORE[n][type];
        var w;

        for (var unsaved in v) {
          if (v.hasOwnProperty(unsaved)) {
            w = v[unsaved];

            if (w.key && w.createdAt) {
              $promises.push(Api.put<T>(w, type, w.key));
            } else {
              if (w.projectKey) {
                $promises.push(Api.post<T>(w, type, w.projectKey));
              } else {
                $promises.push(Api.post<T>(w, type));
              }
            }
          }
        }
      }
    }
  }

  $.when.apply($, $promises)
    .then((v) => {
        if (Array.isArray(v) && !v.length) {
          $deferred.reject(false);
        } else {
          delete STORE[OUT_OF_SERVICE];

          $deferred.resolve(true);
        }
      }, () => {
        $deferred.reject(false);
      });

  return <any>$deferred.promise();
}


export function add<T extends StorableData>(value: T, name: string, projectId?: string, participantId?: string): JQueryPromise<void> {
  var $deferred = $.Deferred();
  var $promise;
  var alreadyStored = !!value.key;

  if (alreadyStored) {
    $promise = Api.put<T>(value, name, projectId, participantId);
  } else {
    if (projectId) {
      $promise = Api.post<T>(value, name, projectId);
    } else {
      $promise = Api.post<T>(value, name);
    }
  }

  $promise
    .then((v: T) => {
        var r: any;

        if (!STORE[name]) {
          STORE[name] = {};
        }

        r = Miscellaneousness.merge(STORE[name][v.key], v);

        if (participantId) {
          STORE[name][projectId][v.key] = r;
        } else {
          STORE[name][v.key] = r;
        }

        localStorage.setItem(KEY, JSON.stringify(STORE));

        $deferred.resolve(v);
      }, (...reasons: any[]) => {
        var k: string;

        if (reasons[2] === 'Not authorized') {
          $deferred.reject(reasons[0]);
        }

        STORE = JSON.parse(localStorage.getItem(KEY)) || {}; // FIXME

        k = (value.key) ? value.key : OUT_OF_SERVICE + Object.keys(STORE[name]).length.valueOf();

        if (!STORE[OUT_OF_SERVICE]) {
          STORE[OUT_OF_SERVICE] = Miscellaneousness.construct(name);
        }

        if (!value.key) {
          value.key = k;
        }

        STORE[OUT_OF_SERVICE][name][k] = value;

        localStorage.setItem(KEY, JSON.stringify(STORE));

        if (projectId && /^unsavedItems[0-9]+$/.test(projectId)) {
          STORE[name][k] = value;
        } else if (participantId) {
          STORE[name][projectId][k] = value;
        } else {
          STORE[name][k] = value;
        }

        $deferred.reject(reasons[0]);
      });

  return <any>$deferred.promise();
}


export function get<T extends StorableData>(name: string, projectId: string, participantId?: string): JQueryPromise<T> {
  var $deferred = $.Deferred();
  var $promise = Api.get<T>(name, projectId, participantId);

  STORE = JSON.parse(localStorage.getItem(KEY)) || {}; // FIXME

  $promise
    .then((value: T) => {
        if (!STORE[name]) {
          STORE[name] = {};
        }

        if (participantId) {
          STORE[name][projectId] = Miscellaneousness.construct(participantId);

          STORE[name][projectId][participantId] = value;
        } else {
          STORE[name][projectId] = value;
        }

        localStorage.setItem(KEY, JSON.stringify(STORE));

        $deferred.resolve(participantId ? STORE[name][projectId][participantId] : STORE[name][projectId]);
      }, (...reasons: any[]) => {
        var r = {};

        // 500 のときも
        if (/^[4-5][0-9]{2}$/.test(reasons[0]['status'])) {
          $deferred.reject(reasons[0]);
        }

        // 1. ストレージからデータを取り出す
        if (!STORE[name]) {
          $deferred.reject(new Error('Storage is empty'));
        }

        if (STORE[OUT_OF_SERVICE]) {
          r = STORE[OUT_OF_SERVICE][name];
        }

        if (STORE[name]) {
          if (participantId) {
            r = Miscellaneousness.merge(STORE[name][projectId][participantId], r);
          } else {
            r = Miscellaneousness.merge(STORE[name][projectId], r);
          }
        }

        $deferred.resolve(r);
      });

  return $deferred.promise();
}


export function remove<T extends StorableData>(name: string, projectId: string, participantId?: string): JQueryPromise<void> {
  // TODO: localStorage から削除する
  return Api.remove(name, projectId, participantId);
}

export function retrieve<T extends StorableData>(name: string, projectId?: string): JQueryPromise<any> {
  var $deferred = $.Deferred();
  var $promise = Api.retrieve<T>(name, projectId);

  $promise
    .then((values: T[]) => {
        if (!STORE[name]) {
          STORE[name] = {};
        }

        if (projectId) {
          STORE[name][projectId] = values;
        } else {
          STORE[name] = values;
        }

        localStorage.setItem(KEY, JSON.stringify(STORE));

        $deferred.resolve(projectId ? STORE[name][projectId] : STORE[name]);
      }, (...reasons: any[]) => {
        var r = {};

        if (/^[4-5][0-9]{2}$/.test(reasons[0]['status'])) {
          $deferred.reject(reasons[0]);
        }

        if (!STORE[name]) {
          $deferred.reject(new Error('Storeage is empty'));
        }

        if (STORE[OUT_OF_SERVICE]) {
          r = STORE[OUT_OF_SERVICE][name];
        }

        if (STORE[name]) {
          if (projectId) {
            r = Miscellaneousness.merge(STORE[name][projectId], r);
          } else {
            r = Miscellaneousness.merge(STORE[name], r);
          }
        }

        $deferred.resolve(r);
      });

  return $deferred.promise();
}

module Miscellaneousness {
/**
 * オブジェクトの第一層をコピーしかえします。
 * o と b が同じプロパティを持っている場合、b を優先します。
 *
 * 非破壊的操作
 *
 * @param o any
 * @param b any
 */
export function merge(o: any = {}, b: any = {}): any {
  var j: any = o;

  for (var i = 0, t = Object.keys(b), l = t.length; i < l; i++) {
    j[t[i]] = b[t[i]];
  }

  return j;
}


export function construct(...properties: string[]): any {
  return properties.reduceRight((p: any, c: string) => {
      var o: any = {};

      o[c] = p;

      return o;
    }, {});
}
}
}
