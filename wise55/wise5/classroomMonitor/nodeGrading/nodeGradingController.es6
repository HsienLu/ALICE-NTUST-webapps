'use strict';

class NodeGradingController {

    constructor($filter,
                $mdDialog,
                $scope,
                $state,
                $stateParams,
                $timeout,
                AnnotationService,
                ConfigService,
                NodeService,
                NotificationService,
                ProjectService,
                StudentStatusService,
                TeacherDataService) {

        this.$filter = $filter;
        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$timeout = $timeout;
        this.AnnotationService = AnnotationService;
        this.ConfigService = ConfigService;
        this.NodeService = NodeService;
        this.NotificationService = NotificationService;
        this.ProjectService = ProjectService;
        this.StudentStatusService = StudentStatusService;
        this.TeacherDataService = TeacherDataService;

        this.$translate = this.$filter('translate');

        this.nodeId = this.$stateParams.nodeId;

        // the max score for the node
        this.maxScore = this.ProjectService.getMaxScoreForNode(this.nodeId);
        this.nodeHasWork = this.ProjectService.nodeHasWork(this.nodeId);

        let startNodeId = this.ProjectService.getStartNodeId();
        this.rootNode = this.ProjectService.getRootNode(startNodeId);

        this.sort = this.TeacherDataService.nodeGradingSort;

        this.hiddenComponents = [];

        // TODO: add loading indicator
        this.TeacherDataService.retrieveStudentDataByNodeId(this.nodeId).then(result => {

            // field that will hold the node content
            this.nodeContent = null;

            this.teacherWorkgroupId = this.ConfigService.getWorkgroupId();

            this.periods = [];

            var node = this.ProjectService.getNodeById(this.nodeId);

            if (node != null) {

                // field that will hold the node content
                this.nodeContent = node;
            }

            this.workgroups = this.ConfigService.getClassmateUserInfos();
            this.workgroupsById = {}; // object that will hold workgroup names, statuses, scores, notifications, etc.
            this.workVisibilityById = {}; // object that specifies whether student work is visible for each workgroup
            this.workgroupInViewById = {}; // object that holds whether the workgroup is in view or not

            this.canViewStudentNames = true;
            this.canGradeStudentWork = true;

            let permissions = this.ConfigService.getPermissions();
            this.canViewStudentNames = permissions.canViewStudentNames;
            this.canGradeStudentWork = permissions.canGradeStudentWork;

            this.annotationMappings = {};

            this.componentStateHistory = [];

            this.setWorkgroupsById();

            this.nRubrics = this.ProjectService.getNumberOfRubricsByNodeId(this.nodeId);

            // scroll to the top of the page when the page loads
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        });

        this.$scope.$on('projectSaved', (event, args) => {
            // update maxScore
            this.maxScore = this.ProjectService.getMaxScoreForNode(this.nodeId);
        });

        this.$scope.$on('notificationAdded', (event, notification) => {
            if (notification.type === 'CRaterResult') {
                // there is a new CRaterResult notification
                // TODO: expand to encompass other notification types that should be shown to teacher
                let workgroupId = notification.toWorkgroupId;
                if (this.workgroupsById[workgroupId]) {
                    this.updateWorkgroup(workgroupId);
                }
            }
        });

        this.$scope.$on('notificationChanged', (event, notification) => {
            if (notification.type === 'CRaterResult') {
                // a CRaterResult notification has changed
                // TODO: expand to encompass other notification types that should be shown to teacher
                let workgroupId = notification.toWorkgroupId;
                if (this.workgroupsById[workgroupId]) {
                    this.updateWorkgroup(workgroupId);
                }
            }
        });

        this.$scope.$on('annotationReceived', (event, args) => {
            let annotation = args.annotation;

            if (annotation) {
                let workgroupId = annotation.toWorkgroupId;
                let nodeId = annotation.nodeId;
                if (nodeId === this.nodeId && this.workgroupsById[workgroupId]) {
                    // a workgroup has a new annotation for this node
                    this.updateWorkgroup(workgroupId);
                }
            }
        });

        this.$scope.$on('studentWorkReceived', (event, args) => {
            let studentWork = args.studentWork;

            if (studentWork != null) {
                let workgroupId = studentWork.workgroupId;
                let nodeId = studentWork.nodeId;
                if (nodeId === this.nodeId && this.workgroupsById[workgroupId]) {
                    // a workgroup has a new componentState for this node
                    this.updateWorkgroup(workgroupId);
                }
            }
        });

        // save event when node grading view is displayed and save the nodeId that is displayed
        let context = "ClassroomMonitor", nodeId = this.nodeId, componentId = null, componentType = null,
            category = "Navigation", event = "nodeGradingViewDisplayed", data = { nodeId: this.nodeId };
        this.TeacherDataService.saveEvent(context, nodeId, componentId, componentType, category, event, data);
    }

