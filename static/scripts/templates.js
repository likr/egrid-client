angular.module('collaboegm').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/partials/about.html',
    "<div egm-application-view>\n" +
    "  <h2>About</h2>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/egm-edit.html',
    "<div>\n" +
    "  <div class=\"navbar navbar-default navbar-fixed-top\" style=\"top: 50px;\">\n" +
    "    <div class=\"container\">\n" +
    "      <form class=\"navbar-form\">\n" +
    "        <a class=\"btn btn-default\" id=\"appendNodeButton\"><i class=\"icon-pencil\"></i>{{'ACTION.APPEND' | translate}}</a>\n" +
    "        <a class=\"btn btn-default\" id=\"undoButton\"><i class=\"icon-arrow-left\"></i>{{'ACTION.UNDO' | translate}}</a>\n" +
    "        <a class=\"btn btn-default\" id=\"redoButton\"><i class=\"icon-arrow-right\"></i>{{'ACTION.REDO' | translate}}</a>\n" +
    "        <a class=\"btn btn-default pull-right\" id=\"saveButton\"><i class=\"icon-share\"></i>{{'ACTION.SAVE' | translate}}</a>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div style=\"position: absolute; left: 0; top: 100px; overflow: hidden;\">\n" +
    "    <svg id=\"display\" style=\"display: block;\"></svg>\n" +
    "    <div id=\"nodeController\" class=\"btn-group invisible\" style=\"position: absolute; top: 0; left: 0;\">\n" +
    "      <button id=\"ladderUpButton\" class=\"btn\" title=\"{{'EGM.LADDER_UP' | translate}}\"><span class=\"glyphicon glyphicon-arrow-left\"></span></button>\n" +
    "      <button id=\"removeNodeButton\" class=\"btn\" title=\"{{'ACTION.REMOVE' | translate}}\"><span class=\"glyphicon glyphicon-remove\"></span></button>\n" +
    "      <button id=\"mergeNodeButton\" class=\"btn\" title=\"{{'ACTION.MERGE' | translate}}\"><span class=\"glyphicon glyphicon-plus\"></span></button>\n" +
    "      <button id=\"editNodeButton\" class=\"btn\" title=\"{{'ACTION.EDIT' | translate}}\"><span class=\"glyphicon glyphicon-pencil\"></span></button>\n" +
    "      <button id=\"ladderDownButton\" class=\"btn\" title=\"{{'EGM.LADDER_DOWN' | translate}}\"><span class=\"glyphicon glyphicon-arrow-right\"></span></button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/egm-show-all.html',
    "<div>\n" +
    "  <div class=\"navbar navbar-default navbar-fixed-top\" style=\"top: 50px;\">\n" +
    "    <div class=\"container\">\n" +
    "      <form class=\"navbar-form navbar-left\">\n" +
    "        <a class=\"btn btn-default\" id=\"quitButton\" href=\"/#{{Url.projectUrl(projectGrid.projectKey)}}\">{{'ACTION.QUIT' | translate}}</a>\n" +
    "      </form>\n" +
    "      <form class=\"navbar-form navbar-right\">\n" +
    "        <a class=\"btn btn-default\" id=\"filterButton\">{{'ACTION.FILTER' | translate}}</a>\n" +
    "        <a class=\"btn btn-default\" id=\"layoutButton\">{{'EGM.APP.LAYOUT_SETTINGS' | translate}}</a>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div id=\"svgContainer\" style=\"position: absolute; left: 0; top: 100px; overflow: hidden;\">\n" +
    "    <svg id=\"display\" style=\"display: block;\"></svg>\n" +
    "    <div id=\"nodeController\" class=\"btn-group invisible\" style=\"position: absolute; top: 0; left: 0;\">\n" +
    "      <button id=\"removeNodeButton\" class=\"btn\" title=\"{{'ACTION.REMOVE' | translate}}\"><i class=\"glyphicon glyphicon-remove\"></i></button>\n" +
    "      <button id=\"mergeNodeButton\" class=\"btn\" title=\"{{'ACTION.MERGE' | translate}}\"><i class=\"glyphicon glyphicon-plus\"></i></button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"navbar navbar-default navbar-fixed-bottom\">\n" +
    "    <div class=\"container\">\n" +
    "      <form class=\"navbar-form navbar-left\">\n" +
    "        <a class=\"btn btn-default\" id=\"undoButton\"><i class=\"glyphicon glyphicon-arrow-left\"></i>{{'ACTION.UNDO' | translate}}</a>\n" +
    "        <a class=\"btn btn-default\" id=\"redoButton\"><i class=\"glyphicon glyphicon-arrow-right\"></i>{{'ACTION.REDO' | translate}}</a>\n" +
    "      </form>\n" +
    "      <form class=\"navbar-form navbar-right\">\n" +
    "        <a ng-click=\"projectGrid.exportJSON($event)\" class=\"btn btn-default\" id=\"exportJSON\" target=\"_blank\"><i class=\"glyphicon glyphicon-floppy-save\"></i>JSON {{'ACTION.EXPORT' | translate}}</a>\n" +
    "        <a class=\"btn btn-default\" id=\"exportSVG\" target=\"_blank\"><i class=\"glyphicon glyphicon-floppy-save\"></i>SVG {{'ACTION.EXPORT' | translate}}</a>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/filter-participants-dialog.html',
    "<div class=\"modal-header\">\n" +
    "  <h3>{{'PARTICIPANT.FILTER' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <table class=\"table table-hover\">\n" +
    "    <tr ng-class={\"info\":active[participant.key()]} ng-repeat=\"participant in participants\">\n" +
    "      <td>\n" +
    "        <label class=\"checkbox\">\n" +
    "          <input type=\"checkbox\" ng-model=\"results[participant.key()]\"/>{{participant.name}}\n" +
    "        </label>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn\" ng-click=\"close()\">{{ 'ACTION.CLOSE' | translate }}</button>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/help.html',
    "<div egm-application-view>\n" +
    "  <h2>Help</h2>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/input-text-dialog.html',
    "<div class=\"modal-header\">\n" +
    "  <h3>{{'EGM.APP.INPUT_EVALUATION_FACTOR' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"close(result)\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"result\" focus-me/>\n" +
    "      </div>\n" +
    "      <div class=\"col-sm-2\">\n" +
    "        <input type=\"submit\" class=\"btn btn-primary\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "  <table class=\"table table-hover\">\n" +
    "    <tr ng-repeat=\"text in texts | filter:result\" ng-dblclick=\"close(text.text)\">\n" +
    "      <td>{{text.text}}</td>\n" +
    "      <td>{{text.weight}}</td>\n" +
    "      <td><button class=\"btn\" ng-click=\"close(text.text)\">{{'ACTION.SELECT' | translate}}</button></td>\n" +
    "    </li>\n" +
    "  </table>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-primary\" ng-click=\"close()\">{{ 'ACTION.CLOSE' | translate }}</button>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/project/analyses/analyses.html',
    "<h3>{{ 'SEM.SEM' | translate }}</h3>\n" +
    "\n" +
    "<ul class=\"nav nav-tabs\">\n" +
    "  <li ui-sref-active=\"active\">\n" +
    "    <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.analyses.all.list\">{{'ACTION.LIST' | translate}}</a>\n" +
    "  </li>\n" +
    "  <li ui-sref-active=\"active\">\n" +
    "    <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.analyses.all.create\">{{'ACTION.NEW' | translate}}</a>\n" +
    "  </li>\n" +
    "</ul>\n" +
    "\n" +
    "<div class=\"tab-content\" ui-view=\"content\" />\n"
  );


  $templateCache.put('/partials/project/analyses/analysis/analyses.html',
    "<div tab heading=\"{{'SEM.ANALYSIS' | translate}}\" select=\"drawSemAnalysis()\">\n" +
    "  <div ng-controller=\"SemProjectAnalysisController as analysis\">\n" +
    "    <div id=\"sem-analysis-display\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"span10\">\n" +
    "          <svg width=\"100%\" height=\"500px\"></svg>\n" +
    "        </div>\n" +
    "        <div class=\"span2\">\n" +
    "          <table class=\"table\">\n" +
    "            <tr ng-repeat=\"item in items\">\n" +
    "              <td>\n" +
    "                <label class=\"checkbox\">\n" +
    "                  <input type=\"checkbox\" ng-model=\"item.active\" ng-change=\"removeNode()\"/>{{ item.text }}\n" +
    "                </label>\n" +
    "            </tr>\n" +
    "          </table>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/project/analyses/analysis/analysis.html',
    "<div>\n" +
    "  <h2>{{ semProject.name }}</h2>\n" +
    "\n" +
    "  <ol class=\"breadcrumb\">\n" +
    "    <li>\n" +
    "      <a ui-sref=\"projects.all.list\">{{ 'PROJECT.PROJECTS' | translate }}</a>\n" +
    "    </li>\n" +
    "    <li>\n" +
    "      <a ui-sref=\"projects.get.detail\">{{semProject.project.name}}</a>\n" +
    "    </li>\n" +
    "    <li class=\"active\">\n" +
    "      {{ semProject.name }}\n" +
    "    </li>\n" +
    "  </ol>\n" +
    "\n" +
    "  <ul class=\"nav nav-tabs\">\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.analyses.get.design\">{{ 'SEM.QUESTIONNAIRE.DESIGN' | translate }}</a>\n" +
    "    </li>\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.analyses.get.questionnaire\">{{'SEM.QUESTIONNAIRE.QUESTIONNAIRE' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.analyses.get.analysis\">{{'SEM.ANALYSIS' | translate}}</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"tab-content\" ui-view=\"content\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/project/analyses/analysis/design.html',
    "<div class=\"tab-pane active\">\n" +
    "  <h2>アンケート設定</h2>\n" +
    "  <form class=\"form-horizontal\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">アンケート題名</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"アンケート題名\" ng-model=\"questionnaire.data.title\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">アンケート説明</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <textarea class=\"form-control\" placeholder=\"アンケート説明\" ng-model=\"questionnaire.data.description\"></textarea>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "\n" +
    "  <h3>質問項目設定</h3>\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"span8\">\n" +
    "      <div id=\"sem-questionnaire-design-display\">\n" +
    "        <svg width=\"100%\" height=\"500px\"></svg>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"span4\" style=\"height: 500px; overflow: scroll;\">\n" +
    "      <table class=\"table\">\n" +
    "        <tr ng-repeat=\"item in questionnaire.items\">\n" +
    "          <td>\n" +
    "            <label class=\"checkbox\">\n" +
    "              <input type=\"checkbox\" ng-model=\"item.checked\" ng-change=\"questionnaire.updateItems()\"/>{{item.text}}\n" +
    "            </label>\n" +
    "          </td>\n" +
    "          <td>{{item.weight}}</td>\n" +
    "        </tr>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div>\n" +
    "    <div ng-repeat=\"item in questionnaire.data.items\">\n" +
    "      <form class=\"form-horizontal\">\n" +
    "        <fieldset>\n" +
    "          <legend>{{item.text}}</legend>\n" +
    "          <div class=\"control-group\">\n" +
    "            <label class=\"control-label\">質問項目</label>\n" +
    "            <div class=\"controls\">\n" +
    "              <input class=\"span6\" type=\"text\" ng-model=\"item.title\"/>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"control-group\">\n" +
    "            <label class=\"control-label\">質問文</label>\n" +
    "            <div class=\"controls\">\n" +
    "              <textarea class=\"span6\" rows=\"3\" ng-model=\"item.description\"></textarea>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </fieldset>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div>\n" +
    "    <a class=\"btn btn-primary btn-large\">{{'ACTION.SAVE' | translate}}</a>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/project/analyses/analysis/questionnaire.html',
    ""
  );


  $templateCache.put('/partials/project/analyses/create.html',
    "<div class=\"tab-pane active\" ng-controller=\"SemProjectCreateController as newSemProject\">\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"newSemProject.submit()\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"name\">{{ 'SEM_PROJECT.ATTRIBUTES.NAME' | translate }}</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{ 'SEM_PROJECT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate }}\" ng-model=\"newSemProject.name\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-offset-2 col-sm-10\">\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{ 'ACTION.SUBMIT' | translate }}\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/project/analyses/list.html',
    "<div class=\"tab-pane active\" ng-controller=\"SemProjectListController as semProjects\">\n" +
    "  <div class=\"row\">\n" +
    "    <nav>\n" +
    "      <form class=\"form-inline col-sm-1 col-sm-offset-11\" ng-submit=\"semProjects.sync()\">\n" +
    "        <div class=\"input-group\">\n" +
    "          <button class=\"btn btn-default\" type=\"submit\">Sync</button>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </nav>\n" +
    "  </div>\n" +
    "  <table class=\"table\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th>#</th>\n" +
    "        <th>{{ 'SEM_PROJECT.ATTRIBUTES.NAME' | translate }}</th>\n" +
    "        <th>{{ 'ACTION.ACTION' | translate }}</th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"semProject in semProjects.list\">\n" +
    "        <td>{{ $index + 1 }}</td>\n" +
    "        <td>{{ semProject.name }}</td>\n" +
    "        <td><a href=\"/#{{Url.semProjectUrl(semProject, 'design')}}\">{{ 'ACTION.SHOW' | translate }}</a>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/project/collaborators/collaborators.html',
    "<ul class=\"nav nav-tabs\">\n" +
    "  <li ui-sref-active=\"active\">\n" +
    "    <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.collaborators.all.list\">{{ 'ACTION.LIST' | translate }}</a>\n" +
    "  </li>\n" +
    "  <li ui-sref-active=\"active\">\n" +
    "    <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.collaborators.all.create\">{{ 'ACTION.NEW' | translate }}</a>\n" +
    "  </li>\n" +
    "</ul>\n" +
    "\n" +
    "<div class=\"tab-content\" ui-view=\"c\"></div>\n"
  );


  $templateCache.put('/partials/project/collaborators/create.html',
    "<div class=\"tab-pane active\">\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"newCollaborator.submit()\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"name\">{{'COLLABORATOR.ATTRIBUTES.USER' | translate}}</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input class=\"col-sm-10 form-control\" type=\"text\" name=\"name\" placeholder=\"{{'COLLABORATOR.ATTRIBUTES.PLACEHOLDERS.USER' | translate }}\" ng-model=\"newCollaborator.data.userEmail\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"note\">{{'COLLABORATOR.ROLE.ROLE' | translate}}</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <div class=\"checkbox\">\n" +
    "          <label>\n" +
    "            <input type=\"checkbox\" ng-model=\"newCollaborator.data.isManager\"/>{{'COLLABORATOR.ROLE.MANAGER' | translate}}\n" +
    "          </label>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-offset-2 col-sm-10\">\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{ 'ACTION.SUBMIT' | translate }}\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/project/collaborators/list.html',
    "<div class=\"tab-pane active\">\n" +
    "  <div class=\"row\">\n" +
    "    <nav>\n" +
    "      <form class=\"form-inline col-sm-1 col-sm-offset-11\" ng-submit=\"collaborators.sync()\">\n" +
    "        <div class=\"input-group\">\n" +
    "          <button class=\"btn btn-default\" type=\"submit\">Sync</button>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </nav>\n" +
    "  </div>\n" +
    "  <table class=\"table\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th>#</th>\n" +
    "        <th>{{'COLLABORATOR.ATTRIBUTES.USER' | translate}}</th>\n" +
    "        <th>{{'COLLABORATOR.ROLE.ROLE' | translate}}</th>\n" +
    "        <th>{{'ACTION.ACTION' | translate}}</th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"collaborator in collaborators.list\">\n" +
    "        <td>{{ $index + 1 }}</td>\n" +
    "        <td>{{collaborator.user.nickname}}</td>\n" +
    "        <td>{{collaborator.isManager}}</td>\n" +
    "        <td><a href ng-click=\"collaborators.confirm($index)\">{{'ACTION.REMOVE' | translate}}</td>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/project/detail.html',
    "<form class=\"form-horizontal\" ng-submit=\"ctrl.update()\">\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"control-label col-sm-2\" for=\"name\">{{'PROJECT.ATTRIBUTES.NAME' | translate}}</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{'PROJECT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate}}\" ng-model=\"ctrl.project.name\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"control-label col-sm-2\" for=\"note\">{{'PROJECT.ATTRIBUTES.NOTE' | translate}}</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <textarea class=\"form-control\" name=\"note\" rows=\"3\" placeholder=\"{{'PROJECT.ATTRIBUTES.PLACEHOLDERS.NOTE' | translate}}\" ng-model=\"ctrl.project.note\"></textarea>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"form-group\">\n" +
    "    <div class=\"col-sm-offset-2 col-sm-1\">\n" +
    "      <input type=\"submit\" class=\"btn btn-default\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</form>\n" +
    "<form class=\"form-horizontal\" ng-submit=\"ctrl.confirm()\">\n" +
    "  <div class=\"form-group\">\n" +
    "    <div class=\"col-sm-offset-11 col-sm-1\">\n" +
    "      <input type=\"submit\" class=\"btn btn-danger\" value=\"{{'ACTION.REMOVE' | translate}}\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</form>\n"
  );


  $templateCache.put('/partials/project/evaluation.html',
    "<h3>{{ 'EGM.OVERALL_EVALUATION_STRUCTURE' | translate }}</h3>\n" +
    "<div class=\"navbar navbar-default\">\n" +
    "  <div class=\"navbar-collapse\">\n" +
    "    <form class=\"navbar-form\">\n" +
    "      <a href=\"/#{{Url.projectGridUrl(project.projectKey)}}\" class=\"btn btn-primary\">{{'ACTION.SHOW' | translate}}</a>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/project/participants/create.html',
    "<div class=\"tab-pane active\">\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"newParticipant.submit()\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label col-sm-2\" for=\"name\">{{'PARTICIPANT.ATTRIBUTES.NAME' | translate}}</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{'PARTICIPANT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate}}\" ng-model=\"newParticipant.name\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"control-label col-sm-2\" for=\"note\">{{'PARTICIPANT.ATTRIBUTES.NOTE' | translate}}</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <textarea class=\"form-control\" name=\"note\" rows=\"3\" placeholder=\"{{ 'PARTICIPANT.ATTRIBUTES.PLACEHOLDERS.NOTE' | translate }}\" ng-model=\"newParticipant.note\"></textarea>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-offset-2 col-sm-10\">\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/project/participants/list.html',
    "<div class=\"tab-pane active\">\n" +
    "  <div class=\"row\">\n" +
    "    <nav>\n" +
    "      <form class=\"form-inline col-sm-1 col-sm-offset-7\" ng-submit=\"ctrl.sync()\">\n" +
    "        <div class=\"input-group\">\n" +
    "          <button class=\"btn btn-default\" type=\"submit\">Sync</button>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "      <form class=\"form-inline col-sm-4 search-control\">\n" +
    "        <div class=\"input-group\">\n" +
    "          <input type=\"text\" class=\"form-control\" placeholder=\"{{'ACTION.SEARCH' | translate}}\" ng-model=\"ctrl.query.name\" />\n" +
    "          <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-search\"></span></span>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </nav>\n" +
    "  </div>\n" +
    "  <table class=\"table table-bordered\">\n" +
    "    <thead>\n" +
    "      <tr>\n" +
    "        <th class=\"col-sm-1\">#</th>\n" +
    "        <th class=\"col-sm-3\">\n" +
    "          <a href ng-click=\"ctrl.changeOrder('name')\">{{'PARTICIPANT.ATTRIBUTES.NAME' | translate}}</a>\n" +
    "        </th>\n" +
    "        <th class=\"col-sm-3\">\n" +
    "          <a href ng-click=\"ctrl.changeOrder('createdAt')\">{{'PARTICIPANT.ATTRIBUTES.CREATED_AT' | translate}}</a>\n" +
    "        </th>\n" +
    "        <th class=\"col-sm-3\">\n" +
    "          <a href ng-click=\"ctrl.changeOrder('updatedAt')\">{{'PARTICIPANT.ATTRIBUTES.UPDATED_AT' | translate}}</a>\n" +
    "        </th>\n" +
    "        <th class=\"col-sm-2\">{{'ACTION.ACTION' | translate}}</th>\n" +
    "      </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "      <tr ng-repeat=\"participant in ctrl.participants.toArray() | filter:ctrl.query | orderBy:ctrl.predicate:ctrl.reverse | pager:ctrl.currentPage:ctrl.itemsPerPage\">\n" +
    "        <td>{{$index + 1 + ctrl.itemsPerPage * (ctrl.currentPage - 1)}}</td>\n" +
    "        <td>{{participant.name}}</td>\n" +
    "        <td>{{participant.createdAt | date:'yyyy/MM/dd HH:mm'}}</td>\n" +
    "        <td>{{participant.updatedAt | date:'yyyy/MM/dd HH:mm'}}</td>\n" +
    "        <td><a ui-sref=\"projects.get.participants.get.detail({ participantId: participant.key })\">{{'ACTION.SHOW' | translate}}</a>\n" +
    "      </tr>\n" +
    "    </tbody>\n" +
    "  </table>\n" +
    "  <pagination total-items=\"ctrl.participants.toArray() | filter:ctrl.query | count\" page=\"ctrl.currentPage\" items-per-page=\"ctrl.itemsPerPage\"></pagination>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/project/participants/participant/detail.html',
    "<form class=\"form-horizontal\" ng-submit=\"participant.update()\">\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"control-label col-sm-2\" for=\"name\">{{ 'PARTICIPANT.ATTRIBUTES.NAME' | translate }}</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{ 'PARTICIPANT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate }}\" ng-model=\"participant.name\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"form-group\">\n" +
    "    <label class=\"control-label col-sm-2\" for=\"note\">{{ 'PARTICIPANT.ATTRIBUTES.NOTE' | translate }}</label>\n" +
    "    <div class=\"col-sm-10\">\n" +
    "      <textarea class=\"form-control\" name=\"note\" rows=\"3\" placeholder=\"{{ 'PARTICIPANT.ATTRIBUTES.PLACEHOLDERS.NOTE' | translate }}\" ng-model=\"participant.note\"></textarea>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"form-group\">\n" +
    "    <div class=\"col-sm-offset-2 col-sm-1\">\n" +
    "      <input type=\"submit\" class=\"btn btn-default\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</form>\n" +
    "<form class=\"form-horizontal\" ng-submit=\"participant.confirm()\">\n" +
    "  <div class=\"form-group\">\n" +
    "    <div class=\"col-sm-offset-11 col-sm-1\">\n" +
    "      <input type=\"submit\" class=\"btn btn-danger\" value=\"{{'ACTION.REMOVE' | translate}}\"/>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</form>\n"
  );


  $templateCache.put('/partials/project/participants/participant/evaluation.html',
    "<div ng-controller=\"ParticipantGridController as participantGrid\">\n" +
    "  <h3>評価構造図</h3>\n" +
    "  <div class=\"navbar navbar-default\">\n" +
    "    <div class=\"navbar-collapse\">\n" +
    "      <form class=\"navbar-form\">\n" +
    "        <a href=\"/#{{Url.participantGridUrl(participant.projectKey, participant.participantKey)}}\" class=\"btn btn-primary\">{{'ACTION.EDIT' | translate}}</a>\n" +
    "        <a href=\"/#{{Url.participantGridUrl(participant.projectKey, participant.participantKey)}}?disableCompletion=1\" class=\"btn btn-default\">{{'ACTION.EDIT' | translate}}(テキスト補完なし)</a>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"thumbnail\" style=\"height: 500px;\">\n" +
    "    <svg id=\"display\" width=\"100%\" height=\"100%\"></svg>\n" +
    "  </div>\n" +
    "  <h3>サマリー</h3>\n" +
    "  <table class=\"table table-bordered\">\n" +
    "    <tr>\n" +
    "      <th class=\"span6\">評価項目数</th>\n" +
    "      <td class=\"span6\">{{participantGrid.egm.nodes().length}}</td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "      <th>接続数</th>\n" +
    "      <td>{{participantGrid.egm.links().length}}</td>\n" +
    "    </tr>\n" +
    "  </table>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/project/participants/participant/participant.html',
    "<div class=\"tab-pane active\">\n" +
    "  <h2>{{participant.name}}</h2>\n" +
    "\n" +
    "  <ol class=\"breadcrumb\">\n" +
    "    <li>\n" +
    "      <a ui-sref=\"projects.all.list\">{{'PROJECT.PROJECTS' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li>\n" +
    "      <a href=\"/#{{Url.projectUrl(participant.project.key, 'detail')}}\">{{participant.project.name}}</a>\n" +
    "    </li>\n" +
    "    <li class=\"active\">\n" +
    "      {{participant.name}}\n" +
    "    </li>\n" +
    "  </ol>\n" +
    "\n" +
    "  <ul class=\"nav nav-tabs\">\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.participants.get.detail\">{{'ACTION.DETAIL' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.participants.get.evaluation\">{{'EGM.EVALUATION_STRUCTURE' | translate}}</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"tab-content\" ui-view=\"content\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/project/participants/participants.html',
    "<ul class=\"nav nav-tabs\">\n" +
    "  <li ui-sref-active=\"active\"><a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.participants.all.list\">{{'ACTION.LIST' | translate}}</a></li>\n" +
    "  <li ui-sref-active=\"active\"><a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.participants.all.create\">{{'ACTION.NEW' | translate}}</a></li>\n" +
    "</ul>\n" +
    "\n" +
    "<div class=\"tab-content\" ui-view=\"content\"></div>\n"
  );


  $templateCache.put('/partials/project/project.html',
    "<div class=\"tab-pane active\">\n" +
    "  <h2>{{ctrl.project.name}}</h2>\n" +
    "\n" +
    "  <ol class=\"breadcrumb\">\n" +
    "    <li><a href ui-sref=\"projects.all.list\">{{'PROJECT.PROJECTS' | translate}}</a></li>\n" +
    "    <li class=\"active\">{{ctrl.project.name}}</li>\n" +
    "  </ol>\n" +
    "\n" +
    "  <ul class=\"nav nav-tabs\">\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.detail\">{{'ACTION.DETAIL' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li ng-class=\"{active: {{'projects.get.participants'|includedByState}}}\">\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.participants.all.list\">{{'PARTICIPANT.PARTICIPANTS' | translate }}</a>\n" +
    "    </li>\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.evaluation\">{{'EGM.EVALUATION_STRUCTURE' | translate }}</a>\n" +
    "    </li>\n" +
    "    <li ng-class=\"{active: {{'projects.get.analyses'|includedByState}}}\">\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.analyses.all.list\">{{'EGM.ANALYSIS' | translate }}</a>\n" +
    "    </li>\n" +
    "    <li ng-class=\"{active: {{'projects.get.collaborators'|includedByState}}}\">\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.collaborators.all.list\">{{'COLLABORATOR.COLLABORATOR' | translate }}</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"tab-content\" ui-view=\"content\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/create.html',
    "<div>\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"newProject.submit()\">\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"name\">{{'PROJECT.ATTRIBUTES.NAME' | translate}}</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{'PROJECT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate}}\" ng-model=\"newProject.name\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"note\">{{'PROJECT.ATTRIBUTES.NOTE' | translate}}</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <textarea class=\"form-control\" name=\"note\" rows=\"3\" placeholder=\"{{'PROJECT.ATTRIBUTES.PLACEHOLDERS.NOTE' | translate}}\" ng-model=\"newProject.note\"></textarea>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"col-sm-offset-2 col-sm-10\">\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/list.html',
    "<div class=\"row\">\n" +
    "  <nav>\n" +
    "    <form class=\"form-inline col-sm-4 col-sm-offset-8 search-control\">\n" +
    "      <div class=\"input-group\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"{{'ACTION.SEARCH' | translate}}\" ng-model=\"ctrl.query.name\" />\n" +
    "        <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-search\"></span></span>\n" +
    "      </div>\n" +
    "    </form>\n" +
    "  </nav>\n" +
    "</div>\n" +
    "<table class=\"table table-bordered\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th class=\"col-sm-1\">#</th>\n" +
    "      <th class=\"col-sm-3\">\n" +
    "        <a href ng-click=\"ctrl.changeOrder('name')\">{{'PROJECT.ATTRIBUTES.NAME' | translate}}</a>\n" +
    "      </th>\n" +
    "      <th class=\"col-sm-3\">\n" +
    "        <a href ng-click=\"ctrl.changeOrder('createdAt')\">{{'PROJECT.ATTRIBUTES.CREATED_AT' | translate}}</a>\n" +
    "      </th>\n" +
    "      <th class=\"col-sm-3\">\n" +
    "        <a href ng-click=\"ctrl.changeOrder('updatedAt')\">{{'PROJECT.ATTRIBUTES.UPDATED_AT' | translate}}</a>\n" +
    "      </th>\n" +
    "      <th class=\"col-sm-2\">{{'ACTION.ACTION' | translate}}</th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"project in ctrl.projects.toArray() | filter:ctrl.query | orderBy:ctrl.predicate:ctrl.reverse | pager:ctrl.currentPage:ctrl.itemsPerPage\">\n" +
    "      <td>{{$index + 1 + ctrl.itemsPerPage * (ctrl.currentPage - 1)}}</td>\n" +
    "      <td>{{project.name}}</td>\n" +
    "      <td>{{project.createdAt | date:'yyyy/MM/dd HH:mm'}}</td>\n" +
    "      <td>{{project.updatedAt | date:'yyyy/MM/dd HH:mm'}}</td>\n" +
    "      <td><a ui-sref=\"projects.get.detail({ projectId: project.key })\">{{'ACTION.SHOW' | translate}}</a>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "<pagination total-items=\"ctrl.projects.toArray() | filter:ctrl.query | count\" page=\"ctrl.currentPage\" items-per-page=\"ctrl.itemsPerPage\"></pagination>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/projects/projects.html',
    "<div class=\"tab-pane\">\n" +
    "  <h2>{{'PROJECT.PROJECTS' | translate}}</h2>\n" +
    "\n" +
    "  <ol class=\"breadcrumb\">\n" +
    "    <li class=\"active\">{{'PROJECT.PROJECTS' | translate}}</li>\n" +
    "  </ol>\n" +
    "\n" +
    "  <ul class=\"nav nav-tabs\">\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" href ui-sref=\"projects.all.list\">{{'ACTION.LIST' | translate}}</a>\n" +
    "    </li>\n" +
    "    <li ui-sref-active=\"active\">\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" href ui-sref=\"projects.all.create\">{{'ACTION.NEW' | translate}}</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div class=\"tab-content\" ui-view=\"content\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/remove-item-dialog.html',
    "<div class=\"modal-header\">\n" +
    "  <h3>{{'ACTION.DIALOG.REMOVE.HEADING' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <p>\n" +
    "    {{'ACTION.DIALOG.REMOVE.HEADING' | translate}}\n" +
    "  </p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn btn-default\" ng-click=\"cancel()\">{{ 'ACTION.DIALOG.REMOVE.CANCEL' | translate }}</button>\n" +
    "  <button class=\"btn btn-danger\" ng-click=\"ok()\">{{ 'ACTION.DIALOG.REMOVE.OK' | translate }}</button>\n" +
    "</div>\n"
  );


  $templateCache.put('/partials/setting-dialog.html',
    "<div class=\"modal-header\">\n" +
    "  <h3>{{ 'EGM.APP.LAYOUT_SETTINGS' | translate }}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <form class=\"form-horizontal\">\n" +
    "    <div class=\"control-group\">\n" +
    "      <label class=\"control-label\">{{ 'EGM.APP.VIEWS.VIEWS' | translate }}</label>\n" +
    "      <div class=\"controls\">\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.viewMode\" ng-value=\"ViewMode.Normal\"/>{{ 'EGM.APP.VIEWS.NORMAL' | translate }}</label>\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.viewMode\" ng-value=\"ViewMode.Edge\"/>{{ 'EGM.APP.VIEWS.EDGE' | translate }}</label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"control-group\">\n" +
    "      <label class=\"control-label\">{{ 'EGM.APP.INACTIVE_NODE.INACTIVE_NODE' | translate }}</label>\n" +
    "      <div class=\"controls\">\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.inactiveNode\" ng-value=\"InactiveNode.Hidden\"/>{{ 'EGM.APP.INACTIVE_NODE.HIDDEN' | translate }}</label>\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.inactiveNode\" ng-value=\"InactiveNode.Transparent\"/>{{ 'EGM.APP.INACTIVE_NODE.TRANSPARENT' | translate }}</label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"control-group\">\n" +
    "      <label class=\"control-label\">{{ 'EGM.APP.SCALING.SCALING' | translate }}</label>\n" +
    "      <div class=\"controls\">\n" +
    "        <label class=\"checkbox\"><input type=\"checkbox\" ng-model=\"options.scalingConnection\"/>{{ 'EGM.APP.SCALING.CONNECTION' | translate }}</label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"control-group\">\n" +
    "      <label class=\"control-label\">{{'EGM.APP.LINE_UP' | translate}}</label>\n" +
    "      <div class=\"controls\">\n" +
    "        <label class=\"checkbox\"><input type=\"checkbox\" ng-model=\"options.lineUpTop\"/>{{'EGM.UPPERMOST_EVALUATION_ITEM' | translate}}</label>\n" +
    "        <label class=\"checkbox\"><input type=\"checkbox\" ng-model=\"options.lineUpBottom\"/>{{'EGM.LOWERMOST_EVALUATION_ITEM' | translate}}</label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "  <button class=\"btn\" ng-click=\"close()\">{{ 'ACTION.CLOSE' | translate }}</button>\n" +
    "</div>\n"
  );

}]);
