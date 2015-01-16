/// <reference path="typings/jquery/jquery.d.ts"/>
/// <reference path="storage/storage.ts"/>

module egrid.model {
export class Questionnaire extends Entity {
  projectKey: string;
  formUrl: string;
  sheetUrl: string;

  save(): JQueryPromise<void> {
    return storage.add<Questionnaire>(this, 'Questionnaire', this.projectKey, this.key);
  }

  static get(projectKey: string, key: string): JQueryPromise<Questionnaire> {
    return storage.get<Questionnaire>('Questionnaire', projectKey, key)
      .then((data: any) => {
        var questionnaire: any = new Questionnaire;
        questionnaire.key_ = data.key;
        questionnaire.projectKey = data.projectKey;
        questionnaire.formUrl = data.formUrl;
        questionnaire.sheetUrl = data.sheetUrl;
        return questionnaire;
      });
  }
}
}