    /**
     * Build the workgroupsById object
     */
    setWorkgroupsById() {
        let l = this.workgroups.length;
        for (let i = 0; i < l; i++) {
            let id = this.workgroups[i].workgroupId;
            this.workgroupsById[id] = this.workgroups[i];
            this.workVisibilityById[id] = false;

            this.updateWorkgroup(id, true);
        }
    }

    /**
     * Update statuses, scores, notifications, etc. for a workgroup object
     * @param workgroupID a workgroup ID number
     * @param init Boolean whether we're in controller initialization or not
     */
    updateWorkgroup(workgroupId, init) {
        let workgroup = this.workgroupsById[workgroupId];

        if (workgroup) {
            let alertNotifications = this.getAlertNotificationsByWorkgroupId(workgroupId);
            workgroup.hasAlert = alertNotifications.length;
            workgroup.hasNewAlert = this.workgroupHasNewAlert(alertNotifications);
            let completionStatus = this.getNodeCompletionStatusByWorkgroupId(workgroupId);
            workgroup.hasNewWork = completionStatus.hasNewWork;
            workgroup.completionStatus = this.getWorkgroupCompletionStatus(completionStatus);
            workgroup.score = this.getNodeScoreByWorkgroupId(workgroupId);

            if (!init) {
                this.workgroupsById[workgroupId] = angular.copy(workgroup);
            }
        }
    }

    getAlertNotificationsByWorkgroupId(workgroupId) {
        let args = {};
        args.nodeId = this.nodeId;
        args.workgroupId = workgroupId;
        return this.NotificationService.getAlertNotifications(args);
    }

    workgroupHasNewAlert(alertNotifications) {
        let newAlert = false;

        let l = alertNotifications.length;
        for (let i = 0; i < l; i++) {
            let alert = alertNotifications[i];
            if (!alert.timeDismissed) {
                newAlert = true;
                break;
            }
        }

        return newAlert;
    }

    /**
     * Returns an object with node completion status, latest work time, and latest annotation time
     * for a workgroup for the current node
     * @param workgroupId a workgroup ID number
     * @returns Object with completion, latest work time, latest annotation time
     */
    getNodeCompletionStatusByWorkgroupId(workgroupId) {
        let isCompleted = false;

        // TODO: store this info in the nodeStatus so we don't have to calculate every time?
        let latestWorkTime = this.getLatestWorkTimeByWorkgroupId(workgroupId);

        let latestAnnotationTime = this.getLatestAnnotationTimeByWorkgroupId(workgroupId);
        let studentStatus = this.StudentStatusService.getStudentStatusForWorkgroupId(workgroupId);
        if (studentStatus != null) {
            let nodeStatus = studentStatus.nodeStatuses[this.nodeId];

            if (latestWorkTime) {
                // workgroup has at least one componentState for this node, so check if node is completed

                if (nodeStatus) {
                    isCompleted = nodeStatus.isCompleted;
                }
            }

            if (!this.ProjectService.nodeHasWork(this.nodeId)) {
                // the step does not generate any work so completion = visited
                if (nodeStatus) {
                    isCompleted = nodeStatus.isVisited;
                }
            }
        }

        return {
            isCompleted: isCompleted,
            latestWorkTime: latestWorkTime,
            latestAnnotationTime: latestAnnotationTime
        };
    }

