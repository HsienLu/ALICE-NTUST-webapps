'use strict';

class StudentProgressController {

    constructor($rootScope,
                $scope,
                $state,
                ConfigService,
                ProjectService,
                StudentStatusService,
                TeacherDataService,
                TeacherWebSocketService) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$state = $state;
        this.ConfigService = ConfigService;
        this.ProjectService = ProjectService;
        this.StudentStatusService = StudentStatusService;
        this.TeacherDataService = TeacherDataService;
        this.TeacherWebSocketService = TeacherWebSocketService;

        this.teacherWorkgroupId = this.ConfigService.getWorkgroupId();

        // get the current sort order
        this.sort = this.TeacherDataService.studentProgressSort;

        // initialize the current workgroup
        this.TeacherDataService.setCurrentWorkgroup(null);

        this.canViewStudentNames = true;
        this.canGradeStudentWork = true;

        // get the role of the teacher for the run e.g. 'owner', 'write', 'read'
        var role = this.ConfigService.getTeacherRole(this.teacherWorkgroupId);

        if (role === 'owner') {
            // the teacher is the owner of the run and has full access
            this.canViewStudentNames = true;
            this.canGradeStudentWork = true;
        } else if (role === 'write') {
            // the teacher is a shared teacher that can grade the student work
            this.canViewStudentNames = true;
            this.canGradeStudentWork = true;
        } else if (role === 'read') {
            // the teacher is a shared teacher that can only view the student work
            this.canViewStudentNames = false;
            this.canGradeStudentWork = false;
        }

        this.studentsOnline = this.TeacherWebSocketService.getStudentsOnline();

        this.students = [];
        this.initializeStudents();

        this.studentStatuses = this.StudentStatusService.getStudentStatuses();

        this.maxScore = this.ProjectService.getMaxScore();
        if (this.maxScore === null) {
            this.maxScore = 0;
        }

        this.periods = [];

        // create an option for all periods
        var allPeriodOption = {
            periodId: -1,
            periodName: 'All'
        };

        this.periods.push(allPeriodOption);

        this.periods = this.periods.concat(this.ConfigService.getPeriods());

        // set the current period if it hasn't been set yet
        if (this.getCurrentPeriod() == null) {
            if (this.periods != null && this.periods.length > 0) {
                // set it to the all periods option
                this.setCurrentPeriod(this.periods[0]);
            }
        }

        // listen for the studentsOnlineReceived event
        this.$rootScope.$on('studentsOnlineReceived', (event, args) => {
            this.studentsOnline = args.studentsOnline;

            // update the students
            this.initializeStudents();

            // refresh the view
            this.$scope.$apply();
        });

        // listen for the studentStatusReceived event
        this.$rootScope.$on('studentStatusReceived', (event, args) => {
            // get the workgroup id
            let studentStatus = args.studentStatus;
            let workgroupId = studentStatus.workgroupId;

            // update the time spent for the workgroup
            this.updateTimeSpentForWorkgroupId(workgroupId);

            // update the students
            this.initializeStudents();

            // refresh the view
            this.$scope.$apply();
        });

        // listen for the studentDisconnected event
        this.$rootScope.$on('studentDisconnected', (event, args) => {
            var data = args.data;
            var workgroupId = data.workgroupId;

            var studentsOnline = this.studentsOnline;

            var indexOfWorkgroupId = studentsOnline.indexOf(workgroupId);

            if (indexOfWorkgroupId != -1) {
                // remove the workgroup from the students online list
                studentsOnline.splice(indexOfWorkgroupId, 1);

                // update the students
                this.initializeStudents();

                // refresh the view
                this.$scope.$apply();
            }
        });

        // listen for the currentWorkgroupChanged event
        this.$scope.$on('currentWorkgroupChanged', (event, args) => {
            this.currentWorkgroup = args.currentWorkgroup;
        });

        // how often to update the time spent values in the view
        this.updateTimeSpentInterval = 10000;

        // mapping of workgroup id to time spent
        this.studentTimeSpent = {};

        // update the time spent values in the view
        this.updateTimeSpent();

        // update the time spent values every x seconds
        this.updateTimeSpentIntervalId = setInterval(() => {
            // update the time spent values in the view
            this.updateTimeSpent();

            // refresh the view
            this.$scope.$apply();
        }, this.updateTimeSpentInterval);

