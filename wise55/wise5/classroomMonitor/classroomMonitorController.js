'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClassroomMonitorController = function () {
    function ClassroomMonitorController($filter, $mdDialog, $mdToast, $rootScope, $scope, $state, $stateParams, ConfigService, NotebookService, NotificationService, ProjectService, SessionService, TeacherDataService, TeacherWebSocketService) {
        var _this = this;

        _classCallCheck(this, ClassroomMonitorController);

        this.$filter = $filter;
        this.$mdToast = $mdToast;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.ConfigService = ConfigService;
        this.NotebookService = NotebookService;
        this.NotificationService = NotificationService;
        this.ProjectService = ProjectService;
        this.SessionService = SessionService;
        this.TeacherDataService = TeacherDataService;
        this.TeacherWebSocketService = TeacherWebSocketService;

        this.$translate = this.$filter('translate');

        this.projectTitle = this.ProjectService.getProjectTitle();
        this.runId = this.ConfigService.getRunId();

        this.numberProject = true; // TODO: make dynamic or remove

        this.menuOpen = false; // boolean to indicate whether monitor nav menu is open
        this.showSideMenu = true; // boolean to indicate whether to show the monitor side menu
        this.showToolbar = true; // boolean to indicate whether to show the monitor toolbar
        this.showStepTools = false; // boolean to indicate whether to show the step toolbar

        // ui-views and their corresponding names, labels, and icons
        this.views = {
            'root.dashboard': {
                name: this.$translate('dashboardView'),
                label: this.$translate('dashboardViewLabel'),
                icon: 'dashboard',
                type: 'primary',
                active: false
            },
            'root.nodeProgress': {
                name: this.$translate('projectView'),
                label: this.$translate('projectViewLabel'),
                icon: 'assignment_turned_in',
                type: 'primary',
                active: true
            },
            'root.studentProgress': {
                name: this.$translate('studentView'),
                label: this.$translate('studentViewLabel'),
                icon: 'people',
                type: 'primary',
                active: true
            },
            'root.notebooks': {
                name: this.$translate('notebookView'),
                label: this.$translate('notebookViewLabel'),
                icon: 'chrome_reader_mode',
                type: 'primary',
                active: this.NotebookService.isNotebookEnabled()
            },
            'root.export': {
                name: this.$translate('exportView'),
                label: this.$translate('exportViewLabel'),
                icon: 'file_download',
                type: 'secondary',
                active: true
            },
            'root.notes': {
                name: this.$translate('notesTipsView'),
                label: this.$translate('notesTipsViewLabel'),
                icon: 'speaker_notes',
                type: 'secondary',
                active: false
            },
            'root.milestones': {
                name: this.$translate('milestonesView'),
                label: this.$translate('milestonesViewLabel'),
                icon: 'flag',
                type: 'primary',
                active: true
            }
        };

        // build server disconnect display
        this.connectionLostDisplay = this.$mdToast.build({
            template: '<md-toast>\n                        <span>{{ \'ERROR_CHECK_YOUR_INTERNET_CONNECTION\' | translate }}</span>\n                      </md-toast>',
            hideDelay: 0
        });
        this.connectionLostShown = false;

        // alert user when inactive for a long time
        this.$scope.$on('showSessionWarning', function () {
            // Appending dialog to document.body
            var confirm = $mdDialog.confirm().parent(angular.element(document.body)).title(_this.$translate('SESSION_TIMEOUT')).content(_this.$translate('SESSION_TIMEOUT_MESSAGE')).ariaLabel(_this.$translate('SESSION_TIMEOUT')).ok(_this.$translate('YES')).cancel(_this.$translate('NO'));
            $mdDialog.show(confirm).then(function () {
                _this.SessionService.renewSession();
            }, function () {
                _this.SessionService.forceLogOut();
            });
        });

        // alert user when server is going to be updated
        this.$scope.$on('showRequestLogout', function (ev) {
            var alert = $mdDialog.confirm().parent(angular.element(document.body)).title(translations.serverUpdate).textContent(_this.$translate('serverUpdateRequestLogoutMessage')).ariaLabel(_this.$translate('serverUpdate')).targetEvent(ev).ok(_this.$translate('ok'));

            $mdDialog.show(alert).then(function () {
                // do nothing
            }, function () {
                // do nothing
            });
        });

        // listen for state change events
        this.$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            // close the menu when the state changes
            _this.menuOpen = false;

            _this.processUI();
        });

        // alert user when server loses connection
        this.$scope.$on('serverDisconnected', function () {
            _this.handleServerDisconnect();
        });

        // remove alert when server regains connection
        this.$scope.$on('serverConnected', function () {
            _this.handleServerReconnect();
        });

        // TODO: make dynamic, set somewhere like in config?
        this.logoPath = this.ProjectService.getThemePath() + '/images/WISE-logo-ffffff.svg';

        this.processUI();

        this.themePath = this.ProjectService.getThemePath();

        this.notifications = this.NotificationService.notifications;

        // save event when classroom monitor session is started
        var context = "ClassroomMonitor",
            nodeId = null,
            componentId = null,
            componentType = null,
            category = "Navigation",
            event = "sessionStarted",
            data = {};
        this.TeacherDataService.saveEvent(context, nodeId, componentId, componentType, category, event, data);
    }

    /**
     * Update UI items based on state, show or hide relevant menus and toolbars
     * TODO: remove/rework this and put items in their own ui states?
     */


    _createClass(ClassroomMonitorController, [{
        key: 'processUI',
        value: function processUI() {
            var viewName = this.$state.$current.name;
            this.currentViewName = this.views[viewName].name;

            if (viewName === 'root.nodeProgress') {
                var nodeId = this.$state.params.nodeId;
                this.showStepTools = this.ProjectService.isApplicationNode(nodeId);
            } else {
                this.showStepTools = false;
            }
        }
    }, {
        key: 'toggleMenu',


        /**
         * Toggle the classroom monitor main menu
         */
        value: function toggleMenu() {
            this.menuOpen = !this.menuOpen;
        }

        /**
         * The user has moved the mouse so we will notify the Session Service
         * so that it can refresh the session
         */

    }, {
        key: 'mouseMoved',
        value: function mouseMoved() {
            /*
             * notify the Session Service that the user has moved the mouse
             * so we can refresh the session
             */
            this.SessionService.mouseMoved();
        }

        // show server error alert when connection is lost

    }, {
        key: 'handleServerDisconnect',
        value: function handleServerDisconnect() {
            if (!this.connectionLostShown) {
                this.$mdToast.show(this.connectionLostDisplay);
                this.connectionLostShown = true;
            }
        }

        // hide server error alert when connection is restored

    }, {
        key: 'handleServerReconnect',
        value: function handleServerReconnect() {
            this.$mdToast.hide(this.connectionLostDisplay);
            this.connectionLostShown = false;
        }
    }]);

    return ClassroomMonitorController;
}();

ClassroomMonitorController.$inject = ['$filter', '$mdDialog', '$mdToast', '$rootScope', '$scope', '$state', '$stateParams', 'ConfigService', 'NotebookService', 'NotificationService', 'ProjectService', 'SessionService', 'TeacherDataService', 'TeacherWebSocketService'];

exports.default = ClassroomMonitorController;
//# sourceMappingURL=classroomMonitorController.js.map