    getLatestWorkTimeByWorkgroupId(workgroupId) {
        let time = null;
        let componentStates = this.TeacherDataService.getComponentStatesByNodeId(this.nodeId);
        let n = componentStates.length-1;

        // loop through component states for this node, starting with most recent
        for (let i = n; i > -1; i--) {
            let componentState = componentStates[i];
            if (componentState.workgroupId === workgroupId) {
                // componentState is for given workgroupId
                time = componentState.serverSaveTime;
                break;
            }
        }

        return time;
    }

    getLatestAnnotationTimeByWorkgroupId(workgroupId) {
        let time = null;
        let annotations = this.TeacherDataService.getAnnotationsByNodeId(this.nodeId);
        let n = annotations.length-1;

        // loop through annotations for this node, starting with most recent
        for (let i = n; i > -1; i--) {
            let annotation = annotations[i];
            // TODO: support checking for annotations from shared teachers
            if (annotation.toWorkgroupId === workgroupId && annotation.fromWorkgroupId === this.ConfigService.getWorkgroupId()) {
                time = annotation.serverSaveTime;
                break;
            }
        }

        return time;
    }

    /**
     * Returns the score for the current node for a given workgroupID
     * @param workgroupId a workgroup ID number
     * @returns Number score value (defaults to -1 if workgroup has no score)
     */
    getNodeScoreByWorkgroupId(workgroupId) {
        let score = this.AnnotationService.getScore(workgroupId, this.nodeId);
        return (typeof score === 'number' ? score : -1);
    }

    /**
     * Returns a numerical status value for a given completion status object depending on node completion
     * Available status values are: 0 (not visited/no work; default), 1 (partially completed), 2 (completed)
     * @param completionStatus Object
     * @returns Integer status value
     */
    getWorkgroupCompletionStatus(completionStatus) {
        let hasWork = completionStatus.latestWorkTime !== null;
        let isCompleted = completionStatus.isCompleted;

        // TODO: store this info in the nodeStatus so we don't have to calculate every time (and can use more widely)?
        let status = 0; // default

        if (isCompleted) {
            status = 2;
        } else if (hasWork) {
            status = 1;
        }

        return status;
    }

    /**
     * Get the html template for the component
     * @param componentType the component type
     * @return the path to the html template for the component
     */
    getComponentTemplatePath(componentType) {
        return this.NodeService.getComponentTemplatePath(componentType);
    }

    /**
     * Get the components for this node.
     * @return an array that contains the content for the components
     */
    getComponents() {
        var components = null;

        if (this.nodeContent != null) {
            components = this.nodeContent.components;
        }

        if (components != null && this.isDisabled) {
            for (var c = 0; c < components.length; c++) {
                var component = components[c];

                component.isDisabled = true;
            }
        }

        if (components != null && this.nodeContent.lockAfterSubmit) {
            for (c = 0; c < components.length; c++) {
                component = components[c];

                component.lockAfterSubmit = true;
            }
        }

        return components;
    }

    getComponentById(componentId) {
        var component = null;

        if (componentId != null) {
            var components = this.getComponents();

            if (components != null) {
                for (var c = 0; c < components.length; c++) {
                    var tempComponent = components[c];

                    if (tempComponent != null) {
                        if (componentId === tempComponent.id) {
                            component = tempComponent;
                            break;
                        }
                    }
                }
            }
        }

        return component;
    }

    /**
     * Get the student data for a specific part
     * @param the componentId
     * @param the workgroupId id of Workgroup who created the component state
     * @return the student data for the given component
     */
    getLatestComponentStateByWorkgroupIdAndComponentId(workgroupId,  componentId) {
        var componentState = null;

        if (workgroupId != null && componentId != null) {
            // get the latest component state for the component
            componentState = this.TeacherDataService.getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(workgroupId, this.nodeId, componentId);
        }

        return componentState;
    }