        // save event when student progress view is displayed
        let context = "ClassroomMonitor", nodeId = null, componentId = null, componentType = null,
            category = "Navigation", event = "studentProgressViewDisplayed", data = {};
        this.TeacherDataService.saveEvent(context, nodeId, componentId, componentType, category, event, data);
    }

    getCurrentNodeForWorkgroupId(workgroupId) {
        return this.StudentStatusService.getCurrentNodePositionAndNodeTitleForWorkgroupId(workgroupId);
    };

    getStudentProjectCompletion(workgroupId) {
        return this.StudentStatusService.getStudentProjectCompletion(workgroupId);
    };

    isWorkgroupOnline(workgroupId) {
        return this.studentsOnline.indexOf(workgroupId) != -1;
    };

    isWorkgroupShown(workgroup) {
        let show = false;

        let currentPeriod = this.getCurrentPeriod().periodId;

        if (currentPeriod === -1 || workgroup.periodId === this.getCurrentPeriod().periodId) {
            if (this.currentWorkgroup) {
                if (workgroup.displayNames === this.currentWorkgroup.displayNames) {
                    show = true;
                }
            } else {
                show = true;
            }
        }

        return show;
    }

    /**
     * Set the current period
     * @param period the period object
     */
    setCurrentPeriod(period) {
        this.TeacherDataService.setCurrentPeriod(period);
        this.$rootScope.$broadcast('periodChanged', {period: period});
    };

    /**
     * Get the current period
     */
    getCurrentPeriod() {
        return this.TeacherDataService.getCurrentPeriod();
    };

    getStudentTotalScore(workgroupId) {
        return this.TeacherDataService.getTotalScoreByWorkgroupId(workgroupId);
    }

    /**
     * Get the time spent for a workgroup
     */
    getStudentTimeSpent(workgroupId) {
        let timeSpent = null;

        if (this.studentTimeSpent) {
            timeSpent = this.studentTimeSpent[workgroupId];
        }

        return timeSpent;
    }

    /**
     * Update the time spent values in the view
     */
    updateTimeSpent() {
        var studentsOnline = this.studentsOnline;

        if (studentsOnline != null) {

            // loop through all the workgroups that are online
            for (var s = 0; s < studentsOnline.length; s++) {
                var workgroupId = studentsOnline[s];

                if (workgroupId != null) {
                    // update the time spent for the workgroup
                    this.updateTimeSpentForWorkgroupId(workgroupId);
                }
            }
        }
    }

    /**
     * Update the time spent for the workgroup
     * @workgroupId the workgroup id
     */
    updateTimeSpentForWorkgroupId(workgroupId) {

        if (workgroupId != null) {
            // get the current client timestamp
            var currentClientTimestamp = new Date().getTime();

            // get the student status
            var studentStatus = this.StudentStatusService.getStudentStatusForWorkgroupId(workgroupId);

            if (studentStatus != null) {

                // get the time the student status was posted to the server
                var postTimestamp = studentStatus.postTimestamp;

                /*
                 * convert the current client timestamp to a server timestamp
                 * this is requied in cases where the client and server clocks
                 * are not synchronized
                 */
                var currentServerTimestamp = this.ConfigService.convertToServerTimestamp(currentClientTimestamp);

                // get the amount of time the student has been on the step
                var timeSpent = currentServerTimestamp - postTimestamp;

                // get the total amount of seconds the student has been on the step
                var totalSeconds = Math.floor(timeSpent / 1000);

                // get the hours, minutes, and seconds
                var hours = Math.floor((totalSeconds % 86400) / 3600);
                var minutes = Math.floor(((totalSeconds % 86400) % 3600) / 60);
                var seconds = totalSeconds % 60;

                if (hours < 0) {
                    hours = 0;
                }

                if (minutes < 0) {
                    minutes = 0;
                }

                if (seconds < 0) {
                    seconds = 0;
                }

                var timeSpentText = '';

                if (hours > 0) {
                    timeSpentText += (hours + ':');
                }

                if (hours > 0) {
                    // there are hours

                    if (minutes == 0) {
                        // fill with zeroes
                        timeSpentText += '00:';
                    } else if (minutes > 0 && minutes < 10) {
                        // add a leading zero
                        timeSpentText += '0' + minutes + ':';
                    } else {
                        timeSpentText += minutes + ':';
                    }
                } else {
                    // there are no hours

                    timeSpentText += minutes + ':';
                }

                if (seconds == 0) {
                    // fill with zeroes
                    timeSpentText += '00';
                } else if (seconds > 0 && seconds < 10) {
                    // add a leading zero
                    timeSpentText += ('0' + seconds);
                } else {
                    timeSpentText += seconds;
                }

                // update the mapping of workgroup id to time spent
                //this.studentTimeSpent[workgroupId] = timeSpentText;

                // update the timeSpent for the students with the matching workgroupID
                for (let i = 0; i < this.students.length; i++) {
                    let student = this.students[i];
                    let id = student.workgroupId;

                    if (workgroupId === id) {
                        student.timeSpent = timeSpentText;
                    }
                }
            }
        }
    }

    /**
     * Set up the array of students in the run. Split workgroups into
     * individual student objects.
     */
    initializeStudents() {
        let students = [];

        // get the workgroups
        let workgroups = this.ConfigService.getClassmateUserInfos();

        // loop through all the workgroups
        for (let x = 0; x < workgroups.length; x++) {
            let workgroup = workgroups[x];

            if (workgroup != null) {
                let workgroupId = workgroup.workgroupId;
                let isOnline = this.isWorkgroupOnline(workgroupId);

                let userName = workgroup.userName;
                let displayNames = this.ConfigService.getDisplayUserNamesByWorkgroupId(workgroupId).split(', ');
                let userIds = workgroup.userIds;

                for (let i = 0; i < userIds.length; i++) {
                    let id = userIds[i];
                    let displayName = '';

                    if (this.canViewStudentNames) {
                        // put user display name in 'lastName, firstName' order
                        let names = displayNames[i].split(' ');
                        displayName = names[1] + ', ' + names[0];
                    } else {
                        displayName = 'Student ' + id;
                    }

                    let user = {
                        userId: id,
                        periodId: workgroup.periodId,
                        periodName: workgroup.periodName,
                        workgroupId: workgroup.workgroupId,
                        displayNames: displayName,
                        userName: displayName,
                        online: isOnline,
                        location: this.getCurrentNodeForWorkgroupId(workgroup.workgroupId),
                        timeSpent: this.getStudentTimeSpent(workgroup.workgroupId),
                        completion: this.getStudentProjectCompletion(workgroup.workgroupId),
                        score: this.getStudentTotalScore(workgroup.workgroupId)
                    };
                    students.push(user);
                }

            }
        }

        this.students = students;
    }

    showWorkgroupProjectView(workgroup) {
        this.TeacherDataService.setCurrentWorkgroup(workgroup);
        this.$state.go('root.nodeProgress');
    }

    setSort(value) {
        if (this.sort === value) {
            this.sort = '-' + value;
        } else {
            this.sort = value;
        }

        // update value in the teacher data service so we can persist across views
        this.TeacherDataService.nodeGradingSort = this.sort;
    }

    getOrderBy() {
        let orderBy = [];

        switch (this.sort) {
            case 'team':
                orderBy = ['workgroupId', 'userName'];
                break;
            case '-team':
                orderBy = ['-workgroupId', 'userName'];
                break;
            case 'student':
                orderBy = ['userName', 'workgroupId'];
                break;
            case '-student':
                orderBy = ['-userName', 'workgroupId'];
                break;
            case 'score':
                orderBy = ['score', 'userName'];
                break;
            case '-score':
                orderBy = ['-score', 'userName'];
                break;
            case 'completion':
                orderBy = ['completion', 'userName'];
                break;
            case '-completion':
                orderBy = ['-completion', 'userName'];
                break;
            case 'location':
                orderBy = ['location', 'userName'];
                break;
            case '-location':
                orderBy = ['-location', 'userName'];
                break;
            case 'time':
                orderBy = ['-online', '-timeSpent', 'userName'];
                break;
            case '-time':
                orderBy = ['-online', 'timeSpent', 'userName'];
                break;
            case 'online':
                orderBy = ['online', 'userName'];
                break;
            case '-online':
                orderBy = ['-online', 'userName'];
                break;
        }

        return orderBy;
    }
}

StudentProgressController.$inject = [
    '$rootScope',
    '$scope',
    '$state',
    'ConfigService',
    'ProjectService',
    'StudentStatusService',
    'TeacherDataService',
    'TeacherWebSocketService'
];

export default StudentProgressController;
