'use strict';

class AnnotationService {
    constructor($filter,
                $http,
                $q,
                $rootScope,
                ConfigService,
                ProjectService,
                UtilService) {

        this.$filter = $filter;
        this.$http = $http;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.ConfigService = ConfigService;
        this.ProjectService = ProjectService;
        this.UtilService = UtilService;

        this.$translate = this.$filter('translate');

        this.annotations = null;

        /*
         * A dummy annotation id that is used in preview mode when we simulate
         * saving of annotation.
         */
        this.dummyAnnotationId = 1;
    }

    /**
     * Get all the annotations
     */
    getAnnotations() {
        return this.annotations;
    }

    /**
     * Get the annotation with the specified id, or null if not found
     * @param annotationId
     */
    getAnnotationById(annotationId) {
        for (let annotation of this.annotations) {
            if (annotation.id === annotationId) {
                return annotation;
            }
        }
        return null;
    }

    /**
     * Get the latest annotation with the given params
     * @param params an object containing the params to match
     * @returns the latest annotation that matches the params
     */
    getLatestAnnotation(params) {
        let annotation = null;

        if (params != null) {
            let nodeId = params.nodeId;
            let componentId = params.componentId;
            let fromWorkgroupId = params.fromWorkgroupId;
            let toWorkgroupId = params.toWorkgroupId;
            let type = params.type;

            let annotations = this.annotations;

            if (annotations != null) {
                for (let a = annotations.length - 1; a >= 0; a--) {
                    let tempAnnotation = annotations[a];

                    if (tempAnnotation != null) {
                        let match = true;

                        if (nodeId && tempAnnotation.nodeId !== nodeId) {
                            match = false;
                        }
                        if (match && componentId && tempAnnotation.componentId !== componentId) {
                            match = false;
                        }
                        if (match && fromWorkgroupId && tempAnnotation.fromWorkgroupId !== fromWorkgroupId) {
                            match = false;
                        }
                        if (match && toWorkgroupId && tempAnnotation.toWorkgroupId !== toWorkgroupId) {
                            match = false;
                        }
                        if (match && type) {
                            if (type.constructor === Array) {
                                for (let i = 0; i < type.length; i++) {
                                    let thisType = type[i];
                                    if (tempAnnotation.type !== thisType) {
                                        match = false;
                                    }
                                }
                            } else {
                                if (tempAnnotation.type !== type) {
                                    match = false;
                                }
                            }
                        }

                        if (match) {
                            annotation = tempAnnotation;
                            break;
                        }
                    }
                }
            }
        }

        return annotation;
    };

    /**
     * Create an annotation object
     * @param annotationId the annotation id
     * @param runId the run id
     * @param periodId the period id
     * @param fromWorkgroupId the from workgroup id
     * @param toWorkgroupId the to workgroup id
     * @param nodeId the node id
     * @param componentId the component id
     * @param studentWorkId the student work id
     * @param annotationType the annotation type
     * @param data the data
     * @param clientSaveTime the client save time
     * @returns an annotation object
     */
    createAnnotation(
        annotationId, runId, periodId, fromWorkgroupId, toWorkgroupId,
        nodeId, componentId, studentWorkId, localNotebookItemId, notebookItemId,
        annotationType, data, clientSaveTime) {

        var annotation = {};
        annotation.id = annotationId;
        annotation.runId = runId;
        annotation.periodId = periodId;
        annotation.fromWorkgroupId = fromWorkgroupId;
        annotation.toWorkgroupId = toWorkgroupId;
        annotation.nodeId = nodeId;
        annotation.componentId = componentId;
        annotation.studentWorkId = studentWorkId;
        annotation.localNotebookItemId = localNotebookItemId;
        annotation.notebookItemId = notebookItemId;
        annotation.type = annotationType;
        annotation.data = data;
        annotation.clientSaveTime = clientSaveTime;

        return annotation;
    };