    /**
     * Get the student data for a specific part
     * @param the componentId
     * @param the workgroupId id of Workgroup who created the component state
     * @return the student data for the given component
     */
    getLatestComponentStateByWorkgroupIdAndNodeIdAndComponentId(workgroupId, nodeId, componentId) {
        var componentState = null;

        if (workgroupId != null && nodeId != null && componentId != null) {

            // get the latest component state for the component
            componentState = this.TeacherDataService.getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(workgroupId, nodeId, componentId);
        }

        return componentState;
    }

    getComponentStatesByWorkgroupIdAndNodeId(workgroupId, nodeId) {
        var componentStates = this.TeacherDataService.getComponentStatesByWorkgroupIdAndNodeId(workgroupId, nodeId);

        //AnnotationService.populateAnnotationMappings(this.annotationMappings, workgroupId, componentStates);

        return componentStates;
    }

    getUserNameByWorkgroupId(workgroupId) {
        return this.ConfigService.getUserNameByWorkgroupId(workgroupId);
    }

    getAnnotationByStepWorkIdAndType(stepWorkId, type) {
        return this.AnnotationService.getAnnotationByStepWorkIdAndType(stepWorkId, type);
    }

    getNodeScoreByWorkgroupIdAndNodeId(workgroupId, nodeId) {
        let score = this.AnnotationService.getScore(workgroupId, nodeId);
        return (typeof score === 'number' ? score : '-');
    }

    scoreChanged(stepWorkId) {
        var annotation = this.annotationMappings[stepWorkId + '-score'];
        this.AnnotationService.saveAnnotation(annotation);
    }

    commentChanged(stepWorkId) {
        var annotation = this.annotationMappings[stepWorkId + '-comment'];
        this.AnnotationService.saveAnnotation(annotation);
    }

    setupComponentStateHistory() {
        this.getComponentStatesByWorkgroupIdAndNodeId()
    }

    /**
     * Get the period id for a workgroup id
     * @param workgroupId the workgroup id
     * @returns the period id for the workgroup id
     */
    getPeriodIdByWorkgroupId(workgroupId) {
        return this.ConfigService.getPeriodIdByWorkgroupId(workgroupId);
    }

    /**
     * Get the current period
     */
    getCurrentPeriod() {
        return this.TeacherDataService.getCurrentPeriod();
    }

    /**
     * Get the percentage of the class or period that has completed the node
     * @param nodeId the node id
     * @returns the percentage of the class or period that has completed the node
     */
    getNodeCompletion(nodeId) {
        // get the currently selected period
        let currentPeriod = this.getCurrentPeriod();
        let periodId = currentPeriod.periodId;

        // get the percentage of the class or period that has completed the node
        let completionPercentage = this.StudentStatusService.getNodeCompletion(nodeId, periodId);

        return completionPercentage;
    }

    /**
     * Get the average score for the node
     * @param nodeId the node id
     * @returns the average score for the node
     */
    getNodeAverageScore() {
        // get the currently selected period
        let currentPeriod = this.TeacherDataService.getCurrentPeriod();
        let periodId = currentPeriod.periodId;

        // get the average score for the node
        let averageScore = this.StudentStatusService.getNodeAverageScore(this.nodeId, periodId);

        if (averageScore === null) {
            averageScore = 'N/A';
        } else {
            averageScore = this.$filter('number')(averageScore, 1);
        }

        return averageScore;
    }

    /**
     * Get the number of students in the current period
     * @returns the number of students that are in the period
     */
    getNumberOfStudentsInPeriod() {
        // get the currently selected period
        let currentPeriod = this.getCurrentPeriod();
        let periodId = currentPeriod.periodId;

        // get the number of students that are on the node in the period
        let count = this.StudentStatusService.getWorkgroupIdsOnNode(this.rootNode.id, periodId).length;

        return count;
    }

