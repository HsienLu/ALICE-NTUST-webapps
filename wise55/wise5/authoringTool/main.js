'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
require("../themes/default/js/webfonts");
var _jquery = _interopRequireDefault(require("jquery"));
var _angular = _interopRequireDefault(require("angular"));
var _angularDragula = _interopRequireDefault(require("angular-dragula"));
var _ngFileUpload = _interopRequireDefault(require("ng-file-upload"));
var _highchartsNg = _interopRequireDefault(require("highcharts-ng"));
var _angularUiRouter = _interopRequireDefault(require("angular-ui-router"));
var _angularMaterial = _interopRequireDefault(require("angular-material"));
var _angularMoment = _interopRequireDefault(require("angular-moment"));
var _angularSanitize = _interopRequireDefault(require("angular-sanitize"));
var _toArrayFilter = _interopRequireDefault(require("lib/angular-toArrayFilter/toArrayFilter"));
var _angularTranslate = _interopRequireDefault(require("angular-translate"));
var _angularTranslateLoaderPartial = _interopRequireDefault(require("angular-translate-loader-partial"));
var _angularWebsocket = _interopRequireDefault(require("angular-websocket"));
var _annotationService = _interopRequireDefault(require("../services/annotationService"));
var _audioOscillatorComponentModule = _interopRequireDefault(require("../components/audioOscillator/audioOscillatorComponentModule"));
var _authoringToolComponents = _interopRequireDefault(require("./authoringToolComponents"));
var _authoringToolController = _interopRequireDefault(require("./authoringToolController"));
var _authoringToolMainController = _interopRequireDefault(require("./main/authoringToolMainController"));
var _authoringToolNewProjectController = _interopRequireDefault(require("./main/authoringToolNewProjectController"));
var _authorNotebookController = _interopRequireDefault(require("./notebook/authorNotebookController"));
var _authorWebSocketService = _interopRequireDefault(require("../services/authorWebSocketService"));
var _conceptMapComponentModule = _interopRequireDefault(require("../components/conceptMap/conceptMapComponentModule"));
var _configService = _interopRequireDefault(require("../services/configService"));
var _cRaterService = _interopRequireDefault(require("../services/cRaterService"));
var _components = _interopRequireDefault(require("../directives/components"));
var _discussionComponentModule = _interopRequireDefault(require("../components/discussion/discussionComponentModule"));
var _drawComponentModule = _interopRequireDefault(require("../components/draw/drawComponentModule"));
var _embeddedComponentModule = _interopRequireDefault(require("../components/embedded/embeddedComponentModule"));
var _filters = _interopRequireDefault(require("../filters/filters"));
var _highcharts = _interopRequireDefault(require("../lib/highcharts@4.2.1"));
var _graphComponentModule = _interopRequireDefault(require("../components/graph/graphComponentModule"));
var _htmlComponentModule = _interopRequireDefault(require("../components/html/htmlComponentModule"));
var _labelComponentModule = _interopRequireDefault(require("../components/label/labelComponentModule"));
var _matchComponentModule = _interopRequireDefault(require("../components/match/matchComponentModule"));
var _multipleChoiceComponentModule = _interopRequireDefault(require("../components/multipleChoice/multipleChoiceComponentModule"));
var _nodeAuthoringController = _interopRequireDefault(require("./node/nodeAuthoringController"));
var _nodeService = _interopRequireDefault(require("../services/nodeService"));
var _notebook = _interopRequireDefault(require("../directives/notebook/notebook"));
var _notebookService = _interopRequireDefault(require("../services/notebookService"));
var _notificationService = _interopRequireDefault(require("../services/notificationService"));
var _openResponseComponentModule = _interopRequireDefault(require("../components/openResponse/openResponseComponentModule"));
var _outsideURLComponentModule = _interopRequireDefault(require("../components/outsideURL/outsideURLComponentModule"));
var _projectAssetController = _interopRequireDefault(require("./asset/projectAssetController"));
var _projectAssetService = _interopRequireDefault(require("../services/projectAssetService"));
var _projectController = _interopRequireDefault(require("./project/projectController"));
var _projectHistoryController = _interopRequireDefault(require("./history/projectHistoryController"));
var _projectInfoController = _interopRequireDefault(require("./info/projectInfoController"));
var _projectService = _interopRequireDefault(require("../services/projectService"));
var _sessionService = _interopRequireDefault(require("../services/sessionService"));
var _studentAssetService = _interopRequireDefault(require("../services/studentAssetService"));
var _studentDataService = _interopRequireDefault(require("../services/studentDataService"));
var _studentStatusService = _interopRequireDefault(require("../services/studentStatusService"));
var _studentWebSocketService = _interopRequireDefault(require("../services/studentWebSocketService"));
var _tableComponentModule = _interopRequireDefault(require("../components/table/tableComponentModule"));
var _teacherDataService = _interopRequireDefault(require("../services/teacherDataService"));
var _teacherWebSocketService = _interopRequireDefault(require("../services/teacherWebSocketService"));
var _utilService = _interopRequireDefault(require("../services/utilService"));
var _wiseLinkAuthoringController = _interopRequireDefault(require("./wiseLink/wiseLinkAuthoringController"));
var _angularSummernote = _interopRequireDefault(require("lib/angular-summernote/dist/angular-summernote.min"));
var _env = _interopRequireDefault(require("../env"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var authoringModule = _angular["default"].module('authoring', [(0, _angularDragula["default"])(_angular["default"]), 'angularMoment', 'angular-toArrayFilter', 'audioOscillatorComponentModule', 'authoringTool.components', 'components', 'conceptMapComponentModule', 'discussionComponentModule', 'drawComponentModule', 'embeddedComponentModule', 'filters', 'graphComponentModule', 'highcharts-ng', 'htmlComponentModule', 'labelComponentModule', 'matchComponentModule', 'multipleChoiceComponentModule', 'ngAnimate', 'ngAria', 'ngFileUpload', 'ngMaterial', 'ngSanitize', 'ngWebSocket', 'notebook', 'openResponseComponentModule', 'outsideURLComponentModule', 'pascalprecht.translate', 'summernote', 'tableComponentModule', 'ui.router']).constant('API_URL', _env["default"]).service(_annotationService["default"].name, _annotationService["default"]).service(_authorWebSocketService["default"].name, _authorWebSocketService["default"]).service(_configService["default"].name, _configService["default"]).service(_cRaterService["default"].name, _cRaterService["default"]).service(_nodeService["default"].name, _nodeService["default"]).service(_notebookService["default"].name, _notebookService["default"]).service(_notificationService["default"].name, _notificationService["default"]).service(_projectService["default"].name, _projectService["default"]).service(_projectAssetService["default"].name, _projectAssetService["default"]).service(_sessionService["default"].name, _sessionService["default"]).service(_studentAssetService["default"].name, _studentAssetService["default"]).service(_studentDataService["default"].name, _studentDataService["default"]).service(_studentStatusService["default"].name, _studentStatusService["default"]).service(_studentWebSocketService["default"].name, _studentWebSocketService["default"]).service(_teacherDataService["default"].name, _teacherDataService["default"]).service(_teacherWebSocketService["default"].name, _teacherWebSocketService["default"]).service(_utilService["default"].name, _utilService["default"]).controller(_authoringToolController["default"].name, _authoringToolController["default"]).controller(_authoringToolMainController["default"].name, _authoringToolMainController["default"]).controller(_authoringToolNewProjectController["default"].name, _authoringToolNewProjectController["default"]).controller(_authorNotebookController["default"].name, _authorNotebookController["default"]).controller(_nodeAuthoringController["default"].name, _nodeAuthoringController["default"]).controller(_projectAssetController["default"].name, _projectAssetController["default"]).controller(_projectController["default"].name, _projectController["default"]).controller(_projectHistoryController["default"].name, _projectHistoryController["default"]).controller(_projectInfoController["default"].name, _projectInfoController["default"]).controller(_wiseLinkAuthoringController["default"].name, _wiseLinkAuthoringController["default"]).config(['$urlRouterProvider', '$stateProvider', '$translateProvider', '$translatePartialLoaderProvider', '$controllerProvider', '$mdThemingProvider', function ($urlRouterProvider, $stateProvider, $translateProvider, $translatePartialLoaderProvider, $controllerProvider, $mdThemingProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('root', {
    url: '',
    "abstract": true,
    templateUrl: 'wise5/authoringTool/authoringTool.html',
    controller: 'AuthoringToolController',
    controllerAs: 'authoringToolController',
    resolve: {}
  }).state('root.main', {
    url: '/',
    templateUrl: 'wise5/authoringTool/main/main.html',
    controller: 'AuthoringToolMainController',
    controllerAs: 'authoringToolMainController',
    resolve: {
      config: function config(ConfigService) {
        var configURL = window.configURL;
        return ConfigService.retrieveConfig(configURL);
      },
      language: function language($translate, ConfigService, config) {
        var locale = ConfigService.getLocale(); // defaults to "en"
        $translate.use(locale);
      },
      sessionTimers: function sessionTimers(SessionService, config) {
        return SessionService.initializeSession();
      }
    }
  }).state('root.new', {
    url: '/new',
    templateUrl: 'wise5/authoringTool/main/new.html',
    controller: 'AuthoringToolNewProjectController',
    controllerAs: 'authoringToolNewProjectController',
    resolve: {
      config: function config(ConfigService) {
        var configURL = window.configURL;
        return ConfigService.retrieveConfig(configURL);
      },
      language: function language($translate, ConfigService, config) {
        var locale = ConfigService.getLocale(); // defaults to "en"
        $translate.use(locale);
      },
      sessionTimers: function sessionTimers(SessionService, config) {
        return SessionService.initializeSession();
      }
    }
  }).state('root.project', {
    url: '/project/:projectId',
    templateUrl: 'wise5/authoringTool/project/project.html',
    controller: 'ProjectController',
    controllerAs: 'projectController',
    resolve: {
      projectConfig: function projectConfig(ConfigService, $stateParams) {
        var configURL = window.configURL + '/' + $stateParams.projectId;
        return ConfigService.retrieveConfig(configURL);
      },
      project: function project(ProjectService, projectConfig) {
        return ProjectService.retrieveProject();
      },
      projectAssets: function projectAssets(ProjectAssetService, projectConfig, project) {
        return ProjectAssetService.retrieveProjectAssets();
      },
      language: function language($translate, ConfigService, projectConfig) {
        var locale = ConfigService.getLocale(); // defaults to "en"
        $translate.use(locale);
      },
      sessionTimers: function sessionTimers(SessionService, projectConfig) {
        return SessionService.initializeSession();
      },
      webSocket: function webSocket(AuthorWebSocketService, projectConfig) {
        return AuthorWebSocketService.initialize();
      }
    }
  }).state('root.project.node', {
    url: '/node/:nodeId',
    templateUrl: 'wise5/authoringTool/node/node.html',
    controller: 'NodeAuthoringController',
    controllerAs: 'nodeAuthoringController',
    resolve: {
      load: function load() {}
    }
  }).state('root.project.asset', {
    url: '/asset',
    templateUrl: 'wise5/authoringTool/asset/asset.html',
    controller: 'ProjectAssetController',
    controllerAs: 'projectAssetController',
    resolve: {}
  }).state('root.project.info', {
    url: '/info',
    templateUrl: 'wise5/authoringTool/info/info.html',
    controller: 'ProjectInfoController',
    controllerAs: 'projectInfoController',
    resolve: {}
  }).state('root.project.history', {
    url: '/history',
    templateUrl: 'wise5/authoringTool/history/history.html',
    controller: 'ProjectHistoryController',
    controllerAs: 'projectHistoryController',
    resolve: {}
  }).state('root.project.notebook', {
    url: '/notebook',
    templateUrl: 'wise5/authoringTool/notebook/notebook.html',
    controller: 'AuthorNotebookController',
    controllerAs: 'authorNotebookController',
    resolve: {}
  });

  // Set up Translations
  $translatePartialLoaderProvider.addPart('i18n');
  $translatePartialLoaderProvider.addPart('authoringTool/i18n');
  $translateProvider.useLoader('$translatePartialLoader', {
    urlTemplate: 'wise5/{part}/i18n_{lang}.json'
  }).fallbackLanguage(['en']).registerAvailableLanguageKeys(['el', 'en', 'es', 'ja', 'ko', 'pt', 'tr', 'zh_CN', 'zh_TW'], {
    'en_US': 'en',
    'en_UK': 'en'
  }).determinePreferredLanguage().useSanitizeValueStrategy('sanitizeParameters', 'escape');

  // ngMaterial default theme configuration
  /*$mdThemingProvider.definePalette('primary', {
      '50': 'e1f0f4',
      '100': 'b8dbe4',
      '200': '8ec6d4',
      '300': '5faec2',
      '400': '3d9db5',
      '500': '1c8ca8',
      '600': '197f98',
      '700': '167188',
      '800': '136377',
      '900': '0e4957',
      'A100': 'abf3ff',
      'A200': '66e2ff',
      'A400': '17bee5',
      'A700': '00A1C6',
      'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                          // on this palette should be dark or light
      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
          '200', '300', 'A100'],
      'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });*/

  $mdThemingProvider.definePalette('accent', {
    '50': 'fde9e6',
    '100': 'fbcbc4',
    '200': 'f8aca1',
    '300': 'f4897b',
    '400': 'f2705f',
    '500': 'f05843',
    '600': 'da503c',
    '700': 'c34736',
    '800': 'aa3e2f',
    '900': '7d2e23',
    'A100': 'ff897d',
    'A200': 'ff7061',
    'A400': 'ff3829',
    'A700': 'cc1705',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50', '100', '200', '300', 'A100'],
    'contrastLightColors': undefined
  });
  $mdThemingProvider.theme('default').primaryPalette('deep-purple', {
    'default': '400'
  }).accentPalette('accent', {
    'default': '500'
  }).warnPalette('red', {
    'default': '800'
  });
  var lightMap = $mdThemingProvider.extendPalette('grey', {
    'A100': 'ffffff'
  });
  $mdThemingProvider.definePalette('light', lightMap);
  $mdThemingProvider.theme('light').primaryPalette('light', {
    'default': 'A100'
  }).accentPalette('pink', {
    'default': '900'
  });
  $mdThemingProvider.setDefaultTheme('default');
}]);
var _default = exports["default"] = authoringModule;