    /**
     * Save the annotation to the server
     * @param annotation the annotation object
     * @returns a promise
     */
    saveAnnotation(annotation) {

        if (annotation != null) {
            let annotations = [];
            annotations.push(annotation);

            // loop through all the annotations and inject a request token
            if (annotations != null && annotations.length > 0) {
                for (let a = 0; a < annotations.length; a++) {
                    let annotation = annotations[a];

                    if (annotation != null) {
                        annotation.requestToken = this.UtilService.generateKey(); // use this to keep track of unsaved annotations.
                        this.addOrUpdateAnnotation(annotation);
                    }
                }
            } else {
                annotations = [];
            }

            if (this.ConfigService.isPreview()) {
                // if we're in preview, don't make any request to the server but pretend we did
                let savedAnnotationDataResponse = {
                    annotations: annotations
                };
                let annotation = this.saveToServerSuccess(savedAnnotationDataResponse);

                let deferred = this.$q.defer();
                deferred.resolve(annotation);
                return deferred.promise;
            } else {
                let params = {
                    runId: this.ConfigService.getRunId(),
                    workgroupId: this.ConfigService.getWorkgroupId(),
                    annotations: angular.toJson(annotations)
                };

                let httpParams = {
                    method: "POST",
                    url: this.ConfigService.getConfigParam('teacherDataURL'),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: $.param(params)
                };

                return this.$http(httpParams).then(angular.bind(this, function(result) {

                    let localAnnotation = null;

                    if (result != null && result.data != null) {
                        let savedAnnotationDataResponse = result.data;
                        localAnnotation = this.saveToServerSuccess(savedAnnotationDataResponse);
                    }

                    return localAnnotation;
                }));
            }
        }
    };

    saveToServerSuccess(savedAnnotationDataResponse) {
        let localAnnotation = null;
        if (savedAnnotationDataResponse != null) {

            // get the saved annotations
            let savedAnnotations = savedAnnotationDataResponse.annotations;

            // get the local annotations
            let localAnnotations = this.annotations;

            if (savedAnnotations != null && localAnnotations != null) {

                // loop through all the saved annotations
                for (let x = 0; x < savedAnnotations.length; x++) {
                    let savedAnnotation = savedAnnotations[x];

                    // loop through all the local annotations
                    for (let y = localAnnotations.length - 1; y >= 0; y--) {
                        localAnnotation = localAnnotations[y];

                        if (localAnnotation.id != null &&
                            localAnnotation.id === savedAnnotation.id) {

                            // we have found the matching local annotation so we will update it
                            localAnnotation.serverSaveTime = savedAnnotation.serverSaveTime;
                            //localAnnotation.requestToken = null; // requestToken is no longer needed.

                            this.$rootScope.$broadcast('annotationSavedToServer', {annotation: localAnnotation});
                            break;
                        } else if (localAnnotation.requestToken != null &&
                            localAnnotation.requestToken === savedAnnotation.requestToken) {

                            // we have found the matching local annotation so we will update it
                            localAnnotation.id = savedAnnotation.id;
                            localAnnotation.serverSaveTime = savedAnnotation.serverSaveTime;
                            localAnnotation.requestToken = null; // requestToken is no longer needed.

                            if (this.ConfigService.isPreview() && localAnnotation.id == null) {
                                /*
                                 * we are in preview mode so we will set a dummy
                                 * annotation id into the annotation
                                 */
                                localAnnotation.id = this.dummyAnnotationId;
                                /*
                                 * increment the dummy annotation id for the next
                                 * annotation
                                 */
                                this.dummyAnnotationId++;
                            }

                            this.$rootScope.$broadcast('annotationSavedToServer', {annotation: localAnnotation});
                            break;
                        }
                    }
                }
            }
        }
        return localAnnotation;
    }

    /**
     * Add or update the annotation to our local collection
     * @param annotation the annotation object
     */
    addOrUpdateAnnotation(annotation) {

        if (annotation != null) {

            var updated = false;

            var annotations = this.annotations;

            if (annotations != null) {

                // loop through all the local annotations
                for (var a = annotations.length - 1; a >= 0; a--) {
                    var tempAnnotation = annotations[a];

                    if (tempAnnotation != null) {

                        if (annotation.id == tempAnnotation.id &&
                            annotation.nodeId == tempAnnotation.nodeId &&
                            annotation.componentId == tempAnnotation.componentId &&
                            annotation.fromWorkgroupId == tempAnnotation.fromWorkgroupId &&
                            annotation.toWorkgroupId == tempAnnotation.toWorkgroupId &&
                            annotation.type == tempAnnotation.type &&
                            annotation.studentWorkId == tempAnnotation.studentWorkId &&
                            annotation.runId == tempAnnotation.runId &&
                            annotation.periodId == tempAnnotation.periodId) {

                            // the annotation matches so we will update it
                            tempAnnotation.data = annotation.data;
                            tempAnnotation.clientSaveTime = annotation.clientSaveTime;
                            tempAnnotation.serverSaveTime = annotation.serverSaveTime;
                            updated = true;
                        }
                    }
                }
            }

            if (!updated) {
                // we did not find a match so we will add it
                annotations.push(annotation);
            }
        }
    };