    /**
     * Checks whether a workgroup should be shown
     * @param workgroupId the workgroupId to look for
     * @returns boolean whether the workgroup should be shown
     */
    isWorkgroupShown(workgroupId) {
        let show = false;

        let currentPeriodId = this.getCurrentPeriod().periodId;
        let workgroup = this.workgroupsById[workgroupId];
        let periodId = workgroup.periodId;

        if (currentPeriodId === -1 || currentPeriodId === periodId) {
            // workgroup is in current period
            let currentWorkgroup = this.TeacherDataService.getCurrentWorkgroup();
            if (currentWorkgroup) {
                // there is a currently selected workgroup, so check if this one matches
                if (currentWorkgroup.workgroupId === parseInt(workgroupId)) {
                    // workgroupIds match, so show this one
                    show = true;
                }
            } else {
                // there is no currently selected workgroup, so show this one
                show = true;
            }
        }

        return show;
    }

    updateScroll(target, viewportOffsetTop) {
        let newViewportOffsetTop = target.getBoundingClientRect().top;
        let delta = viewportOffsetTop - newViewportOffsetTop;
        let scrollTop = content.scrollTop;
        content.scrollTop = scrollTop - delta;
    }

    /**
     * Show the rubric in the grading view. We will show the step rubric and the
     * component rubrics.
     */
    showRubric($event) {

        // get the step number and title
        let stepNumberAndTitle = this.ProjectService.getNodePositionAndTitleByNodeId(this.nodeId);
        let rubricTitle = this.$translate('STEP_INFO');

        /*
         * create the dialog header, actions, and content elements
         */
        let dialogHeader =
            `<md-toolbar>
                <div class="md-toolbar-tools">
                    <h2>${ stepNumberAndTitle }</h2>
                </div>
            </md-toolbar>`;

        let dialogActions =
            `<md-dialog-actions layout="row" layout-align="end center">
                <md-button class="md-primary" ng-click="openInNewWindow()" aria-label="{{ 'openInNewWindow' | translate }}">{{ 'openInNewWindow' | translate }}</md-button>
                <md-button class="md-primary" ng-click="close()" aria-label="{{ 'close' | translate }}">{{ 'close' | translate }}</md-button>
            </md-dialog-actions>`;

        let dialogContent =
            `<md-dialog-content class="gray-lighter-bg">
                <div class="md-dialog-content" id="nodeInfo_${ this.nodeId }">
                    <node-info node-id="${ this.nodeId }"></node-info>
                </div>
            </md-dialog-content>`;

        // create the dialog string
        let dialogString = `<md-dialog class="dialog--wider" aria-label="${ stepNumberAndTitle } - ${ rubricTitle }">${ dialogHeader }${  dialogContent }${ dialogActions }</md-dialog>`;
        let nodeId = this.nodeId;

        // display the rubric in a popup
        this.$mdDialog.show({
            template : dialogString,
            fullscreen: true,
            controller: ['$scope', '$mdDialog',
                function DialogController($scope, $mdDialog) {

                    // display the rubric in a new tab
                    $scope.openInNewWindow = function() {

                        // open a new tab
                        let w = window.open('', '_blank');

                        /*
                         * create the header for the new window that contains the project title
                         */
                        let windowHeader =
                            `<md-toolbar class="layout-row">
                                <div class="md-toolbar-tools primary-bg" style="color: #ffffff;">
                                    <h2>${ stepNumberAndTitle }</h2>
                                </div>
                            </md-toolbar>`;

                        let rubricContent = document.getElementById('nodeInfo_' + nodeId).innerHTML;

                        // create the window string
                        let windowString =
                            `<link rel='stylesheet' href='../wise5/lib/bootstrap/css/bootstrap.min.css' />
                            <link rel='stylesheet' href='../wise5/themes/default/style/monitor.css'>
                            <link rel='stylesheet' href='../wise5/themes/default/style/angular-material.css'>
                            <link rel='stylesheet' href='../wise5/lib/summernote/dist/summernote.css' />
                            <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic%7CMaterial+Icons" media="all">
                            <body class="layout-column">
                                <div class="layout-column">${ windowHeader }<md-content class="md-padding">${ rubricContent }</div></md-content></div>
                            </body>`;

                        // write the rubric content to the new tab
                        w.document.write(windowString);

                        // close the popup
                        $mdDialog.hide();
                    }

                    // close the popup
                    $scope.close = () => {
                        $mdDialog.hide();
                    }
                }
            ],
            targetEvent: $event,
            clickOutsideToClose: true,
            escapeToClose: true
        });
    }

