/// <reference path="../ts-definitions/Definitelytyped/jquery/jquery.d.ts"/>

module egrid.model {
  export interface QuestionnaireItem {
    title : string;
    description : string;
  }


  export interface SemProjectQuestionnaireData {
    description? : string;
    items? : QuestionnaireItem[];
    projectKey : string;
    semProjectKey : string;
    title? : string;
  }


  export class SemProjectQuestionnaire implements SemProjectQuestionnaireData {
    description : string;
    items : QuestionnaireItem[];
    projectKey : string;
    semProjectKey : string;
    title : string;

    constructor(obj : SemProjectQuestionnaireData) {
      this.description = obj.description;
      this.items = obj.items;
      this.projectKey = obj.projectKey;
      this.semProjectKey = obj.semProjectKey;
      this.title = obj.title;
    }

    save() : JQueryXHR {
      return $.ajax({
        url: this.url(),
        type: 'PUT',
        dataFilter: data => {
          return this;
        },
      });
    }

    private url() : string {
      return SemProjectQuestionnaire.url(this.projectKey, this.semProjectKey);
    }

    static get(projectKey : string, semProjectKey : string) : JQueryXHR {
      return $.ajax({
        url: SemProjectQuestionnaire.url(projectKey, semProjectKey),
        type: 'GET',
        dataFilter: data => {
          var obj : SemProjectQuestionnaireData = JSON.parse(data);
          return new SemProjectQuestionnaire(obj);
        },
      });
    }

    private static url(projectKey : string, semProjectKey : string) : string {
      return '/api/projects/' + projectKey + '/sem-project/' + semProjectKey + '/questionnaire';
    }
  }
}
