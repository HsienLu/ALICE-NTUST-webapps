'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VLEController = function () {
    function VLEController($scope, $rootScope, $filter, $mdDialog, $mdMenu, $state, AnnotationService, ConfigService, NotebookService, NotificationService, ProjectService, SessionService, StudentDataService, UtilService) {
        var _this = this;

        _classCallCheck(this, VLEController);

        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$filter = $filter;
        this.$mdDialog = $mdDialog;
        this.$mdMenu = $mdMenu;
        this.$state = $state;
        this.AnnotationService = AnnotationService;
        this.ConfigService = ConfigService;
        this.NotebookService = NotebookService;
        this.NotificationService = NotificationService;
        this.ProjectService = ProjectService;
        this.SessionService = SessionService;
        this.StudentDataService = StudentDataService;
        this.UtilService = UtilService;

        this.$translate = this.$filter('translate');

        this.workgroupId = this.ConfigService.getWorkgroupId();
        this.currentNode = null;
        this.pauseDialog = null;
        this.noteDialog = null;

        this.navFilters = this.ProjectService.getFilters();
        this.navFilter = this.navFilters[0].name;

        this.projectStyle = this.ProjectService.getStyle();
        this.projectName = this.ProjectService.getProjectTitle();

        // get the total score for the workgroup
        this.totalScore = this.StudentDataService.getTotalScore();

        // get the max score for the project
        this.maxScore = this.ProjectService.getMaxScore();

        this.notebookEnabled = this.NotebookService.isNotebookEnabled();

        // get the notebook config
        this.notebookConfig = this.NotebookService.getNotebookConfig();
        // Get report, if enabled; assume only one report for now
        this.reportItem = this.notebookConfig.itemTypes.report.notes[0];

        // whether constraints have been disabled
        this.constraintsDisabled = false;

        if (this.ConfigService.getConfigParam('constraints') == false) {
            // constraints are disabled
            this.constraintsDisabled = true;
        }

        // load project-level scripts, if any
        var script = this.ProjectService.getProjectScript();
        if (script != null) {
            this.ProjectService.retrieveScript(script).then(function (script) {
                new Function(script).call(_this);
            });
        }

        this.$scope.$on('currentNodeChanged', function (event, args) {
            var previousNode = args.previousNode;
            var currentNode = _this.StudentDataService.getCurrentNode();
            var currentNodeId = currentNode.id;

            _this.StudentDataService.updateStackHistory(currentNodeId);
            _this.StudentDataService.updateVisitedNodesHistory(currentNodeId);

            //this.AnnotationService.updateAnnotations();

            _this.$state.go('root.vle', { nodeId: currentNodeId });

            var componentId, componentType, category, eventName, eventData, eventNodeId;
            if (previousNode != null && _this.ProjectService.isGroupNode(previousNode.id)) {
                // going from group to node or group to group
                componentId = null;
                componentType = null;
                category = "Navigation";
                eventName = "nodeExited";
                eventData = {
                    nodeId: previousNode.id
                };
                eventNodeId = previousNode.id;
                _this.StudentDataService.saveVLEEvent(eventNodeId, componentId, componentType, category, eventName, eventData);
            }

            if (_this.ProjectService.isGroupNode(currentNodeId)) {
                // save nodeEntered event if this is a group
                componentId = null;
                componentType = null;
                category = "Navigation";
                eventName = "nodeEntered";
                eventData = {
                    nodeId: currentNode.id
                };
                eventNodeId = currentNode.id;
                _this.StudentDataService.saveVLEEvent(eventNodeId, componentId, componentType, category, eventName, eventData);
            }
        });

        this.notifications = this.NotificationService.notifications;
        // watch for changes in notifications
        this.$scope.$watch(function () {
            return _this.NotificationService.notifications.length;
        }, function (newValue, oldValue) {
            _this.notifications = _this.NotificationService.notifications;
            _this.newNotifications = _this.getNewNotifications();
        });

        this.$scope.$on('notificationChanged', function (event, notification) {
            // update new notifications
            _this.notifications = _this.NotificationService.notifications;
            _this.newNotifications = _this.getNewNotifications();
        });

        this.$scope.$on('componentStudentDataChanged', function () {
            _this.StudentDataService.updateNodeStatuses();
        });

        // listen for the pause screen event
        this.$scope.$on('pauseScreen', function (event, args) {
            _this.pauseScreen();
        });

        // listen for the unpause screen event
        this.$scope.$on('unPauseScreen', function (event, args) {
            _this.unPauseScreen();
        });

        this.$scope.$on('requestImageCallback', function (event, args) {

            // initialize the snippable items
            if (_this.snippableItems == null) {
                _this.snippableItems = [];
            }

            if (args.imageObject != null) {
                // add the image object as a snippable item
                _this.snippableItems.push(args.imageObject);
            }

            if (args.imageObjects != null) {

                // loop through the image objects
                for (var i = 0; i < args.imageObjects.length; i++) {

                    var imageObject = args.imageObjects[i];

                    if (imageObject != null) {
                        // add the image object as a snippable item
                        _this.snippableItems.push(imageObject);
                    }
                }
            }
        });

        // Make sure if we drop something on the page we don't navigate away
        // https://developer.mozilla.org/En/DragDrop/Drag_Operations#drop
        $(document.body).on('dragover', function (e) {
            e.preventDefault();
            return false;
        });

        $(document.body).on('drop', function (e) {
            e.preventDefault();
            return false;
        });

        this.themePath = this.ProjectService.getThemePath();
        this.notebookItemPath = this.themePath + '/notebook/notebookItem.html';

        var nodeId = null;
        var stateParams = null;
        var stateParamNodeId = null;

        if (this.$state != null) {
            stateParams = this.$state.params;
        }

        if (stateParams != null) {
            stateParamNodeId = stateParams.nodeId;
        }

        if (stateParamNodeId != null && stateParamNodeId !== '') {
            nodeId = stateParamNodeId;
        } else {
            /*
             * get the node id for the latest node entered event for an active
             * node that exists in the project
             */
            nodeId = this.StudentDataService.getLatestNodeEnteredEventNodeIdWithExistingNode();
        }

        if (nodeId == null || nodeId === '') {
            nodeId = this.ProjectService.getStartNodeId();
        }

        this.StudentDataService.setCurrentNodeByNodeId(nodeId);

        // get the run status to see if the period is currently paused
        var runStatus = this.StudentDataService.getRunStatus();

        if (runStatus != null) {
            var pause = false;

            // get the signed in user's period id
            var periodId = this.ConfigService.getPeriodId();

            if (periodId != null) {
                var periods = runStatus.periods;

                if (periods != null) {

                    // loop through all the periods in the run status
                    for (var p = 0; p < periods.length; p++) {
                        var tempPeriod = periods[p];

                        if (periodId === tempPeriod.periodId) {
                            if (tempPeriod.paused) {
                                // our period is paused so we will pause the screen
                                pause = true;
                                break;
                            }
                        }
                    }
                }
            }

            if (pause) {
                this.pauseScreen();
            }
        }
    }

    // TODO: remove and use inline clipping (with guidance)


    _createClass(VLEController, [{
        key: 'snipNewNote',
        value: function snipNewNote($event) {
            // Ask all of the components on the page for snippable items
            var templateUrl = this.themePath + '/notebook/contentSnipper.html';

            var currentNodeId = this.StudentDataService.getCurrentNodeId();
            var currentComponents = this.ProjectService.getComponentsByNodeId(currentNodeId);

            /*
             * initialize the snippable items array that will become populated
             * with snippable items
             */
            this.snippableItems = [];

            for (var c = 0; c < currentComponents.length; c++) {
                var currentComponent = currentComponents[c];
                var args = {};
                args.nodeId = currentNodeId;
                args.componentId = currentComponent.id;

                this.$rootScope.$broadcast('requestImage', args);
            }
            this.$mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: $event,
                templateUrl: templateUrl,
                clickOutsideToClose: true,
                locals: {
                    snippableItems: this.snippableItems
                },
                controller: NotebookContentSnippetController,
                controllerAs: 'notebookContentSnippetController',
                bindToController: true
            });
            function NotebookContentSnippetController($rootScope, $scope, $mdDialog, snippableItems, NotebookService, StudentDataService, ProjectService) {
                $scope.NotebookService = NotebookService;
                $scope.StudentDataService = StudentDataService;
                $scope.ProjectService = ProjectService;
                $scope.snippableItems = snippableItems;

                // loop through the snippable items
                for (var s = 0; s < snippableItems.length; s++) {
                    var snippableItem = snippableItems[s];

                    if (snippableItem != null) {
                        /*
                         * create a local browser URL for the snippable item so
                         * we can display it as an image
                         */
                        snippableItem.url = URL.createObjectURL(snippableItem);
                    }
                }

                $scope.close = function () {
                    $mdDialog.hide();
                };
                $scope.chooseSnippet = function (snippableItem) {

                    // add the snippable item
                    $scope.NotebookService.addNewItem($event, snippableItem);

                    $mdDialog.hide();
                };
            }

            NotebookContentSnippetController.$inject = ["$rootScope", "$scope", "$mdDialog", "snippableItems", "NotebookService", "StudentDataService", "ProjectService"];
        }
    }, {
        key: 'goHome',
        value: function goHome() {
            // save goHome event
            var nodeId = null;
            var componentId = null;
            var componentType = null;
            var category = "Navigation";
            var event = "goHomeButtonClicked";
            var eventData = {};
            this.StudentDataService.saveVLEEvent(nodeId, componentId, componentType, category, event, eventData);

            this.$rootScope.$broadcast('goHome');
        }
    }, {
        key: 'logOut',
        value: function logOut() {
            // save logOut event
            var nodeId = null;
            var componentId = null;
            var componentType = null;
            var category = "Navigation";
            var event = "logOutButtonClicked";
            var eventData = {};
            this.StudentDataService.saveVLEEvent(nodeId, componentId, componentType, category, event, eventData);

            this.$rootScope.$broadcast('logOut');
        }
    }, {
        key: 'loadRoot',
        value: function loadRoot() {
            this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(this.ProjectService.rootNode.id);
        }
    }, {
        key: 'mouseMoved',


        /**
         * The user moved the mouse on the page
         */
        value: function mouseMoved() {
            // tell the session service a mouse event occurred
            // so it can reset the session timeout timers
            this.SessionService.mouseEventOccurred();
        }
    }, {
        key: 'hasNewNotifications',


        /**
         * Returns true iff there are new notifications
         */
        value: function hasNewNotifications() {
            return this.newNotifications.length > 0;
        }

        /**
         * Returns true iff there are new notifications of type 'ambient'
         */

    }, {
        key: 'hasNewAmbientNotifications',
        value: function hasNewAmbientNotifications() {
            return this.getNewAmbientNotifications().length > 0;
        }

        /**
         * Returns all notifications that have not been dismissed yet
         * The newNotifications is an array of notification aggregate objects that looks like this:
         * [
         *  {
         *    "nodeId": "node2",
         *    "type": "DiscussionReply",   // ["DiscussionReply", "teacherToStudent"]
         *    "notifications": [{ id: 1117} , { id: 1120 }]      // array of actual undismissed notifications with this nodeId and type
         *  },
         *  ...
         * ]
         * The annotation aggregates will be sorted by latest first -> oldest last
         */

    }, {
        key: 'getNewNotifications',
        value: function getNewNotifications() {
            var newNotificationAggregates = [];
            // get activeNotifications
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.notifications[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var notification = _step.value;

                    if (notification.timeDismissed == null) {
                        // go through all the undimissed notifications and populate the newNotifications array
                        var notificationNodeId = notification.nodeId;
                        var notificationType = notification.type;
                        var newNotificationForNodeIdAndTypeExists = false;
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = newNotificationAggregates[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var _newNotificationAggregate = _step2.value;

                                if (_newNotificationAggregate.nodeId == notificationNodeId && _newNotificationAggregate.type == notificationType) {
                                    newNotificationForNodeIdAndTypeExists = true;
                                    _newNotificationAggregate.notifications.push(notification);
                                    // update latestNotificationTimestamp if needed
                                    if (notification.timeGenerated > _newNotificationAggregate.latestNotificationTimestamp) {
                                        _newNotificationAggregate.latestNotificationTimestamp = notification.timeGenerated;
                                    }
                                }
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }

                        var notebookItemId = null; // if this notification was created because teacher commented on a notebook report.
                        if (!newNotificationForNodeIdAndTypeExists) {
                            var message = "";
                            if (notificationType === "DiscussionReply") {
                                message = this.$translate('newRepliesOnDiscussionPost');
                            } else if (notificationType === "teacherToStudent") {
                                message = this.$translate('newFeedbackFromTeacher');
                                if (notification.data != null) {
                                    if (typeof notification.data === 'string') {
                                        notification.data = angular.fromJson(notification.data);
                                    }

                                    if (notification.data.annotationId != null) {
                                        var annotation = this.AnnotationService.getAnnotationById(notification.data.annotationId);
                                        if (annotation != null && annotation.notebookItemId != null) {
                                            notebookItemId = annotation.notebookItemId;
                                        }
                                    }
                                }
                            } else if (notificationType === "CRaterResult") {
                                message = this.$translate('newFeedback');
                            }
                            var newNotificationAggregate = {
                                latestNotificationTimestamp: notification.timeGenerated,
                                message: message,
                                nodeId: notificationNodeId,
                                notebookItemId: notebookItemId,
                                notifications: [notification],
                                type: notificationType
                            };
                            newNotificationAggregates.push(newNotificationAggregate);
                        }
                    }
                }

                // now sort the aggregates by latestNotificationTimestamp, latest -> oldest
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            newNotificationAggregates.sort(function (n1, n2) {
                return n2.latestNotificationTimestamp - n1.latestNotificationTimestamp;
            });
            return newNotificationAggregates;
        }

        /**
         * Returns all ambient notifications that have not been dismissed yet
         */

    }, {
        key: 'getNewAmbientNotifications',
        value: function getNewAmbientNotifications() {
            return this.notifications.filter(function (notification) {
                var isAmbient = notification.data ? notification.data.isAmbient : false;
                return notification.timeDismissed == null && isAmbient;
            });
        }

        /**
         * Dismiss the specified notification
         * @param notification
         */

    }, {
        key: 'dismissNotification',
        value: function dismissNotification(event, notification) {
            if (notification.data == null || notification.data.dismissCode == null) {
                // no dismiss code needed, so we can dismiss it
                this.NotificationService.dismissNotification(notification);
            } else {
                // ask user to input dimiss code before dimissing it
                var args = {
                    event: event,
                    notification: notification
                };
                this.$rootScope.$broadcast('viewCurrentAmbientNotification', args);

                // hide any open menus (i.e. the notifications menu)
                this.$mdMenu.hide();
            }
        }

        /**
         * View the most recent ambient notification and allow teacher to input
         * dismiss code
         */

    }, {
        key: 'viewCurrentAmbientNotification',
        value: function viewCurrentAmbientNotification(event) {
            var ambientNotifications = this.getNewAmbientNotifications();
            if (ambientNotifications.length) {
                var currentNotification = ambientNotifications[0];
                var args = {};
                args.event = event;
                args.notification = currentNotification;
                this.$rootScope.$broadcast('viewCurrentAmbientNotification', args);
            }
        }

        /**
         * Dismiss the notification aggregate object, which effectively dismisses all notifications
         * for the nodeId and type of the aggregate object.
         * @param event
         * @param notificationAggregate
         */

    }, {
        key: 'dismissNotificationAggregate',
        value: function dismissNotificationAggregate(event, notificationAggregate) {
            if (notificationAggregate != null && notificationAggregate.notifications != null) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = notificationAggregate.notifications[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var notification = _step3.value;

                        this.dismissNotification(event, notification);
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }
        }
    }, {
        key: 'dismissNotificationAggregateAndVisitNode',


        /**
         * Dismiss the specified notification aggregate object and visit the node
         * @param notificationAggregate, which contains nodeId, type, and notifications of that nodeId and type
         */
        value: function dismissNotificationAggregateAndVisitNode(event, notificationAggregate) {
            if (notificationAggregate != null && notificationAggregate.notifications != null) {
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = notificationAggregate.notifications[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var notification = _step4.value;

                        if (notification.data == null || notification.data.dismissCode == null) {
                            // only dismiss notifications that don't require a dismiss code, but still allow them to move to the node
                            this.dismissNotification(event, notification);
                        }
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }
            }

            var goToNodeId = notificationAggregate.nodeId;
            var notebookItemId = notificationAggregate.notebookItemId;
            if (goToNodeId != null) {
                this.StudentDataService.endCurrentNodeAndSetCurrentNodeByNodeId(goToNodeId);
            } else if (notebookItemId != null) {
                // assume notification with notebookItemId is for the report for now,
                // as we don't currently support annotations on notes

                // show report annotations
                this.$rootScope.$broadcast('showReportAnnotations', { ev: event });

                /*let notebookItem = this.NotebookService.getNotebookItemByNotebookItemId(notebookItemId, this.workgroupId);
                if (notebookItem != null) {
                        if (notebookItem.type === "note") {
                        // open note view
                        this.$rootScope.$broadcast('setNotebookFilter', {filter: "note", ev: event});
                        this.$rootScope.$broadcast('toggleNotebook', {ev: event, open: true});
                    } else if (notebookItem.type === "report") {
                        // open report view
                        this.$rootScope.$broadcast('setNotebookFilter', {filter: "report", ev: event});
                        this.$rootScope.$broadcast('toggleNotebook', {ev: event, open: true});
                    }
                }*/
            }
        }

        /**
         * Pause the screen
         */

    }, {
        key: 'pauseScreen',
        value: function pauseScreen() {
            // TODO: i18n
            this.pauseDialog = this.$mdDialog.show({
                template: '<md-dialog aria-label="Screen Paused"><md-dialog-content><div class="md-dialog-content">' + this.$translate('yourTeacherHasPausedAllTheScreensInTheClass') + '</div></md-dialog-content></md-dialog>',
                escapeToClose: false
            });
        }

        /**
         * Unpause the screen
         */

    }, {
        key: 'unPauseScreen',
        value: function unPauseScreen() {
            this.$mdDialog.hide(this.pauseDialog, "finished");
            this.pauseDialog = undefined;
        }

        /**
         * Check if the VLE is in preview mode
         * @return whether the VLE is in preview mode
         */

    }, {
        key: 'isPreview',
        value: function isPreview() {
            return this.ConfigService.isPreview();
        }

        /**
         * Check if there are any constraints in the project
         * @return whether there are any constraints in the project
         */

    }, {
        key: 'hasConstraints',
        value: function hasConstraints() {

            var hasActiveConstraints = false;

            // get the active constraints
            var activeConstraints = this.ProjectService.activeConstraints;

            if (activeConstraints != null && activeConstraints.length > 0) {
                // there are active constraints
                hasActiveConstraints = true;
            }

            return hasActiveConstraints;
        }

        /**
         * Disable all the constraints
         */

    }, {
        key: 'disableConstraints',
        value: function disableConstraints() {

            // check if we are in preview mode
            if (this.ConfigService.isPreview()) {
                // we are in preview mode so we will disable all the constraints

                this.constraintsDisabled = true;

                // clear all the active constraints
                this.ProjectService.activeConstraints = [];

                /*
                 * update the node statuses so that they are re-evaluated now that
                 * all the constraints have been removed
                 */
                this.StudentDataService.updateNodeStatuses();
            }
        }

        /**
         * Returns WISE API
         */

    }, {
        key: 'getWISEAPI',
        value: function getWISEAPI() {
            var _this2 = this;

            return {
                /**
                 * Registers a function that will be invoked before the componentState is saved to the server
                 * @param nodeId the node id
                 * @param componentId the component id
                 * @param additionalProcessingFunction the function to register for the specified node and component
                 */
                registerAdditionalProcessingFunction: function registerAdditionalProcessingFunction(nodeId, componentId, additionalProcessingFunction) {
                    _this2.ProjectService.addAdditionalProcessingFunction(nodeId, componentId, additionalProcessingFunction);
                },
                /**
                 * Create an auto score annotation
                 * @param runId the run id
                 * @param periodId the period id
                 * @param nodeId the node id
                 * @param componentId the component id
                 * @param toWorkgroupId the student workgroup id
                 * @param data the annotation data
                 * @returns the auto score annotation
                 */
                createAutoScoreAnnotation: function createAutoScoreAnnotation(nodeId, componentId, data) {

                    var runId = _this2.ConfigService.getRunId();
                    var periodId = _this2.ConfigService.getPeriodId();
                    var toWorkgroupId = _this2.ConfigService.getWorkgroupId();

                    // create the auto score annotation
                    var annotation = _this2.AnnotationService.createAutoScoreAnnotation(runId, periodId, nodeId, componentId, toWorkgroupId, data);

                    return annotation;
                },
                /**
                 * Create an auto comment annotation
                 * @param runId the run id
                 * @param periodId the period id
                 * @param nodeId the node id
                 * @param componentId the component id
                 * @param toWorkgroupId the student workgroup id
                 * @param data the annotation data
                 * @returns the auto comment annotation
                 */
                createAutoCommentAnnotation: function createAutoCommentAnnotation(nodeId, componentId, data) {

                    var runId = _this2.ConfigService.getRunId();
                    var periodId = _this2.ConfigService.getPeriodId();
                    var toWorkgroupId = _this2.ConfigService.getWorkgroupId();

                    // create the auto comment annotation
                    var annotation = _this2.AnnotationService.createAutoCommentAnnotation(runId, periodId, nodeId, componentId, toWorkgroupId, data);

                    return annotation;
                },
                /**
                 * Gets the latest annotation for the specified node, component, and type
                 * @param nodeId
                 * @param componentId
                 * @param annotationType
                 * @returns {the|Object}
                 */
                getLatestAnnotationForComponent: function getLatestAnnotationForComponent(nodeId, componentId, annotationType) {
                    var params = {
                        "nodeId": nodeId,
                        "componentId": componentId,
                        "type": annotationType
                    };
                    var annotation = _this2.AnnotationService.getLatestAnnotation(params);
                    return annotation;
                },
                /**
                 * Updates the annotation locally and on the server
                 * @param annotation
                 */
                updateAnnotation: function updateAnnotation(annotation) {
                    _this2.AnnotationService.saveAnnotation(annotation);
                },
                /**
                 * Returns the maxScore for the specified node and component
                 * @param nodeId the node id
                 * @param componentId the component id
                 * @returns the max score for the component
                 */
                getMaxScoreForComponent: function getMaxScoreForComponent(nodeId, componentId) {
                    return _this2.ProjectService.getMaxScoreForComponent(nodeId, componentId);
                }
            };
        }
    }]);

    return VLEController;
}();

VLEController.$inject = ['$scope', '$rootScope', '$filter', '$mdDialog', '$mdMenu', '$state', 'AnnotationService', 'ConfigService', 'NotebookService', 'NotificationService', 'ProjectService', 'SessionService', 'StudentDataService', 'UtilService'];

exports.default = VLEController;
//# sourceMappingURL=vleController.js.map