    setSort(value) {

        switch (value) {
            case 'team':
                if (this.sort === 'team') {
                    this.sort = '-team';
                } else {
                    this.sort = 'team';
                }
                break;
            case 'status':
                if (this.sort === 'status') {
                    this.sort = '-status';
                } else {
                    this.sort = 'status';
                }
                break;
            case 'score':
                if (this.sort === 'score') {
                    this.sort = '-score';
                } else {
                    this.sort = 'score';
                }
                break;
        }

        // update value in the teacher data service so we can persist across view instances and current node changes
        this.TeacherDataService.nodeGradingSort = this.sort;
    }

    getOrderBy() {
        let orderBy = [];

        switch (this.sort) {
            case 'team':
                orderBy = ['displayNames'];
                break;
            case '-team':
                orderBy = ['-displayNames'];
                break;
            case 'status':
                orderBy = ['completionStatus', 'displayNames'];
                break;
            case '-status':
                orderBy = ['-completionStatus', 'displayNames'];
                break;
            case 'score':
                orderBy = ['score', 'displayNames'];
                break;
            case '-score':
                orderBy = ['-score', 'displayNames'];
                break;
        }

        return orderBy;
    }

    /**
     * Expand all workgroups to show student work
     */
    expandAll() {

        // loop through all the workgroups
        for (let i = 0; i < this.workgroups.length; i++) {

            // get a workgroup id
            let id = this.workgroups[i].workgroupId;

            // check if the workgroup is currently in view
            if (this.workgroupInViewById[id]) {
                // the workgroup is currently in view so we will expand it
                this.workVisibilityById[id] = true;
            }
        }

        /*
         * set the boolean flag to denote that we are currently expanding
         * all the workgroups
         */
        this.isExpandAll = true;
    }

    /**
     * Collapse all workgroups to hide student work
     */
    collapseAll() {
        let n = this.workgroups.length;

        for (let i = 0; i < n; i++) {
            let id = this.workgroups[i].workgroupId;
            this.workVisibilityById[id] = false;
        }

        /*
         * set the boolean flag to denote that we are not currently expanding
         * all the workgroups
         */
        this.isExpandAll = false;
    }

    onUpdateExpand(workgroupId, value) {
        this.workVisibilityById[workgroupId] = !this.workVisibilityById[workgroupId];
    }

    onUpdateHiddenComponents(value) {
        this.hiddenComponents = angular.copy(value);
    }

    /**
     * A workgroup row has either come into view or gone out of view
     * @param workgroupId the workgroup id that has come into view or gone out
     * of view
     * @param inview whether the row is in view or not
     */
    workgroupInView(workgroupId, inview) {

        // remember whether the workgroup is in view or not
        this.workgroupInViewById[workgroupId] = inview;

        if (this.isExpandAll) {
            // we are currently in expand all mode

            if (inview) {
                // the workgroup row is in view so we will expand it
                this.workVisibilityById[workgroupId] = true;
            }
        }
    }
}

NodeGradingController.$inject = [
    '$filter',
    '$mdDialog',
    '$scope',
    '$state',
    '$stateParams',
    '$timeout',
    'AnnotationService',
    'ConfigService',
    'NodeService',
    'NotificationService',
    'ProjectService',
    'StudentStatusService',
    'TeacherDataService'
];

export default NodeGradingController;
