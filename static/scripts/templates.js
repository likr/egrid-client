angular.module('collaboegm').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/partials/about.html',
    "<div egm-application-view>\r" +
    "\n" +
    "<h2>E-Gridとは</h2>\r" +
    "\n" +
    "E-Gridは評価グリッド法によるインタビュー・分析を支援するサービスです。\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "  <div class=\"col-xs-4\">\r" +
    "\n" +
    "    <img src=\"images/about/tiled.jpg\" class=\"img-responsive img-rounded\"/>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div class=\"col-xs-4\">\r" +
    "\n" +
    "    <img src=\"images/about/tiled.jpg\" class=\"img-responsive img-rounded\"/>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div class=\"col-xs-4\">\r" +
    "\n" +
    "    <img src=\"images/about/tiled.jpg\" class=\"img-responsive img-rounded\"/>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<h3>E-Gridによるインタビュー</h3>\r" +
    "\n" +
    "<p>簡単と言われる評価グリッド法のインタビューにもたくさんのつまずくポイントがあります。</p>\r" +
    "\n" +
    "<p>E-Gridは、はじめてインタビューをする人でもすぐにエキスパート並の調査が行えるように開発されました。</p>\r" +
    "\n" +
    "<p>従来、評価グリッド法のインタビューは紙に図を記録しながら行われていました。</p>\r" +
    "\n" +
    "<p>話を聞きながら記録するのは初心者にとっては非常に大変な作業です。</p>\r" +
    "\n" +
    "<p>E-Gridを使うことで、インタビューの本質的ではない作業から解放され、効果的な調査が実施できます。</p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<h3>E-Gridによる分析</h3>\r" +
    "\n" +
    "<p>E-Gridでは、インタビュー結果の分析にも着目しています。</p>\r" +
    "\n" +
    "<p>インタビューをすることが目的ではなく、その結果を分析して意味ある結論を導きだすのが本当の目的です。</p>\r" +
    "\n" +
    "<p>E-Gridは可視化の技術や対話的な操作を通じて、価値ある結論を導きだす手助けを行います。</p>\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "  <div class=\"col-xs-6\">\r" +
    "\n" +
    "    <img src=\"images/about/personal.png\" style=\"height: 150px;\" class=\"img-responsive img-thumbnail\"/>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div class=\"col-xs-6\">\r" +
    "\n" +
    "    <img src=\"images/about/overall.png\" style=\"height: 150px;\" class=\"img-responsive img-thumbnail\"/>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<h3>評価グリッド法とは</h3>\r" +
    "\n" +
    "<p>評価グリッド法は、讃井教授によって開発された定性評価手法で、インタビューを通じて人間がものごとに対して抱いている評価構造を明らかにします。</p>\r" +
    "\n" +
    "<p>昨今の価値観が多様化した世の中では、人々がどのようにものごとを考えて行動しているか定性的に理解した上で、意思決定を行うことが大切です。</p>\r" +
    "\n" +
    "<p>しかし、自由な形式のインタビューから価値のある情報を導きだすためにはインタビューワーの熟練したスキルが必要になります。</p>\r" +
    "\n" +
    "<p>評価グリッド法は、半構造化インタビューというある程度質問の流れの決まったインタビュー手法なので、高度なスキルは必要としません。</p>\r" +
    "\n" +
    "<p>さらに、評価グリッド法は統計分析等の定量評価手法との相性が良いことから環境心理学、人間工学、感性工学、マーケティングリサーチなど様々な分野で活用されています。</p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<h3>参考文献</h3>\r" +
    "\n" +
    "<ul>\r" +
    "\n" +
    "  <li>讃井純一郎、乾正雄 『レパートリー・グリッド発展手法による住環境評価構造の抽出 : 認知心理学に基づく住環境評価に関する研究(1)』 日本建築学会計画系論文報告集 No.367 pp.15-22、1986年</li>\r" +
    "\n" +
    "  <li>神田範明 他 『ヒットを生む商品企画七つ道具 よくわかる編 (商品企画七つ道具実践シリーズ) 』 日科技連出版社、2000年</li>\r" +
    "\n" +
    "  <li>福田忠彦研究室 『増補版 人間工学ガイド - 感性を科学する方法』 サイエンティスト社、2009年</li>\r" +
    "\n" +
    "</ul>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/egm-edit.html',
    "<div>\r" +
    "\n" +
    "  <div class=\"navbar navbar-default navbar-fixed-top\" style=\"top: 50px;\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "      <form class=\"navbar-form navbar-left\">\r" +
    "\n" +
    "        <a class=\"btn btn-default\" id=\"appendNodeButton\"><i class=\"glyphicon glyphicon-pencil\"></i>{{'ACTION.APPEND' | translate}}</a>\r" +
    "\n" +
    "      </form>\r" +
    "\n" +
    "      <form class=\"navbar-form navbar-right\">\r" +
    "\n" +
    "        <a class=\"btn btn-default pull-right\" id=\"saveButton\"><i class=\"glyphicon glyphicon-share\"></i>{{'ACTION.SAVE' | translate}}</a>\r" +
    "\n" +
    "      </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div style=\"position: absolute; left: 0; top: 100px; overflow: hidden;\">\r" +
    "\n" +
    "    <svg id=\"display\" style=\"display: block;\"></svg>\r" +
    "\n" +
    "    <div id=\"nodeController\" class=\"btn-group invisible\" style=\"position: absolute; top: 0; left: 0;\">\r" +
    "\n" +
    "      <button id=\"ladderUpButton\" class=\"btn btn-default\" title=\"{{'EGM.LADDER_UP' | translate}}\"><span class=\"glyphicon glyphicon-arrow-left\"></span></button>\r" +
    "\n" +
    "      <button id=\"removeNodeButton\" class=\"btn btn-default\" title=\"{{'ACTION.REMOVE' | translate}}\"><span class=\"glyphicon glyphicon-remove\"></span></button>\r" +
    "\n" +
    "      <button id=\"mergeNodeButton\" class=\"btn btn-default\" title=\"{{'ACTION.MERGE' | translate}}\"><span class=\"glyphicon glyphicon-plus\"></span></button>\r" +
    "\n" +
    "      <button id=\"editNodeButton\" class=\"btn btn-default\" title=\"{{'ACTION.EDIT' | translate}}\"><span class=\"glyphicon glyphicon-pencil\"></span></button>\r" +
    "\n" +
    "      <button id=\"ladderDownButton\" class=\"btn btn-default\" title=\"{{'EGM.LADDER_DOWN' | translate}}\"><span class=\"glyphicon glyphicon-arrow-right\"></span></button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div class=\"navbar navbar-default navbar-fixed-bottom\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "      <form class=\"navbar-form navbar-left\">\r" +
    "\n" +
    "        <a class=\"btn btn-default\" id=\"undoButton\"><i class=\"glyphicon glyphicon-arrow-left\"></i>{{'ACTION.UNDO' | translate}}</a>\r" +
    "\n" +
    "        <a class=\"btn btn-default\" id=\"redoButton\"><i class=\"glyphicon glyphicon-arrow-right\"></i>{{'ACTION.REDO' | translate}}</a>\r" +
    "\n" +
    "      </form>\r" +
    "\n" +
    "      <form class=\"navbar-form navbar-right\">\r" +
    "\n" +
    "        <a ng-click=\"participantGrid.exportJSON($event)\" class=\"btn btn-default\" id=\"exportJSON\" target=\"_blank\"><i class=\"glyphicon glyphicon-floppy-save\"></i>JSON {{'ACTION.EXPORT' | translate}}</a>\r" +
    "\n" +
    "        <a class=\"btn btn-default\" id=\"exportSVG\" target=\"_blank\"><i class=\"glyphicon glyphicon-floppy-save\"></i>SVG {{'ACTION.EXPORT' | translate}}</a>\r" +
    "\n" +
    "      </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/filter-participants-dialog.html',
    "<div class=\"modal-header\">\r" +
    "\n" +
    "  <h3>{{'PARTICIPANT.FILTER' | translate}}</h3>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-body\">\r" +
    "\n" +
    "  <table class=\"table table-hover\">\r" +
    "\n" +
    "    <tr ng-class=\"{'success':active[participant.key()]}\" ng-repeat=\"participant in participants\">\r" +
    "\n" +
    "      <td>\r" +
    "\n" +
    "        <label class=\"checkbox\">\r" +
    "\n" +
    "          <input type=\"checkbox\" ng-model=\"results[participant.key()]\"/>{{participant.name}}\r" +
    "\n" +
    "        </label>\r" +
    "\n" +
    "      </td>\r" +
    "\n" +
    "    </tr>\r" +
    "\n" +
    "  </table>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-footer\">\r" +
    "\n" +
    "  <button class=\"btn btn-default\" ng-click=\"close()\">{{ 'ACTION.CLOSE' | translate }}</button>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/help.html',
    "<div egm-application-view>\r" +
    "\n" +
    "<h1>Help</h1>\r" +
    "\n" +
    "<p>E-Gridによるインタビューについて説明します。</p>\r" +
    "\n" +
    "<div class=\"row\">\r" +
    "\n" +
    "<div class=\"col-xs-9\">\r" +
    "\n" +
    "  <div id=\"help-egm\">\r" +
    "\n" +
    "    <h1>1. 評価グリッド法</h1>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div id=\"help-preparation\">\r" +
    "\n" +
    "    <h1>2. 調査の準備</h1>\r" +
    "\n" +
    "    <div id=\"help-design\">\r" +
    "\n" +
    "      <h2>2.1. リサーチデザイン</h2>\r" +
    "\n" +
    "      <p>評価グリッド法による調査を開始する前に、調査の計画をしっかり立てましょう。</p>\r" +
    "\n" +
    "      <p>検討するべき項目には以下のようなものがあります。</p>\r" +
    "\n" +
    "      <ul>\r" +
    "\n" +
    "        <li>調査によって明らかにしたいことは何か、事前にある程度仮説を立てておく</li>\r" +
    "\n" +
    "        <li>どんな人に対して調査を行うか、回答者は調査対象にある程度の知識・関心を持っていることが望ましい</li>\r" +
    "\n" +
    "        <li>エレメントを何にするか、実物や写真かあるいは回答者の記憶か、調査を通じて一貫していることが望ましい</li>\r" +
    "\n" +
    "        <li>エレメントをどのように提示するか、全エレメントの組合わせを取れば網羅的な調査ができるがインタビューの負担は大きくなる</li>\r" +
    "\n" +
    "        <li>インタビューをどのような形で行うか、対面以外にもビデオ通話やチャットで行う場合もある</li>\r" +
    "\n" +
    "        <li>回答者は一度に一人かあるいは複数か、複数に同時に行う場合は質問の進め方に工夫がいる</li>\r" +
    "\n" +
    "      </ul>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"help-new-project\">\r" +
    "\n" +
    "      <h2>2.2. プロジェクトの作成</h2>\r" +
    "\n" +
    "      <p>E-Gridでは、何人かへのインタビューを通じた一連の調査は「プロジェクト」として登録されます。</p>\r" +
    "\n" +
    "      <p>プロジェクトの単位で共同調査者の設定や、インタビュー結果をまとめた分析が可能です。</p>\r" +
    "\n" +
    "      <p>プロジェクト作成は以下の手順で行います。<p>\r" +
    "\n" +
    "      <ol>\r" +
    "\n" +
    "        <li>「新規」タブを選択します。</li>\r" +
    "\n" +
    "        <li>プロジェクト名など必要な情報を入力します。</li>\r" +
    "\n" +
    "        <li>「送信」ボタンを押します。</li>\r" +
    "\n" +
    "      </ol>\r" +
    "\n" +
    "      <p>作成したプロジェクトは一覧タブに表示されます。</p>\r" +
    "\n" +
    "      <img src=\"images/help/new-project.png\" class=\"img-responsive img-thumbnail\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"help-new-participant\">\r" +
    "\n" +
    "      <h2>2.3. 実験参加者(インタビュー回答者)の登録</h2>\r" +
    "\n" +
    "      <p>1回のインタビュー毎に、「実験参加者」を登録します。</p>\r" +
    "\n" +
    "      <p>実験参加者の登録は以下の手順で行います。</p>\r" +
    "\n" +
    "      <ol>\r" +
    "\n" +
    "        <li>「実験参加者」タブの「新規」タブを選択します。</li>\r" +
    "\n" +
    "        <li>「氏名」など必要な情報を入力します。</li>\r" +
    "\n" +
    "        <li>「送信」ボタンを押します。</li>\r" +
    "\n" +
    "      </ol>\r" +
    "\n" +
    "      <img src=\"images/help/new-participant.png\" class=\"img-responsive img-thumbnail\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div id=\"help-interview\">\r" +
    "\n" +
    "    <h1>3. インタビュー</h1>\r" +
    "\n" +
    "    <div id=\"help-origina\">\r" +
    "\n" +
    "      <h2>3.1. オリジナル評価項目の抽出</h2>\r" +
    "\n" +
    "      <p>回答者が対象に対して抱いている評価に関与する項目を「評価項目」と呼びます</p>\r" +
    "\n" +
    "      <p>エレメント間の優劣を回答者に判断してもらい、その判断理由を訪ねることで、評価項目を抽出します。</p>\r" +
    "\n" +
    "      <p>ここで得られる評価項目を特に「オリジナル評価項目」と呼びます。</p>\r" +
    "\n" +
    "      <p>エレメントの提示方法には様々なバリエーションがありますが、ここでは讃井教授が初期に提案した方法に従います。</p>\r" +
    "\n" +
    "      <p>まず、回答者に、エレメント群を「好ましい」ものから「好ましくない」ものまで5段階に分類してもらいます。</p>\r" +
    "\n" +
    "      <p>説明のためこれらのグループを順番にA、B、C、D、Eと名付けます。</p>\r" +
    "\n" +
    "      <p>エレメントの提示とオリジナル評価項目の抽出には以下のように質問をします。</p>\r" +
    "\n" +
    "      <p>Q.「B〜EのエレメントよりもこちらのAのエレメントの方がより好ましいということですが、そう判断された理由のうちあなたにとって重要なものを、どんなものでもかまいませんので、思い付くまま、1つずつ言ってください。なお、これらのうち特定のものにだけあてはまる理由でもかまいません。」</p>\r" +
    "\n" +
    "      <p>回答者が新しい評価項目を見いだせなくなったら次の組合わせに移り、「C〜EのエレメントよりもこちらのBのエレメントの方が〜」と質問を行います。</p>\r" +
    "\n" +
    "      <p>「D、EのエレメントとCのエレメント」、「EのエレメントとDのエレメント」というように繰り返していきます。</p>\r" +
    "\n" +
    "      <p>一連の質問を終えたら、最後に評価が高いグループの不満点を尋ねることで評価項目の補完を行うこともあります。</p>\r" +
    "\n" +
    "      <p>抽出した評価項目は以下のような手順で逐一E-Gridに入力してください。</p>\r" +
    "\n" +
    "      <ol>\r" +
    "\n" +
    "        <li>インタビュー画面左上の「追加」ボタンを押します。</li>\r" +
    "\n" +
    "        <li>評価項目入力ダイアログが開かれるので、抽出した評価項目を文章で入力する。この時、既に他の回答者から得られている評価項目のうち入力中の評価項目に近いものが一覧表示されるので、同じ内容を指す評価項目がある場合はそこから選択することで、分析時に類似評価項目を探索する手間が省けます。</li>\r" +
    "\n" +
    "        <li>「送信」ボタン、またはリスト表示された評価項目の「選択」ボタンを押すことでオリジナル評価項目が追加されます。</li>\r" +
    "\n" +
    "      </ol>\r" +
    "\n" +
    "      <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-xs-6\">\r" +
    "\n" +
    "          <img src=\"images/help/before-append-item.png\" class=\"img-responsive img-thumbnail\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"col-xs-6\">\r" +
    "\n" +
    "          <img src=\"images/help/input-item.png\" class=\"img-responsive img-thumbnail\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div id=\"help-laddering\">\r" +
    "\n" +
    "      <h2>3.2. ラダーリング</h2>\r" +
    "\n" +
    "      <h3>3.2.1. ラダーアップ</h3>\r" +
    "\n" +
    "      <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-xs-6\">\r" +
    "\n" +
    "          <img src=\"images/help/before-ladder-up.png\" class=\"img-responsive img-thumbnail\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"col-xs-6\">\r" +
    "\n" +
    "          <img src=\"images/help/after-ladder-up.png\" class=\"img-responsive img-thumbnail\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "      <h3>3.2.2. ラダーダウン</h3>\r" +
    "\n" +
    "      <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-xs-6\">\r" +
    "\n" +
    "          <img src=\"images/help/before-ladder-down.png\" class=\"img-responsive img-thumbnail\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"col-xs-6\">\r" +
    "\n" +
    "          <img src=\"images/help/after-ladder-down.png\" class=\"img-responsive img-thumbnail\"/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div id=\"help-analysis\">\r" +
    "\n" +
    "    <h1>4. 分析</h1>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"col-xs-3\">\r" +
    "\n" +
    "  <ul class=\"nav\">\r" +
    "\n" +
    "    <a href=\"#help-interview\">インタビュー</a>\r" +
    "\n" +
    "  </ul>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/input-text-dialog.html',
    "<div class=\"modal-header\">\r" +
    "\n" +
    "  <h3>{{'EGM.APP.INPUT_EVALUATION_FACTOR' | translate}}</h3>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-body\">\r" +
    "\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"close(result)\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"result\" focus-me/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "      <div class=\"col-sm-2\">\r" +
    "\n" +
    "        <input type=\"submit\" class=\"btn btn-primary\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </form>\r" +
    "\n" +
    "  <table class=\"table table-hover\">\r" +
    "\n" +
    "    <tr ng-repeat=\"text in texts | filter:result\" ng-dblclick=\"close(text.text)\">\r" +
    "\n" +
    "      <td>{{text.text}}</td>\r" +
    "\n" +
    "      <td>{{text.weight}}</td>\r" +
    "\n" +
    "      <td><button class=\"btn btn-default\" ng-click=\"close(text.text)\">{{'ACTION.SELECT' | translate}}</button></td>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "  </table>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-footer\">\r" +
    "\n" +
    "  <button class=\"btn btn-primary\" ng-click=\"close()\">{{ 'ACTION.CLOSE' | translate }}</button>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project-grid-edit.html',
    "<div>\r" +
    "\n" +
    "  <div class=\"navbar navbar-default navbar-fixed-top\" style=\"top: 50px;\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "      <form class=\"navbar-form navbar-left\">\r" +
    "\n" +
    "        <a class=\"btn btn-default\" id=\"filterButton\">{{'ACTION.FILTER' | translate}}</a>\r" +
    "\n" +
    "        <a class=\"btn btn-default\" id=\"layoutButton\">{{'EGM.APP.LAYOUT_SETTINGS' | translate}}</a>\r" +
    "\n" +
    "        <a class=\"btn btn-default\" id=\"appendNodeButton\"><i class=\"glyphicon glyphicon-pencil\"></i>{{'ACTION.APPEND' | translate}}</a>\r" +
    "\n" +
    "      </form>\r" +
    "\n" +
    "      <form class=\"navbar-form navbar-right\">\r" +
    "\n" +
    "        <a class=\"btn btn-default pull-right\" id=\"saveButton\" ng-click=\"projectGrid.save()\"><i class=\"glyphicon glyphicon-share\"></i>{{'ACTION.SAVE' | translate}}</a>\r" +
    "\n" +
    "      </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div style=\"position: absolute; left: 0; top: 100px; overflow: hidden;\">\r" +
    "\n" +
    "    <svg id=\"display\" style=\"display: block;\"></svg>\r" +
    "\n" +
    "    <div id=\"nodeController\" class=\"btn-group invisible\" style=\"position: absolute; top: 0; left: 0;\">\r" +
    "\n" +
    "      <button id=\"removeNodeButton\" class=\"btn btn-default\" title=\"{{'ACTION.REMOVE' | translate}}\"><span class=\"glyphicon glyphicon-remove\"></i></button>\r" +
    "\n" +
    "      <button id=\"mergeNodeButton\" class=\"btn btn-default\" title=\"{{'ACTION.MERGE' | translate}}\"><span class=\"glyphicon glyphicon-plus\"></i></button>\r" +
    "\n" +
    "      <button id=\"editNodeButton\" class=\"btn btn-default\" title=\"{{'ACTION.EDIT' | translate}}\"><span class=\"glyphicon glyphicon-pencil\"></span></button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div class=\"navbar navbar-default navbar-fixed-bottom\">\r" +
    "\n" +
    "    <div class=\"container\">\r" +
    "\n" +
    "      <form class=\"navbar-form navbar-left\">\r" +
    "\n" +
    "        <a class=\"btn btn-default\" id=\"undoButton\"><i class=\"glyphicon glyphicon-arrow-left\"></i>{{'ACTION.UNDO' | translate}}</a>\r" +
    "\n" +
    "        <a class=\"btn btn-default\" id=\"redoButton\"><i class=\"glyphicon glyphicon-arrow-right\"></i>{{'ACTION.REDO' | translate}}</a>\r" +
    "\n" +
    "      </form>\r" +
    "\n" +
    "      <form class=\"navbar-form navbar-right\">\r" +
    "\n" +
    "        <a ng-click=\"projectGrid.exportJSON($event)\" class=\"btn btn-default\" id=\"exportJSON\" target=\"_blank\"><i class=\"glyphicon glyphicon-floppy-save\"></i>JSON {{'ACTION.EXPORT' | translate}}</a>\r" +
    "\n" +
    "        <a class=\"btn btn-default\" id=\"exportSVG\" target=\"_blank\"><i class=\"glyphicon glyphicon-floppy-save\"></i>SVG {{'ACTION.EXPORT' | translate}}</a>\r" +
    "\n" +
    "      </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/analyses/analyses.html',
    "<h3>{{ 'SEM.SEM' | translate }}</h3>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<ul class=\"nav nav-tabs\">\r" +
    "\n" +
    "  <li ui-sref-active=\"active\">\r" +
    "\n" +
    "    <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.analyses.all.list\">{{'ACTION.LIST' | translate}}</a>\r" +
    "\n" +
    "  </li>\r" +
    "\n" +
    "  <li ui-sref-active=\"active\">\r" +
    "\n" +
    "    <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.analyses.all.create\">{{'ACTION.NEW' | translate}}</a>\r" +
    "\n" +
    "  </li>\r" +
    "\n" +
    "</ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"tab-content\" ui-view=\"content\" />\r" +
    "\n"
  );


  $templateCache.put('/partials/project/analyses/analysis/analyses.html',
    "<div class=\"tab-pane active\" select=\"drawSemAnalysis()\">\r" +
    "\n" +
    "  <div id=\"sem-analysis-display\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "      <div class=\"span10\">\r" +
    "\n" +
    "        <svg width=\"100%\" height=\"500px\"></svg>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "      <div class=\"span2\">\r" +
    "\n" +
    "        <table class=\"table\">\r" +
    "\n" +
    "          <tr ng-repeat=\"item in items\">\r" +
    "\n" +
    "            <td>\r" +
    "\n" +
    "              <label class=\"checkbox\">\r" +
    "\n" +
    "                <input type=\"checkbox\" ng-model=\"item.active\" ng-change=\"removeNode()\"/>{{ item.text }}\r" +
    "\n" +
    "              </label>\r" +
    "\n" +
    "            </td>\r" +
    "\n" +
    "          </tr>\r" +
    "\n" +
    "        </table>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/analyses/analysis/analysis.html',
    "<div>\r" +
    "\n" +
    "  <h2>{{ semProject.semProject.name }}</h2>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <ol class=\"breadcrumb\">\r" +
    "\n" +
    "    <li>\r" +
    "\n" +
    "      <a ui-sref=\"projects.all.list\">{{ 'PROJECT.PROJECTS' | translate }}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li>\r" +
    "\n" +
    "      <a ui-sref=\"projects.get.detail\">{{semProject.semProject.project.name}}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li>\r" +
    "\n" +
    "      <a ui-sref=\"projects.get.analyses.all.list\">{{'EGM.ANALYSIS' | translate }}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li class=\"active\">\r" +
    "\n" +
    "      {{ semProject.semProject.name }}\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "  </ol>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <ul class=\"nav nav-tabs\">\r" +
    "\n" +
    "    <li ui-sref-active=\"active\">\r" +
    "\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.analyses.get.design\">{{ 'SEM.QUESTIONNAIRE.DESIGN' | translate }}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li ui-sref-active=\"active\">\r" +
    "\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.analyses.get.questionnaire\">{{'SEM.QUESTIONNAIRE.QUESTIONNAIRE' | translate}}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li ui-sref-active=\"active\">\r" +
    "\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.analyses.get.analysis\">{{'SEM.ANALYSIS' | translate}}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "  </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <div class=\"tab-content\" ui-view=\"content\"></div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/analyses/analysis/design.html',
    "<div class=\"tab-pane active\">\r" +
    "\n" +
    "  <h2>アンケート設定</h2>\r" +
    "\n" +
    "  <form class=\"form-horizontal\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"col-sm-2 control-label\">アンケート題名</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"アンケート題名\" ng-model=\"questionnaire.data.title\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"col-sm-2 control-label\">アンケート説明</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <textarea class=\"form-control\" placeholder=\"アンケート説明\" ng-model=\"questionnaire.data.description\"></textarea>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <h3>質問項目設定</h3>\r" +
    "\n" +
    "  <div class=\"row\">\r" +
    "\n" +
    "    <div class=\"span8\">\r" +
    "\n" +
    "      <div id=\"sem-questionnaire-design-display\">\r" +
    "\n" +
    "        <svg width=\"100%\" height=\"500px\"></svg>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"span4\" style=\"height: 500px; overflow: scroll;\">\r" +
    "\n" +
    "      <table class=\"table\">\r" +
    "\n" +
    "        <tr ng-repeat=\"item in questionnaire.items\">\r" +
    "\n" +
    "          <td>\r" +
    "\n" +
    "            <label class=\"checkbox\">\r" +
    "\n" +
    "              <input type=\"checkbox\" ng-model=\"item.checked\" ng-change=\"questionnaire.updateItems()\"/>{{item.text}}\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "          </td>\r" +
    "\n" +
    "          <td>{{item.weight}}</td>\r" +
    "\n" +
    "        </tr>\r" +
    "\n" +
    "      </table>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <div>\r" +
    "\n" +
    "    <div ng-repeat=\"item in questionnaire.data.items\">\r" +
    "\n" +
    "      <form class=\"form-horizontal\">\r" +
    "\n" +
    "        <fieldset>\r" +
    "\n" +
    "          <legend>{{item.text}}</legend>\r" +
    "\n" +
    "          <div class=\"control-group\">\r" +
    "\n" +
    "            <label class=\"control-label\">質問項目</label>\r" +
    "\n" +
    "            <div class=\"controls\">\r" +
    "\n" +
    "              <input class=\"span6\" type=\"text\" ng-model=\"item.title\"/>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "          </div>\r" +
    "\n" +
    "          <div class=\"control-group\">\r" +
    "\n" +
    "            <label class=\"control-label\">質問文</label>\r" +
    "\n" +
    "            <div class=\"controls\">\r" +
    "\n" +
    "              <textarea class=\"span6\" rows=\"3\" ng-model=\"item.description\"></textarea>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "          </div>\r" +
    "\n" +
    "        </fieldset>\r" +
    "\n" +
    "      </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div>\r" +
    "\n" +
    "    <a class=\"btn btn-primary btn-large\">{{'ACTION.SAVE' | translate}}</a>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/analyses/analysis/questionnaire.html',
    ""
  );


  $templateCache.put('/partials/project/analyses/create.html',
    "<div class=\"tab-pane active\" ng-controller=\"SemProjectCreateController as newSemProject\">\r" +
    "\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"newSemProject.submit()\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"name\">{{ 'SEM_PROJECT.ATTRIBUTES.NAME' | translate }}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{ 'SEM_PROJECT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate }}\" ng-model=\"newSemProject.name\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <div class=\"col-sm-offset-2 col-sm-10\">\r" +
    "\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{ 'ACTION.SUBMIT' | translate }}\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </form>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/analyses/list.html',
    "<div class=\"tab-pane active\">\r" +
    "\n" +
    "  <table class=\"table\">\r" +
    "\n" +
    "    <thead>\r" +
    "\n" +
    "      <tr>\r" +
    "\n" +
    "        <th>#</th>\r" +
    "\n" +
    "        <th>{{ 'SEM_PROJECT.ATTRIBUTES.NAME' | translate }}</th>\r" +
    "\n" +
    "        <th>{{ 'ACTION.ACTION' | translate }}</th>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "    </thead>\r" +
    "\n" +
    "    <tbody>\r" +
    "\n" +
    "      <tr ng-repeat=\"semProject in ctrl.semProjects.toArray()\">\r" +
    "\n" +
    "        <td>{{ $index + 1 }}</td>\r" +
    "\n" +
    "        <td>{{ semProject.name }}</td>\r" +
    "\n" +
    "        <td><a ui-sref=\"projects.get.analyses.get.design({ semProjectId: semProject.key })\">{{ 'ACTION.SHOW' | translate }}</a>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "    </tbody>\r" +
    "\n" +
    "  </table>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/collaborators/collaborators.html',
    "<ul class=\"nav nav-tabs\">\r" +
    "\n" +
    "  <li ui-sref-active=\"active\">\r" +
    "\n" +
    "    <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.collaborators.all.list\">{{ 'ACTION.LIST' | translate }}</a>\r" +
    "\n" +
    "  </li>\r" +
    "\n" +
    "  <li ui-sref-active=\"active\">\r" +
    "\n" +
    "    <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.collaborators.all.create\">{{ 'ACTION.NEW' | translate }}</a>\r" +
    "\n" +
    "  </li>\r" +
    "\n" +
    "</ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"tab-content\" ui-view=\"c\"></div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/collaborators/create.html',
    "<div class=\"tab-pane active\">\r" +
    "\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"newCollaborator.submit()\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"name\">{{'COLLABORATOR.ATTRIBUTES.USER' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <input class=\"col-sm-10 form-control\" type=\"text\" name=\"name\" placeholder=\"{{'COLLABORATOR.ATTRIBUTES.PLACEHOLDERS.USER' | translate }}\" ng-model=\"newCollaborator.data.userEmail\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"note\">{{'COLLABORATOR.ROLE.ROLE' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <div class=\"checkbox\">\r" +
    "\n" +
    "          <label>\r" +
    "\n" +
    "            <input type=\"checkbox\" ng-model=\"newCollaborator.data.isManager\"/>{{'COLLABORATOR.ROLE.MANAGER' | translate}}\r" +
    "\n" +
    "          </label>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <div class=\"col-sm-offset-2 col-sm-10\">\r" +
    "\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{ 'ACTION.SUBMIT' | translate }}\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </form>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/collaborators/list.html',
    "<div class=\"tab-pane active\">\r" +
    "\n" +
    "  <table class=\"table\">\r" +
    "\n" +
    "    <thead>\r" +
    "\n" +
    "      <tr>\r" +
    "\n" +
    "        <th>#</th>\r" +
    "\n" +
    "        <th>{{'COLLABORATOR.ATTRIBUTES.USER' | translate}}</th>\r" +
    "\n" +
    "        <th>{{'COLLABORATOR.ROLE.ROLE' | translate}}</th>\r" +
    "\n" +
    "        <th>{{'ACTION.ACTION' | translate}}</th>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "    </thead>\r" +
    "\n" +
    "    <tbody>\r" +
    "\n" +
    "      <tr ng-repeat=\"collaborator in collaborators.collaborators.toArray()\">\r" +
    "\n" +
    "        <td>{{ $index + 1 }}</td>\r" +
    "\n" +
    "        <td>{{collaborator.user.nickname}}</td>\r" +
    "\n" +
    "        <td ng-if=\"collaborator.isManager\">{{'COLLABORATOR.ROLE.MANAGER' | translate}}</td>\r" +
    "\n" +
    "        <td ng-if=\"!collaborator.isManager\">{{'COLLABORATOR.ROLE.USER' | translate}}</td>\r" +
    "\n" +
    "        <td><a href ng-click=\"collaborators.confirm(collaborator.key)\">{{'ACTION.REMOVE' | translate}}</td>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "    </tbody>\r" +
    "\n" +
    "  </table>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/detail.html',
    "<form class=\"form-horizontal\" ng-submit=\"ctrl.update()\">\r" +
    "\n" +
    "  <div class=\"form-group\">\r" +
    "\n" +
    "    <label class=\"control-label col-sm-2\" for=\"name\">{{'PROJECT.ATTRIBUTES.NAME' | translate}}</label>\r" +
    "\n" +
    "    <div class=\"col-sm-10\">\r" +
    "\n" +
    "      <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{'PROJECT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate}}\" ng-model=\"ctrl.project.name\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <div class=\"form-group\">\r" +
    "\n" +
    "    <label class=\"control-label col-sm-2\" for=\"note\">{{'PROJECT.ATTRIBUTES.NOTE' | translate}}</label>\r" +
    "\n" +
    "    <div class=\"col-sm-10\">\r" +
    "\n" +
    "      <textarea class=\"form-control\" name=\"note\" rows=\"3\" placeholder=\"{{'PROJECT.ATTRIBUTES.PLACEHOLDERS.NOTE' | translate}}\" ng-model=\"ctrl.project.note\">&nbsp;</textarea>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <div class=\"form-group\">\r" +
    "\n" +
    "    <div class=\"col-sm-offset-2 col-sm-1\">\r" +
    "\n" +
    "      <input type=\"submit\" class=\"btn btn-default\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</form>\r" +
    "\n" +
    "<form class=\"form-horizontal\" ng-submit=\"ctrl.confirm()\">\r" +
    "\n" +
    "  <div class=\"form-group\">\r" +
    "\n" +
    "    <div class=\"col-sm-offset-11 col-sm-1\">\r" +
    "\n" +
    "      <input type=\"submit\" class=\"btn btn-danger\" value=\"{{'ACTION.REMOVE' | translate}}\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</form>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/evaluation.html',
    "<h3>{{'EGM.OVERALL_EVALUATION_STRUCTURE' | translate}}</h3>\r" +
    "\n" +
    "<div ng-controller=\"ProjectGridCreateController as projectGrid\">\r" +
    "\n" +
    "  <div class=\"navbar navbar-default\">\r" +
    "\n" +
    "    <div class=\"navbar-collapse\">\r" +
    "\n" +
    "      <form class=\"navbar-form\" ng-submit=\"projectGrid.submit()\">\r" +
    "\n" +
    "        <div class=\"form-group\">\r" +
    "\n" +
    "          <input class=\"form-control\" type=\"text\" ng-model=\"projectGrid.data.name\" required/>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <input type=\"submit\" class=\"btn btn-primary\" value=\"{{'ACTION.SHOW' | translate}}\"/>\r" +
    "\n" +
    "      </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div ng-controller=\"ProjectGridListController as projectGrids\">\r" +
    "\n" +
    "  <table class=\"table table-bordered\">\r" +
    "\n" +
    "    <thead>\r" +
    "\n" +
    "      <tr>\r" +
    "\n" +
    "        <th class=\"col-sm-1\">#</th>\r" +
    "\n" +
    "        <th class=\"col-sm-3\">{{'PROJECT_GRID.ATTRIBUTES.NAME' | translate}}</th>\r" +
    "\n" +
    "        <th class=\"col-sm-3\">{{'PROJECT_GRID.ATTRIBUTES.CREATED_AT' | translate}}</th>\r" +
    "\n" +
    "        <th class=\"col-sm-3\">{{'PROJECT_GRID.ATTRIBUTES.UPDATED_AT' | translate}}</th>\r" +
    "\n" +
    "        <th class=\"col-sm-2\">{{'ACTION.ACTION' | translate}}</th>\r" +
    "\n" +
    "    </thead>\r" +
    "\n" +
    "    <tbody>\r" +
    "\n" +
    "      <tr ng-repeat=\"grid in projectGrids.list\">\r" +
    "\n" +
    "        <td>{{$index + 1}}</td>\r" +
    "\n" +
    "        <td>{{grid.name}}</td>\r" +
    "\n" +
    "        <td>{{grid.createdAt | date:'yyyy/MM/dd HH:mm'}}</td>\r" +
    "\n" +
    "        <td>{{grid.updatedAt | date:'yyyy/MM/dd HH:mm'}}</td>\r" +
    "\n" +
    "        <td><a ui-sref=\"projects.get.grids.get.detail({ projectGridKey: grid.key })\">{{'ACTION.SHOW' | translate}}</td>\r" +
    "\n" +
    "      </tr>\r" +
    "\n" +
    "    </tbody>\r" +
    "\n" +
    "  </table>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/participants/create.html',
    "<div class=\"tab-pane active\">\r" +
    "\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"newParticipant.submit()\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"control-label col-sm-2\" for=\"name\">{{'PARTICIPANT.ATTRIBUTES.NAME' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{'PARTICIPANT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate}}\" ng-model=\"newParticipant.name\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"control-label col-sm-2\" for=\"note\">{{'PARTICIPANT.ATTRIBUTES.NOTE' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <textarea class=\"form-control\" name=\"note\" rows=\"3\" placeholder=\"{{ 'PARTICIPANT.ATTRIBUTES.PLACEHOLDERS.NOTE' | translate }}\" ng-model=\"newParticipant.note\">&nbsp;</textarea>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <div class=\"col-sm-offset-2 col-sm-10\">\r" +
    "\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </form>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/participants/list.html',
    "<div class=\"row\">\r" +
    "\n" +
    "  <nav>\r" +
    "\n" +
    "    <form class=\"form-inline col-sm-4 col-sm-offset-8 search-control\">\r" +
    "\n" +
    "      <div class=\"input-group\">\r" +
    "\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"{{'ACTION.SEARCH' | translate}}\" ng-model=\"ctrl.query.name\" />\r" +
    "\n" +
    "        <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-search\"></span></span>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "  </nav>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<table class=\"table table-bordered\">\r" +
    "\n" +
    "  <thead>\r" +
    "\n" +
    "    <tr>\r" +
    "\n" +
    "      <th class=\"col-sm-1\">#</th>\r" +
    "\n" +
    "      <th class=\"col-sm-3\">\r" +
    "\n" +
    "        <a href ng-click=\"ctrl.changeOrder('name')\">{{'PARTICIPANT.ATTRIBUTES.NAME' | translate}}</a>\r" +
    "\n" +
    "      </th>\r" +
    "\n" +
    "      <th class=\"col-sm-3\">\r" +
    "\n" +
    "        <a href ng-click=\"ctrl.changeOrder('createdAt')\">{{'PARTICIPANT.ATTRIBUTES.CREATED_AT' | translate}}</a>\r" +
    "\n" +
    "      </th>\r" +
    "\n" +
    "      <th class=\"col-sm-3\">\r" +
    "\n" +
    "        <a href ng-click=\"ctrl.changeOrder('updatedAt')\">{{'PARTICIPANT.ATTRIBUTES.UPDATED_AT' | translate}}</a>\r" +
    "\n" +
    "      </th>\r" +
    "\n" +
    "      <th class=\"col-sm-2\">{{'ACTION.ACTION' | translate}}</th>\r" +
    "\n" +
    "    </tr>\r" +
    "\n" +
    "  </thead>\r" +
    "\n" +
    "  <tbody>\r" +
    "\n" +
    "    <tr ng-repeat=\"participant in ctrl.participants.toArray() | filter:ctrl.query | orderBy:ctrl.predicate:ctrl.reverse | pager:ctrl.currentPage:ctrl.itemsPerPage\">\r" +
    "\n" +
    "      <td>{{$index + 1 + ctrl.itemsPerPage * (ctrl.currentPage - 1)}}</td>\r" +
    "\n" +
    "      <td>{{participant.name}}</td>\r" +
    "\n" +
    "      <td>{{participant.createdAt | date:'yyyy/MM/dd HH:mm'}}</td>\r" +
    "\n" +
    "      <td>{{participant.updatedAt | date:'yyyy/MM/dd HH:mm'}}</td>\r" +
    "\n" +
    "      <td><a ui-sref=\"projects.get.participants.get.detail({ participantId: participant.key })\">{{'ACTION.SHOW' | translate}}</a>\r" +
    "\n" +
    "    </tr>\r" +
    "\n" +
    "  </tbody>\r" +
    "\n" +
    "</table>\r" +
    "\n" +
    "<pagination total-items=\"ctrl.participants.toArray() | filter:ctrl.query | count\" page=\"ctrl.currentPage\" items-per-page=\"ctrl.itemsPerPage\"></pagination>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/participants/participant/detail.html',
    "<form class=\"form-horizontal\" ng-submit=\"ctrl.update()\">\r" +
    "\n" +
    "  <div class=\"form-group\">\r" +
    "\n" +
    "    <label class=\"control-label col-sm-2\" for=\"name\">{{ 'PARTICIPANT.ATTRIBUTES.NAME' | translate }}</label>\r" +
    "\n" +
    "    <div class=\"col-sm-10\">\r" +
    "\n" +
    "      <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{ 'PARTICIPANT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate }}\" ng-model=\"ctrl.participant.name\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <div class=\"form-group\">\r" +
    "\n" +
    "    <label class=\"control-label col-sm-2\" for=\"note\">{{ 'PARTICIPANT.ATTRIBUTES.NOTE' | translate }}</label>\r" +
    "\n" +
    "    <div class=\"col-sm-10\">\r" +
    "\n" +
    "      <textarea class=\"form-control\" name=\"note\" rows=\"3\" placeholder=\"{{ 'PARTICIPANT.ATTRIBUTES.PLACEHOLDERS.NOTE' | translate }}\" ng-model=\"ctrl.participant.note\">&nbsp;</textarea>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <div class=\"form-group\">\r" +
    "\n" +
    "    <div class=\"col-sm-offset-2 col-sm-1\">\r" +
    "\n" +
    "      <input type=\"submit\" class=\"btn btn-default\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</form>\r" +
    "\n" +
    "<form class=\"form-horizontal\" ng-submit=\"ctrl.confirm()\">\r" +
    "\n" +
    "  <div class=\"form-group\">\r" +
    "\n" +
    "    <div class=\"col-sm-offset-11 col-sm-1\">\r" +
    "\n" +
    "      <input type=\"submit\" class=\"btn btn-danger\" value=\"{{'ACTION.REMOVE' | translate}}\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</form>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/participants/participant/evaluation.html',
    "<div ng-controller=\"ParticipantGridController as participantGrid\">\r" +
    "\n" +
    "  <h3>評価構造図</h3>\r" +
    "\n" +
    "  <div class=\"navbar navbar-default\">\r" +
    "\n" +
    "    <div class=\"navbar-collapse\">\r" +
    "\n" +
    "      <form class=\"navbar-form\">\r" +
    "\n" +
    "        <a ui-sref=\"projects.get.participants.get.grid\" class=\"btn btn-primary\">{{'ACTION.EDIT' | translate}}</a>\r" +
    "\n" +
    "        <a ui-sref=\"projects.get.participants.get.grid({ disableCompletion: 1 })\" class=\"btn btn-default\">{{'ACTION.EDIT' | translate}}(テキスト補完なし)</a>\r" +
    "\n" +
    "      </form>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <div class=\"thumbnail\" style=\"height: 500px;\">\r" +
    "\n" +
    "    <svg id=\"display\" width=\"100%\" height=\"100%\"></svg>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "  <h3>サマリー</h3>\r" +
    "\n" +
    "  <table class=\"table table-bordered\">\r" +
    "\n" +
    "    <tr>\r" +
    "\n" +
    "      <th class=\"span6\">評価項目数</th>\r" +
    "\n" +
    "      <td class=\"span6\">{{participantGrid.egm.nodes().length}}</td>\r" +
    "\n" +
    "    </tr>\r" +
    "\n" +
    "    <tr>\r" +
    "\n" +
    "      <th>接続数</th>\r" +
    "\n" +
    "      <td>{{participantGrid.egm.links().length}}</td>\r" +
    "\n" +
    "    </tr>\r" +
    "\n" +
    "  </table>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/participants/participant/participant.html',
    "<div class=\"tab-pane active\">\r" +
    "\n" +
    "  <h2>{{ctrl.participant.name}}</h2>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <ol class=\"breadcrumb\">\r" +
    "\n" +
    "    <li>\r" +
    "\n" +
    "      <a ui-sref=\"projects.all.list\">{{'PROJECT.PROJECTS' | translate}}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li>\r" +
    "\n" +
    "      <a ui-sref=\"projects.get.detail\">{{ctrl.participant.project.name}}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li>\r" +
    "\n" +
    "      <a ui-sref=\"projects.get.participants.all.list\">{{'PARTICIPANT.PARTICIPANTS' | translate }}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li class=\"active\">\r" +
    "\n" +
    "      {{ctrl.participant.name}}\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "  </ol>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <ul class=\"nav nav-tabs\">\r" +
    "\n" +
    "    <li ui-sref-active=\"active\">\r" +
    "\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.participants.get.detail\">{{'ACTION.DETAIL' | translate}}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li ui-sref-active=\"active\">\r" +
    "\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.participants.get.evaluation\">{{'EGM.EVALUATION_STRUCTURE' | translate}}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "  </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <div class=\"tab-content\" ui-view=\"content\"></div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/participants/participants.html',
    "<ul class=\"nav nav-tabs\">\r" +
    "\n" +
    "  <li ui-sref-active=\"active\"><a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.participants.all.list\">{{'ACTION.LIST' | translate}}</a></li>\r" +
    "\n" +
    "  <li ui-sref-active=\"active\"><a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.participants.all.create\">{{'ACTION.NEW' | translate}}</a></li>\r" +
    "\n" +
    "</ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"tab-content\" ui-view=\"content\"></div>\r" +
    "\n"
  );


  $templateCache.put('/partials/project/project.html',
    "<div class=\"tab-pane active\">\r" +
    "\n" +
    "  <h2>{{ctrl.project.name}}</h2>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <ol class=\"breadcrumb\">\r" +
    "\n" +
    "    <li><a href ui-sref=\"projects.all.list\">{{'PROJECT.PROJECTS' | translate}}</a></li>\r" +
    "\n" +
    "    <li class=\"active\">{{ctrl.project.name}}</li>\r" +
    "\n" +
    "  </ol>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <ul class=\"nav nav-tabs\">\r" +
    "\n" +
    "    <li ui-sref-active=\"active\">\r" +
    "\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.detail\">{{'ACTION.DETAIL' | translate}}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li ng-class=\"{active: {{'projects.get.participants'|includedByState}}}\">\r" +
    "\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.participants.all.list\">{{'PARTICIPANT.PARTICIPANTS' | translate }}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li ui-sref-active=\"active\">\r" +
    "\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.evaluation\">{{'EGM.EVALUATION_STRUCTURE' | translate }}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li ng-class=\"{active: {{'projects.get.analyses'|includedByState}}}\">\r" +
    "\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.analyses.all.list\">{{'EGM.ANALYSIS' | translate }}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li ng-class=\"{active: {{'projects.get.collaborators'|includedByState}}}\">\r" +
    "\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" ui-sref=\"projects.get.collaborators.all.list\">{{'COLLABORATOR.COLLABORATOR' | translate }}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "  </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <div class=\"tab-content\" ui-view=\"content\"></div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/projects/create.html',
    "<div>\r" +
    "\n" +
    "  <form class=\"form-horizontal\" ng-submit=\"newProject.submit()\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"name\">{{'PROJECT.ATTRIBUTES.NAME' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <input class=\"form-control\" type=\"text\" name=\"name\" placeholder=\"{{'PROJECT.ATTRIBUTES.PLACEHOLDERS.NAME' | translate}}\" ng-model=\"newProject.name\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"col-sm-2 control-label\" for=\"note\">{{'PROJECT.ATTRIBUTES.NOTE' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-10\">\r" +
    "\n" +
    "        <textarea class=\"form-control\" name=\"note\" rows=\"3\" placeholder=\"{{'PROJECT.ATTRIBUTES.PLACEHOLDERS.NOTE' | translate}}\" ng-model=\"newProject.note\">&nbsp;</textarea>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <div class=\"col-sm-offset-2 col-sm-10\">\r" +
    "\n" +
    "        <input type=\"submit\" class=\"btn btn-default\" value=\"{{'ACTION.SUBMIT' | translate}}\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "  </form>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/projects/list.html',
    "<div class=\"row\">\r" +
    "\n" +
    "  <nav>\r" +
    "\n" +
    "    <form class=\"form-inline col-sm-4 col-sm-offset-8 search-control\">\r" +
    "\n" +
    "      <div class=\"input-group\">\r" +
    "\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"{{'ACTION.SEARCH' | translate}}\" ng-model=\"ctrl.query.name\" />\r" +
    "\n" +
    "        <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-search\"></span></span>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "  </nav>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<table class=\"table table-bordered\">\r" +
    "\n" +
    "  <thead>\r" +
    "\n" +
    "    <tr>\r" +
    "\n" +
    "      <th class=\"col-sm-1\">#</th>\r" +
    "\n" +
    "      <th class=\"col-sm-3\">\r" +
    "\n" +
    "        <a href ng-click=\"ctrl.changeOrder('name')\">{{'PROJECT.ATTRIBUTES.NAME' | translate}}</a>\r" +
    "\n" +
    "      </th>\r" +
    "\n" +
    "      <th class=\"col-sm-3\">\r" +
    "\n" +
    "        <a href ng-click=\"ctrl.changeOrder('createdAt')\">{{'PROJECT.ATTRIBUTES.CREATED_AT' | translate}}</a>\r" +
    "\n" +
    "      </th>\r" +
    "\n" +
    "      <th class=\"col-sm-3\">\r" +
    "\n" +
    "        <a href ng-click=\"ctrl.changeOrder('updatedAt')\">{{'PROJECT.ATTRIBUTES.UPDATED_AT' | translate}}</a>\r" +
    "\n" +
    "      </th>\r" +
    "\n" +
    "      <th class=\"col-sm-2\">{{'ACTION.ACTION' | translate}}</th>\r" +
    "\n" +
    "    </tr>\r" +
    "\n" +
    "  </thead>\r" +
    "\n" +
    "  <tbody>\r" +
    "\n" +
    "    <tr ng-repeat=\"project in ctrl.projects.toArray() | filter:ctrl.query | orderBy:ctrl.predicate:ctrl.reverse | pager:ctrl.currentPage:ctrl.itemsPerPage\">\r" +
    "\n" +
    "      <td>{{$index + 1 + ctrl.itemsPerPage * (ctrl.currentPage - 1)}}</td>\r" +
    "\n" +
    "      <td>{{project.name}}</td>\r" +
    "\n" +
    "      <td>{{project.createdAt | date:'yyyy/MM/dd HH:mm'}}</td>\r" +
    "\n" +
    "      <td>{{project.updatedAt | date:'yyyy/MM/dd HH:mm'}}</td>\r" +
    "\n" +
    "      <td><a ui-sref=\"projects.get.detail({ projectId: project.key })\">{{'ACTION.SHOW' | translate}}</a>\r" +
    "\n" +
    "    </tr>\r" +
    "\n" +
    "  </tbody>\r" +
    "\n" +
    "</table>\r" +
    "\n" +
    "<pagination total-items=\"ctrl.projects.toArray() | filter:ctrl.query | count\" page=\"ctrl.currentPage\" items-per-page=\"ctrl.itemsPerPage\"></pagination>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/projects/projects.html',
    "<div class=\"tab-pane\">\r" +
    "\n" +
    "  <h2>{{'PROJECT.PROJECTS' | translate}}</h2>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <ol class=\"breadcrumb\">\r" +
    "\n" +
    "    <li class=\"active\">{{'PROJECT.PROJECTS' | translate}}</li>\r" +
    "\n" +
    "  </ol>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <ul class=\"nav nav-tabs\">\r" +
    "\n" +
    "    <li ui-sref-active=\"active\">\r" +
    "\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" href ui-sref=\"projects.all.list\">{{'ACTION.LIST' | translate}}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "    <li ui-sref-active=\"active\">\r" +
    "\n" +
    "      <a data-target=\"ui-sref\" data-toggle=\"tab\" href ui-sref=\"projects.all.create\">{{'ACTION.NEW' | translate}}</a>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "  </ul>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <div class=\"tab-content\" ui-view=\"content\"></div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/remove-item-dialog.html',
    "<div class=\"modal-header\">\r" +
    "\n" +
    "  <h3>{{'ACTION.DIALOG.REMOVE.HEADING' | translate}}</h3>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-body\">\r" +
    "\n" +
    "  <p>\r" +
    "\n" +
    "    {{'ACTION.DIALOG.REMOVE.HEADING' | translate}}\r" +
    "\n" +
    "  </p>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-footer\">\r" +
    "\n" +
    "  <button class=\"btn btn-default\" ng-click=\"cancel()\">{{ 'ACTION.DIALOG.REMOVE.CANCEL' | translate }}</button>\r" +
    "\n" +
    "  <button class=\"btn btn-danger\" ng-click=\"ok()\">{{ 'ACTION.DIALOG.REMOVE.OK' | translate }}</button>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('/partials/setting-dialog.html',
    "<div class=\"modal-header\">\r" +
    "\n" +
    "  <h3>{{ 'EGM.APP.LAYOUT_SETTINGS' | translate }}</h3>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-body\">\r" +
    "\n" +
    "  <form class=\"form-horizontal\">\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"col-sm-4 control-label\">{{ 'EGM.APP.VIEWS.VIEWS' | translate }}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-8\">\r" +
    "\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.viewMode\" ng-value=\"ViewMode.Normal\"/>{{'EGM.APP.VIEWS.NORMAL' | translate}}</label>\r" +
    "\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.viewMode\" ng-value=\"ViewMode.Edge\"/>{{'EGM.APP.VIEWS.EDGE' | translate}}</label>\r" +
    "\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.viewMode\" ng-value=\"ViewMode.EdgeAndOriginal\"/>{{'EGM.APP.VIEWS.EDGE_AND_ORIGINAL' | translate}}</label>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"col-sm-4 control-label\">{{ 'EGM.APP.INACTIVE_NODE.INACTIVE_NODE' | translate }}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-8\">\r" +
    "\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.inactiveNode\" ng-value=\"InactiveNode.Hidden\"/>{{ 'EGM.APP.INACTIVE_NODE.HIDDEN' | translate }}</label>\r" +
    "\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.inactiveNode\" ng-value=\"InactiveNode.Transparent\"/>{{ 'EGM.APP.INACTIVE_NODE.TRANSPARENT' | translate }}</label>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"col-sm-4 control-label\">{{'EGM.APP.SCALING.SCALING' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-8\">\r" +
    "\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.scaleType\" ng-value=\"ScaleType.None\"/>{{'EGM.APP.SCALING.NONE' | translate}}</label>\r" +
    "\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.scaleType\" ng-value=\"ScaleType.Connection\"/>{{'EGM.APP.SCALING.CONNECTION' | translate}}</label>\r" +
    "\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.scaleType\" ng-value=\"ScaleType.Weight\"/>{{'EGM.APP.SCALING.WEIGHT' | translate}}</label>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"col-sm-4 control-label\">{{'EGM.APP.SCALING.MAX' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-8\">\r" +
    "\n" +
    "        <input class=\"form-control\" type=\"number\" min=\"1\" ng-model=\"options.maxScale\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"col-sm-4 control-label\">{{'EGM.APP.LINE_UP' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-8\">\r" +
    "\n" +
    "        <label class=\"checkbox\"><input type=\"checkbox\" ng-model=\"options.lineUpTop\"/>{{'EGM.UPPERMOST_EVALUATION_ITEM' | translate}}</label>\r" +
    "\n" +
    "        <label class=\"checkbox\"><input type=\"checkbox\" ng-model=\"options.lineUpBottom\"/>{{'EGM.LOWERMOST_EVALUATION_ITEM' | translate}}</label>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"col-sm-4 control-label\">{{'EGM.APP.RANK_DIRECTION.RANK_DIRECTION' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-8\">\r" +
    "\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.rankDirection\" ng-value=\"RankDirection.LR\"/>{{'EGM.APP.RANK_DIRECTION.LR' | translate}}</label>\r" +
    "\n" +
    "        <label class=\"radio\"><input type=\"radio\" ng-model=\"options.rankDirection\" ng-value=\"RankDirection.TB\"/>{{'EGM.APP.RANK_DIRECTION.TB' | translate}}</label>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"form-group\">\r" +
    "\n" +
    "      <label class=\"col-sm-4 control-label\">{{'EGM.APP.MINIMUM_WEIGHT' | translate}}</label>\r" +
    "\n" +
    "      <div class=\"col-sm-8\">\r" +
    "\n" +
    "        <input class=\"form-control\" type=\"number\" min=\"1\" ng-model=\"options.minimumWeight\"/>\r" +
    "\n" +
    "      </div>\r" +
    "\n" +
    "  </form>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-footer\">\r" +
    "\n" +
    "  <button class=\"btn btn-default\" ng-click=\"close()\">{{ 'ACTION.CLOSE' | translate }}</button>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );

}]);
