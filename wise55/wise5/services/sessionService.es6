class SessionService {
    constructor($http,
                $rootScope,
                ConfigService
                //StudentDataService) {
    ) {
        this.$http = $http;
        this.$rootScope = $rootScope;
        this.ConfigService = ConfigService;
        //this.StudentDataService = StudentDataService;
        /*
         * the amount of time (in milliseconds) before we automatically log
         * out the user
         */
        this.sessionTimeoutInterval = null;

        /*
         * the amount of time (in milliseconds) before we check if there
         * were any mouse events
         */
        this.checkMouseEventInterval = null;

        /*
         * the timestamp when the last mouse event occurred
         */
        this.lastMouseEventTimestamp = null;

        // the id for the setTimeout of the warning message
        //this.warningId = null;

        // the id for the setTimeout of the automatic log out
        //this.logOutId = null;

        /*
         * boolean value used to determine if we need to log out the
         * user or just bring them back to the home page when we exit
         * the VLE
         */
        this.performLogOut = false;

        // the active warning ids
        this.warningIds = [];

        // the active log out ids
        this.logOutIds = [];

        /**
         * Listen for the 'componentDoneUnloading' event. When the user logs
         * out of the VLE, we will need to wait for certain components to
         * finish performing any necessary processing (such as saving) before
         * we actually log out. Once a component has completed their unloading
         * they will fire the 'componentDoneUnloading' event. We will listen
         * for this event and when there are no more components left to wait
         * for, we will then log out.
         */
        this.$rootScope.$on('doneExiting', () => {

            // check if all components are done unloading so we can exit
            // no longer needed.
            //this.attemptExit();
        });

        /**
         * Listen for the 'goHome' event. We will attempt to go home when
         * the 'goHome' even is fired. There may be components that have not
         * saved their data yet so we may not be able to go home right away.
         * If there are components that have not saved their data yet, we
         * will wait for those components to fire the 'componentDoneUnloading'
         * event and then try to go home again.
         */
        this.$rootScope.$on('goHome', () => {

            // let other components know that we are exiting
            this.$rootScope.$broadcast('exit');

            // check if all components are done unloading so we can exit
            this.attemptExit();
        });

        /**
         * Listen for the 'logOut' event. We will attempt to log out when
         * the 'logOut' even is fired. There may be components that have not
         * saved their data yet so we may not be able to log out right away.
         * If there are components that have not saved their data yet, we
         * will wait for those components to fire the 'componentDoneUnloading'
         * event and then try to log out again.
         */
        this.$rootScope.$on('logOut', () => {

            /*
             * set the perform log out boolean to true so that we know to
             * log out the user later
             */
            this.performLogOut = true;

            // let other components know that we are exiting
            this.$rootScope.$broadcast('exit');

            // check if all components are done unloading so we can exit
            this.attemptExit();
        });
    }

    /**
     * Start the timers, save session initialized event
     */
    initializeSession() {
        if (this.ConfigService.isPreview()) {
            // no session management for previewers
            return;
        }

        var minutes = 30;
        var seconds = minutes * 60;
        var milliseconds = seconds * 1000;
        this.sessionTimeoutInterval = milliseconds;

        // set the check mouse interval to one minute
        this.checkMouseEventInterval = this.convertMinutesToMilliseconds(1);

        // start the warning and auto log out timers
        this.startTimers();

        // start the check mouse event timer
        this.startCheckMouseEventTimer();

        // save session started event
        var nodeId = null;
        var componentId = null;
        var componentType = null;
        var category = "Navigation";
        var event = "sessionStarted";
        var eventData = {};
        //this.StudentDataService.saveVLEEvent(nodeId, componentId, componentType, category, event, eventData);
    };

    /**
     * Start the warning and auto log out timers
     */
    startTimers() {
        this.startWarningTimer();
        this.startLogOutTimer();
    };

    /**
     * Start the warning timer
     */
    startWarningTimer() {

        // clear all the active warning timers
        this.clearWarningTimers();

        var warningTimeoutInterval = this.sessionTimeoutInterval * 0.9;
        var warningId = setTimeout(angular.bind(this, this.showWarning), warningTimeoutInterval);
        this.warningIds.push(warningId);
    };

    /**
     * Clear the warning timers
     */
    clearWarningTimers() {
        // clear all the active warning timeouts
        for (var w = 0; w < this.warningIds.length; w++) {

            // get a warning id
            var warningId = this.warningIds[w];

            // clear the timeout for the warning id
            clearTimeout(warningId);

            // remove the warning id from the array
            this.warningIds.splice(w, 1);

            // move the counter back now that we have removed a warning id
            w--;
        }
    }

    /**
     * Start the auto log out timer
     */
    startLogOutTimer() {

        // clear all the active log out timers
        this.clearLogOutTimers();

        var logOutId = setTimeout(angular.bind(this, this.forceLogOut), this.sessionTimeoutInterval);
        this.logOutIds.push(logOutId);
    };

    /**
     * Clear the log out timers
     */
    clearLogOutTimers() {
        // clear all the active log out timeouts
        for (var l = 0; l < this.logOutIds.length; l++) {

            // get a log out id
            var logOutId = this.logOutIds[l];

            // clear the timeout for the log out id
            clearTimeout(logOutId);

            // remove the log out id from the array
            this.logOutIds.splice(l, 1);

            // move the counter back now that we have removed a log out id
            l--;
        }
    }

    /**
     * Start the check mouse event timer
     */
    startCheckMouseEventTimer() {
        setInterval(angular.bind(this, this.checkMouseEvent), this.checkMouseEventInterval);
    };

    /**
     * Fire the event that will show the warning message
     */
    showWarning() {
        if (this.checkMouseEvent()) {
            // a mouse event has occurred recently so we don't need to show the warning
        } else {
            // a mouse event has not occurred recently so we will show the warning
            this.$rootScope.$broadcast('showSessionWarning');
        }
    };

    /**
     * Renew the session with the server and refresh the local timers
     */
    renewSession() {
        var renewSessionURL = this.ConfigService.getConfigParam('renewSessionURL');
        // make a request to the log out url
        this.$http.get(renewSessionURL).then((result) => {
            var renewSessionResult = result.data;

            if (renewSessionResult === 'true') {
                // Session is active, restart local timers.
                this.clearTimers();
                this.startTimers();
            } else if (renewSessionResult === "requestLogout") {
                // WISE server is requesting that we log out
                this.$rootScope.$broadcast('showRequestLogout');
            } else {
                // User is no longer logged in (session is inactive)
                this.forceLogOut();
            }
        });
    };

    /**
     * Delete the existing timers
     */
    clearTimers() {
        this.clearWarningTimers();
        this.clearLogOutTimers();
    };

    /**
     * Called when the user moves the mouse
     */
    mouseMoved() {
        // get the current timestamp
        var date = new Date();
        var timestamp = date.getTime();

        // remember this timestamp
        this.lastMouseEventTimestamp = timestamp;
    };

    /**
     * Check if there were any mouse events since the last time we checked.
     * Currently we check every 1 minute which is based on the value of the
     * checkMouseEventInterval variable.
     * @returns whether there was a mouse event recently
     */
    checkMouseEvent() {
        var eventOccurred = false;

        if (this.lastMouseEventTimestamp != null) {
            // there was a mouse event since the last time we checked

            // reset the timers
            this.renewSession();

            // clear the mouse event timestamp
            this.lastMouseEventTimestamp = null;

            eventOccurred = true;
        }

        return eventOccurred;
    };

    /**
     * Convert minutes to milliseconds
     * @param minutes the number of minutes
     * @return the number of milliseconds
     */
    convertMinutesToMilliseconds(minutes) {
        var milliseconds = null;

        if (minutes != null) {
            // get the number of seconds
            var seconds = minutes * 60;

            // get the number of milliseconds
            milliseconds = seconds * 1000;
        }

        return milliseconds;
    };

    /**
     * Log out the user
     */
    forceLogOut() {
        /*
         * make a final check to see if there were any mouse events recently
         * before we log out the user
         */
        if (this.checkMouseEvent()) {
            // a mouse event has occurred so we will not log out the user
        } else {
            // a mouse event has not occurred recently so we will log out the user
            this.clearTimers();
            this.$rootScope.$broadcast('logOut');
        }
    };

    /**
     * Check if there are components that are not ready to exit
     * because they have not saved their data yet. If there are no
     * components left to wait for, we can then exit.
     */
    attemptExit() {
        // get all the components listening for the exit event
        var exitListenerCount = this.$rootScope.$$listenerCount.exit;

        /*
         * Check how many exit listeners are still listening for the
         * exit event. Components such as nodes will finish saving their
         * data and then be removed from the listener count.
         */
        if (exitListenerCount != null && exitListenerCount > 0) {
            // don't log out yet because there are still listeners
        } else {
            // there are no more listeners so we will exit
            var mainHomePageURL = this.ConfigService.getMainHomePageURL();

            // save sessionEnded event
            var nodeId = null;
            var componentId = null;
            var componentType = null;
            var category = "Navigation";
            var event = "sessionEnded";
            var eventData = {};
            //this.StudentDataService.saveVLEEvent(nodeId, componentId, componentType, category, event, eventData);

            if (this.performLogOut) {
                // log out the user and bring them to the home page

                // get the url that will log out the user
                var sessionLogOutURL = this.ConfigService.getSessionLogOutURL();

                // take user to log out url
                window.location.href = sessionLogOutURL;
            } else {
                /*
                 * bring the user to the student or teacher home page but
                 * do not log them out
                 */

                // Get the wiseBaseURL e.g. /wise
                var wiseBaseURL = this.ConfigService.getWISEBaseURL();

                var homePageURL = '';

                // get the user type
                var userType = this.ConfigService.getConfigParam('userType');

                if (userType === 'student') {
                    // send the user to the student home page
                    homePageURL = wiseBaseURL + '/student';
                } else if (userType === 'teacher') {
                    // send the user to the teacher home page
                    homePageURL = wiseBaseURL + '/teacher';
                } else {
                    // send the user to the main home page
                    homePageURL = mainHomePageURL;
                }

                window.location.href = homePageURL;
            }
        }
    };
}

//SessionService.$inject = ['$http','$rootScope','ConfigService','StudentDataService'];
SessionService.$inject = ['$http','$rootScope','ConfigService'];

export default SessionService;
