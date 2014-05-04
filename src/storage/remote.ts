/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="entity.ts"/>

module egrid.model.storage {
export var API_URL_BASE = '';


module Uri {
export function Analysis(projectKey: string, analysisKey?: string): string {
  var url = API_URL_BASE + '/api/projects/' + projectKey + '/analyses';
  if (analysisKey !== undefined) {
    url += '/' + analysisKey;
  }
  return url;
}


export function Collaborator(projectKey: string, collaboratorKey?: string): string {
  var url = API_URL_BASE + '/api/projects/' + projectKey + '/collaborators';
  if (collaboratorKey !== undefined) {
    url += '/' + collaboratorKey;
  }
  return url;
}


export function Participant(projectKey: string, participantKey?: string): string {
  var url = API_URL_BASE + '/api/projects/' + projectKey + '/participants';
  if (participantKey !== undefined) {
    url += '/' + participantKey;
  }
  return url;
}


export function ParticipantGrid(projectKey: string, participantKey: string): string {
  return API_URL_BASE + '/api/projects/' + projectKey + '/participants/' + participantKey + '/grid';
}


export function Project(projectKey?: string): string {
  var url = API_URL_BASE + '/api/projects';
  if (projectKey !== undefined) {
    url += '/' + projectKey;
  }
  return url;
}


export function ProjectGrid(projectKey: string, analysisKey: string): string {
  return '/api/projects/' + projectKey + '/analyses/' + analysisKey + '/grid';
}


export function Questionnaire(projectKey: string, analysisKey: string): string {
  return '/api/projects/' + projectKey + '/analyses/' + analysisKey + '/questionnaire';
}


export function Sem(projectKey: string, analysisKey: string): string {
  return '/api/projects/' + projectKey + '/analyses/' + analysisKey + '/sem';
}
}

// API 通信をなんとかしてくれるはず
export module Api {
export function get<T>(name: string, projectKey: string, key?: string): JQueryPromise<T> {
  return $.ajax({
    url: (<any>Uri)[name](projectKey, key),
    type: 'GET',
    contentType: 'application/json',
  })
  .then((r: string) => {
    return JSON.parse(r);
  });
}


export function post<T>(data: T, name: string, projectKey?: string): JQueryPromise<T> {
  return $.ajax({
      url: (<any>Uri)[name](projectKey),
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
    })
    .then((r: string) => {
        return JSON.parse(r);
      });
}


export function put<T>(data: T, name: string, projectKey: string, key?: string): JQueryPromise<T> {
  return $.ajax({
    url: (<any>Uri)[name](projectKey, key),
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(data),
  })
  .then((r: string) => {
    return JSON.parse(r);
  });
}


export function remove(name: string, projectKey: string, key?: string): JQueryPromise<void> {
  return $.ajax({
    url: (<any>Uri)[name](projectKey, key),
    type: 'DELETE',
  })
  .then((response) => response, (...reasons) => reasons[0]);
}


export function retrieve<T extends StorableData>(name: string, projectKey?: string): JQueryPromise<T[]> {
  return $.ajax({
    url: (<any>Uri)[name](projectKey),
    type: 'GET',
    contentType: 'application/json',
  })
  .then((r: string) => {
    return JSON.parse(r);
  })
  .then((values: T[]) => {
    var o: any = {};

    for (var i = 0, l = values.length; i < l; i++) {
      o[values[i].key] = values[i];
    }

    return o;
  });
}
}
}