    /**
     * Set the annotations
     * @param annotations the annotations aray
     */
    setAnnotations(annotations) {
        this.annotations = annotations;
    };

    /**
     * Get the total score for a workgroup
     * @param annotations an array of annotations
     * @param workgroupId the workgroup id
     */
    getTotalScore(annotations, workgroupId) {

        var totalScore = 0;

        var scoresFound = [];

        if (annotations != null && workgroupId != null) {
            // loop through all the annotations from newest to oldest
            for (var a = annotations.length - 1; a >= 0; a--) {

                // get an annotation
                var annotation = annotations[a];

                // check that the annotation is for the workgroup id we are looking for
                if (annotation != null && annotation.toWorkgroupId == workgroupId) {

                    // check that the annotation is a score annotation
                    if (annotation.type === 'score' || annotation.type === "autoScore") {

                        var nodeId = annotation.nodeId;
                        var componentId = annotation.componentId;
                        var data = annotation.data;

                        // make sure the annotation is for an active component
                        if (this.ProjectService.isActive(nodeId, componentId)) {

                            var scoreFound = nodeId + '-' + componentId;

                            // check if we have obtained a score from this component already
                            if (scoresFound.indexOf(scoreFound) == -1) {
                                // we have not obtained a score from this component yet

                                if (data != null) {
                                    var value = data.value;

                                    if (!isNaN(value)) {

                                        if (totalScore == null) {
                                            totalScore = value;
                                        } else {
                                            totalScore += value;
                                        }

                                        /*
                                         * remember that we have found a score for this component
                                         * so that we don't double count it if the teacher scored
                                         * the component more than once
                                         */
                                        scoresFound.push(scoreFound);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return totalScore;
    }

    /**
     * Get the score for a workgroup for a node
     * @param workgroupId the workgroup id
     * @param nodeId the node id
     * @returns the score for a workgroup for a node
     */
    getScore(workgroupId, nodeId) {

        var score = null;

        /*
         * an array to keep track of the components that we have obtained a
         * score for. we do not want to double count components if the student
         * has received a score multiple times for a node from the teacher.
         */
        var scoresFound = [];

        // get all the annotations
        var annotations = this.annotations;

        if (workgroupId != null && nodeId != null) {
            // loop through all the annotations from newest to oldest
            for (var a = annotations.length - 1; a >= 0; a--) {

                // get an annotation
                var annotation = annotations[a];

                // check that the annotation is for the workgroup id we are looking for
                if (annotation != null && annotation.toWorkgroupId == workgroupId) {

                    // check that the annotation is a score annotation
                    if (annotation.type === 'score' || annotation.type === 'autoScore') {

                        var tempNodeId = annotation.nodeId;

                        // check that the annotation is for the node we are looking for
                        if (nodeId == tempNodeId) {
                            var componentId = annotation.componentId;
                            var data = annotation.data;

                            var scoreFound = tempNodeId + '-' + componentId;

                            // check if we have obtained a score from this component already
                            if (scoresFound.indexOf(scoreFound) == -1) {
                                // we have not obtained a score from this component yet

                                if (data != null) {
                                    var value = data.value;

                                    if (!isNaN(value)) {

                                        if (score == null) {
                                            score = value;
                                        } else {
                                            score += value;
                                        }

                                        /*
                                         * remember that we have found a score for this component
                                         * so that we don't double count it if the teacher scored
                                         * the component more than once
                                         */
                                        scoresFound.push(scoreFound);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return score;
    }

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
    createAutoScoreAnnotation(runId, periodId, nodeId, componentId, toWorkgroupId, data) {
        var annotationId = null;
        var fromWorkgroupId = null;
        var studentWorkId = null;
        var localNotebookItemId = null;
        var notebookItemId = null;
        var annotationType = 'autoScore';
        var clientSaveTime = Date.parse(new Date());

        var annotation = this.createAnnotation(
            annotationId, runId, periodId, fromWorkgroupId, toWorkgroupId,
            nodeId, componentId, studentWorkId, localNotebookItemId, notebookItemId,
            annotationType, data, clientSaveTime
        );

        return annotation;
    }

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
    createAutoCommentAnnotation(runId, periodId, nodeId, componentId, toWorkgroupId, data) {
        var annotationId = null;
        var fromWorkgroupId = null;
        var studentWorkId = null;
        var localNotebookItemId = null;
        var notebookItemId = null;
        var annotationType = 'autoComment';
        var clientSaveTime = Date.parse(new Date());

        var annotation = this.createAnnotation(
            annotationId, runId, periodId, fromWorkgroupId, toWorkgroupId,
            nodeId, componentId, studentWorkId, localNotebookItemId, notebookItemId,
            annotationType, data, clientSaveTime
        );

        return annotation;
    }

    /**
     * Create an auto comment annotation
     * @param runId the run id
     * @param periodId the period id
     * @param nodeId the node id
     * @param componentId the component id
     * @param fromWorkgroupId the teacher workgroup id
     * @param toWorkgroupId the student workgroup id
     * @param studentWorkId the component state id
     * @param data the annotation data
     * @returns the inappropriate flag annotation
     */
    createInappropriateFlagAnnotation(runId, periodId, nodeId, componentId, fromWorkgroupId, toWorkgroupId, studentWorkId, data) {
        var annotationId = null;
        var localNotebookItemId = null;
        var notebookItemId = null;
        var annotationType = 'inappropriateFlag';
        var clientSaveTime = Date.parse(new Date());

        var annotation = this.createAnnotation(
            annotationId, runId, periodId, fromWorkgroupId, toWorkgroupId,
            nodeId, componentId, studentWorkId, localNotebookItemId, notebookItemId,
            annotationType, data, clientSaveTime
        );

        return annotation;
    }

    /**
     * Get the latest annotations for a given component (as an object)
     * @param nodeId the node id
     * @param componentId the component id
     * @param workgroupId the workgroup id
     * @param scoreType (optional) the type of score
     * e.g.
     * 'autoScore' for auto graded score
     * 'score' for teacher graded score
     * 'any' for auto graded score or teacher graded score
     * @return object containing the component's latest score and comment annotations
     */
    getLatestComponentAnnotations(nodeId, componentId, workgroupId, scoreType) {
        let latestScoreAnnotation = null;
        let latestCommentAnnotation = null;

        // get the latest score annotation for this component
        latestScoreAnnotation = this.getLatestScoreAnnotation(nodeId, componentId, workgroupId, scoreType);

        // get the latest comment annotation for this component
        latestCommentAnnotation = this.getLatestCommentAnnotation(nodeId, componentId, workgroupId, scoreType);

        return {
            'score': latestScoreAnnotation,
            'comment': latestCommentAnnotation
        };
    };

    /**
     * Get the latest annotations for a given notebook item (as an object)
     * @param workgroupId the workgroup id that did the notebook
     * @param localNotebookItemId unique id for note and its revisions ["finalReport", "xyzabc", ...]
     */
    getLatestNotebookItemAnnotations(workgroupId, localNotebookItemId) {
        let latestScoreAnnotation = null;
        let latestCommentAnnotation = null;

        // get the latest score annotation for this component
        latestScoreAnnotation = this.getLatestNotebookItemScoreAnnotation(workgroupId, localNotebookItemId);

        // get the latest comment annotation for this component
        latestCommentAnnotation = this.getLatestNotebookItemCommentAnnotation(workgroupId, localNotebookItemId);

        return {
            'score': latestScoreAnnotation,
            'comment': latestCommentAnnotation
        };
    };

    /**
     * Get the latest score annotation for this workgroup and localNotebookItemId, or null if not found
     * @param workgroupId the workgroup id that did the notebook
     * @param localNotebookItemId unique id for note and its revisions ["finalReport", "xyzabc", ...]
     */
    getLatestNotebookItemScoreAnnotation(workgroupId, localNotebookItemId) {

        let annotations = this.getAnnotations();

        // loop through all the annotations from newest to oldest
        for (let a = annotations.length - 1; a >= 0; a--) {
            let annotation = annotations[a];

            if (annotation != null && annotation.type === "score" && annotation.notebookItemId != null &&
                annotation.localNotebookItemId === localNotebookItemId) {
                return annotation;
            }
        }

        return null;
    }

    /**
     * Get the latest comment annotation for this workgroup and localNotebookItemId, or null if not found
     * @param workgroupId the workgroup id that did the notebook
     * @param localNotebookItemId unique id for note and its revisions ["finalReport", "xyzabc", ...]
     */
    getLatestNotebookItemCommentAnnotation(workgroupId, localNotebookItemId) {

        let annotations = this.getAnnotations();

        // loop through all the annotations from newest to oldest
        for (let a = annotations.length - 1; a >= 0; a--) {
            let annotation = annotations[a];

            if (annotation != null && annotation.type === "comment" && annotation.notebookItemId != null &&
                annotation.localNotebookItemId === localNotebookItemId) {
                return annotation;
            }
        }

        return null;
    }


    /**
     * Get the latest score annotation
     * @param nodeId the node id
     * @param componentId the component id
     * @param workgroupId the workgroup id
     * @param scoreType (optional) the type of score
     * e.g.
     * 'autoScore' for auto graded score
     * 'score' for teacher graded score
     * 'any' for auto graded score or teacher graded score
     * @returns the latest score annotation
     */
    getLatestScoreAnnotation(nodeId, componentId, workgroupId, scoreType) {

        var annotation = null;

        var annotations = this.getAnnotations();

        if (scoreType == null) {
            // default to 'any'
            scoreType = 'any';
        }

        // loop through all the annotations from newest to oldest
        for (var a = annotations.length - 1; a >= 0; a--) {
            var tempAnnotation = annotations[a];

            if (tempAnnotation != null) {
                var acceptAnnotation = false;
                var tempNodeId = tempAnnotation.nodeId;
                var tempComponentId = tempAnnotation.componentId;
                var tempToWorkgroupId = tempAnnotation.toWorkgroupId;
                var tempAnnotationType = tempAnnotation.type;

                // make sure the annotation values match what we are looking for
                if (nodeId == tempNodeId && componentId == tempComponentId && workgroupId == tempToWorkgroupId) {

                    if (scoreType === 'any' && (tempAnnotationType === 'autoScore' || tempAnnotationType === 'score')) {
                        // we are looking for an auto score or teacher score and have found one
                        acceptAnnotation = true;
                    } else if (scoreType === 'autoScore' && tempAnnotationType === 'autoScore') {
                        // we are looking for an auto score and have found one
                        acceptAnnotation = true;
                    } else if (scoreType === 'score' && tempAnnotationType === 'score') {
                        // we are looking for a teacher score and have found one
                        acceptAnnotation = true;
                    }

                    if (acceptAnnotation) {
                        // we have found the latest score annotation of the type we want
                        annotation = tempAnnotation;
                        break;
                    }
                }
            }
        }

        return annotation;
    }

    /**
     * Get the latest comment annotation
     * @param nodeId the node id
     * @param componentId the component id
     * @param workgroupId the workgroup id
     * @param commentType (optional) the type of comment
     * e.g.
     * 'autoComment' for auto graded comment
     * 'comment' for teacher graded comment
     * 'any' for auto graded comment or teacher graded comment
     * @returns the latest comment annotation
     */
    getLatestCommentAnnotation(nodeId, componentId, workgroupId, commentType) {

        var annotation = null;

        var annotations = this.getAnnotations();

        if (commentType == null) {
            // default to 'any'
            commentType = 'any';
        }

        // loop through all the annotations from newest to oldest
        for (var a = annotations.length - 1; a >= 0; a--) {
            var tempAnnotation = annotations[a];

            if (tempAnnotation != null) {
                var acceptAnnotation = false;
                var tempNodeId = tempAnnotation.nodeId;
                var tempComponentId = tempAnnotation.componentId;
                var tempToWorkgroupId = tempAnnotation.toWorkgroupId;
                var tempAnnotationType = tempAnnotation.type;

                // make sure the annotation values match what we are looking for
                if (nodeId == tempNodeId && componentId == tempComponentId && workgroupId == tempToWorkgroupId) {

                    if (commentType === 'any' && (tempAnnotationType === 'autoComment' || tempAnnotationType === 'comment')) {
                        // we are looking for an auto comment or teacher comment and have found one
                        acceptAnnotation = true;
                    } else if (commentType === 'autoComment' && tempAnnotationType === 'autoComment') {
                        // we are looking for an auto comment and have found one
                        acceptAnnotation = true;
                    } else if (commentType === 'comment' && tempAnnotationType === 'comment') {
                        // we are looking for a teacher comment and have found one
                        acceptAnnotation = true;
                    }

                    if (acceptAnnotation) {
                        // we have found the latest comment annotation of the type we want
                        annotation = tempAnnotation;
                        break;
                    }
                }
            }
        }

        return annotation;
    }

    /**
     * Get the score value from the score annotation
     * @param scoreAnnotation a score annotation
     * @returns the score value e.g. 5
     */
    getScoreValueFromScoreAnnotation(scoreAnnotation) {
        var scoreValue = null;

        if (scoreAnnotation != null) {
            var data = scoreAnnotation.data;

            if (data != null) {
                scoreValue = data.value;
            }
        }

        return scoreValue;
    }

    /**
     * Get all global annotations that are active and inactive for a specified node and component
     * @returns all global annotations that are active and inactive for a specified node and component
     */
    getAllGlobalAnnotationsByNodeIdAndComponentId(nodeId, componentId) {
        let allGlobalAnnotations = this.getAllGlobalAnnotations();
        let globalAnnotationsByNodeIdAndComponentId = allGlobalAnnotations.filter((globalAnnotation) => {
            return globalAnnotation.nodeId === nodeId && globalAnnotation.componentId === componentId;
        });
        return globalAnnotationsByNodeIdAndComponentId;
    };

    /**
     * Get all global annotations that are active and inactive
     * @returns all global annotations that are active and inactive
     */
    getAllGlobalAnnotations() {
        let globalAnnotations = [];

        for (let a = 0; a < this.annotations.length; a++) {
            let annotation = this.annotations[a];
            if (annotation != null && annotation.data != null) {
                if (annotation.data.isGlobal) {
                    globalAnnotations.push(annotation);
                }
            }
        }

        return globalAnnotations;
    };

    /**
     * Get all global annotations that are active and inactive and groups them by annotation group name
     * @returns all global annotations that are active and inactive
     */
    getAllGlobalAnnotationGroups() {
        let globalAnnotationGroups = [];

        for (let a = 0; a < this.annotations.length; a++) {
            let annotation = this.annotations[a];
            if (annotation != null && annotation.data != null) {
                if (annotation.data.isGlobal) {
                    // check if this global annotation can be grouped (has the same annotationGroupName as another that we've seen before)
                    if (annotation.data.annotationGroupName != null && annotation.data.annotationGroupCreatedTime != null) {
                        let sameGroupFound = false;
                        for (let g = 0; g < globalAnnotationGroups.length; g++) {
                            let globalAnnotationGroup = globalAnnotationGroups[g];
                            if (globalAnnotationGroup.annotationGroupNameAndTime == (annotation.data.annotationGroupName + annotation.data.annotationGroupCreatedTime)) {
                                // push this annotation to the end of the group
                                globalAnnotationGroup.annotations.push(annotation);
                                sameGroupFound = true;
                            }
                        }
                        if (!sameGroupFound) {
                            let annotationGroup = {
                                "annotationGroupNameAndTime": (annotation.data.annotationGroupName + annotation.data.annotationGroupCreatedTime),
                                "annotations": [annotation]
                            };
                            globalAnnotationGroups.push(annotationGroup);
                        }
                    } else {
                        // each global annotation should have a name, so it shouldn't get here
                        console.error(this.$translate('GLOBAL_ANNOTATION_DOES_NOT_HAVE_A_NAME') + annotation);
                    }
                }
            }
        }

        return globalAnnotationGroups;
    };

    /**
     * Get all global annotations that are active
     * @returns all global annotations that are active, in a group
     * [
     * {
     *   annotationGroupName:"score1",
     *   annotations:[
     *   {
     *     type:autoScore,
     *     value:1
     *   },
     *   {
     *     type:autoComment,
     *     value:"you received a score of 1."
     *   }
     *   ]
     * },
     * {
     *   annotationGroupName:"score2",
     *   annotations:[...]
     * }
     * ]
     */
    getActiveGlobalAnnotationGroups() {
        return this.activeGlobalAnnotationGroups;
    };

    /**
     * Calculates the active global annotations and groups them by annotation group name
     */
    calculateActiveGlobalAnnotationGroups() {
        this.activeGlobalAnnotationGroups = [];

        for (let a = 0; a < this.annotations.length; a++) {
            let annotation = this.annotations[a];
            if (annotation != null && annotation.data != null) {
                if (annotation.data.isGlobal && annotation.data.unGlobalizedTimestamp == null) {
                    // check if this global annotation can be grouped (has the same annotationGroupName as another that we've seen before)
                    if (annotation.data.annotationGroupName != null) {
                        let sameGroupFound = false;
                        for (let ag = 0; ag < this.activeGlobalAnnotationGroups.length; ag++) {
                            let activeGlobalAnnotationGroup = this.activeGlobalAnnotationGroups[ag];
                            if (activeGlobalAnnotationGroup.annotationGroupName == (annotation.data.annotationGroupName + '_' + annotation.data.annotationGroupCreatedTime)) {
                                // push this annotation to the end of the group
                                activeGlobalAnnotationGroup.annotations.push(annotation);
                                sameGroupFound = true;
                            }
                        }
                        if (!sameGroupFound) {
                            let annotationGroup = {
                                "annotationGroupName": annotation.data.annotationGroupName + '_' + annotation.data.annotationGroupCreatedTime,
                                "annotations": [annotation],
                                "nodeId": annotation.nodeId,
                                "componentId": annotation.componentId,
                                "serverSaveTime": annotation.serverSaveTime
                            };
                            this.activeGlobalAnnotationGroups.push(annotationGroup);
                        }
                    } else {
                        // each global annotation should have a name, so it shouldn't get here
                        console.error(his.$translate('GLOBAL_ANNOTATION_DOES_NOT_HAVE_A_NAME') + annotation);
                    }
                }
            }
        }
    }

    /**
     * Get all global annotations that are in-active
     * @returns all global annotations that are in-active
     * In-active global annotations has data.isGlobal = false and data.unGlobalizedTimestamp is set.
     */
    getInActiveGlobalAnnotations() {
        let inActiveGlobalAnnotations = [];

        for (let a = 0; a < this.annotations.length; a++) {
            let annotation = this.annotations[a];
            if (annotation != null && annotation.data != null) {
                if (annotation.data.isGlobal && annotation.data.unGlobalizedTimestamp != null) {
                    inActiveGlobalAnnotations.push(annotation);
                }
            }
        }

        return inActiveGlobalAnnotations;
    };

    /**
     * Get the latest teacher score annotation for a student work id
     * @param studentWorkId the student work id
     * @return the latest teacher score annotation for the student work
     */
    getLatestTeacherScoreAnnotationByStudentWorkId(studentWorkId) {
        return this.getLatestAnnotationByStudentWorkIdAndType(studentWorkId, 'score');
    }

    /**
     * Get the latest teacher comment annotation for a student work id
     * @param studentWorkId the student work id
     * @return the latest teacher comment annotation for the student work
     */
    getLatestTeacherCommentAnnotationByStudentWorkId(studentWorkId) {
        return this.getLatestAnnotationByStudentWorkIdAndType(studentWorkId, 'comment');
    }

    /**
     * Get the latest auto score annotation for a student work id
     * @param studentWorkId the student work id
     * @return the latest auto score annotation for the student work
     */
    getLatestAutoScoreAnnotationByStudentWorkId(studentWorkId) {
        return this.getLatestAnnotationByStudentWorkIdAndType(studentWorkId, 'autoScore');
    }

    /**
     * Get the latest auto comment annotation for a student work id
     * @param studentWorkId the student work id
     * @return the latest auto comment annotation for the student work
     */
    getLatestAutoCommentAnnotationByStudentWorkId(studentWorkId) {
        return this.getLatestAnnotationByStudentWorkIdAndType(studentWorkId, 'autoComment');
    }

    /**
     * Get the latest annotation for the given student work and annotation type
     * @param studentWorkId the student work id
     * @param type the type of annotation
     * @return the latest annotation for the given student work and annotation type
     */
    getLatestAnnotationByStudentWorkIdAndType(studentWorkId, type) {

        // loop through all the annotations backwards
        for (var a = this.annotations.length - 1; a >= 0; a--) {

            // get an annotation
            var annotation = this.annotations[a];

            if (annotation != null) {
                if (studentWorkId == annotation.studentWorkId && type == annotation.type) {
                    /*
                     * we have found an annotation with the given student work
                     * id and annotation type
                     */
                    return annotation;
                }
            }
        }

        return null;
    }
}

AnnotationService.$inject = [
    '$filter',
    '$http',
    '$q',
    '$rootScope',
    'ConfigService',
    'ProjectService',
    'UtilService'
];

export default AnnotationService;
