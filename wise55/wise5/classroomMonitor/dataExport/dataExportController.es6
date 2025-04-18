'use strict';

class DataExportController {

    constructor($injector,
                $rootScope,
                $scope,
                $state,
                AnnotationService,
                ConfigService,
                ProjectService,
                StudentStatusService,
                TeacherDataService,
                TeacherWebSocketService,
                UtilService) {

        this.$injector = $injector;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$state = $state;
        this.AnnotationService = AnnotationService;
        this.ConfigService = ConfigService;
        this.ProjectService = ProjectService;
        this.StudentStatusService = StudentStatusService;
        this.TeacherDataService = TeacherDataService;
        this.TeacherWebSocketService = TeacherWebSocketService;
        this.UtilService = UtilService;
        this.exportStepSelectionType = "exportAllSteps";
        this.exportType = null;  // type of export: [latestWork, allWork, events]
        this.componentTypeToComponentService = {};

        this.setDefaultExportSettings();

        // get the project
        // create the mapping of node id to order for the import project
        this.ProjectService.retrieveProject().then((projectJSON) => {
            this.project = projectJSON;
            // calculate the node order of the import project
            let nodeOrderOfProject = this.ProjectService.getNodeOrderOfProject(this.project);
            this.projectIdToOrder = nodeOrderOfProject.idToOrder;
            this.projectItems = nodeOrderOfProject.nodes;
        });

        // save event when data export view is displayed
        let context = "ClassroomMonitor", nodeId = null, componentId = null, componentType = null,
            category = "Navigation", event = "dataExportViewDisplayed", data = {};
        this.TeacherDataService.saveEvent(context, nodeId, componentId, componentType, category, event, data);
    }

    hello() {
        ocpu.seturl("//128.32.189.240:81/ocpu/user/wiser/library/wiser/R");
        // perform the request
        var req = ocpu.call("hello", {
            "name": "Hiroki"
        }, (session) => {
            session.getStdout((returnedCSVString) => {
                var csvBlob = new Blob([returnedCSVString], {type: 'text/csv'});
                var csvUrl = URL.createObjectURL(csvBlob);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = csvUrl;
                a.download = "export_" + runId + ".csv";
                a.click();

                // timeout is required for FF.
                window.setTimeout(() => {
                    URL.revokeObjectURL(csvUrl);  // tell browser to release URL reference
                }, 3000);
            });
        });
    };

    /**
     * Export all or latest work for this run in CSV format
     * latestWork, allWork, and events will call this function with a null exportType.
     */
    export(exportType = null) {
        if (exportType == null) {
            exportType = this.exportType;
        }

        // save event for this export request
        let context = "ClassroomMonitor", nodeId = null, componentId = null, componentType = null,
            category = "UserInteraction", event = "exportRequested", data = {"exportType": exportType};
        this.TeacherDataService.saveEvent(context, nodeId, componentId, componentType, category, event, data);

        if (exportType === "allStudentWork") {
            this.exportAllStudentWork();
        } else if (exportType === "latestStudentWork") {
            this.exportLatestStudentWork();
        } else if (exportType === "events") {
            this.exportEvents();
        } else if (exportType === "latestNotebookItems" || exportType === "allNotebookItems") {
            this.exportNotebookItems(exportType);
        } else if (exportType === "notifications") {
            this.exportNotifications();
        } else if (exportType === "studentAssets") {
            this.exportStudentAssets();
        } else if (exportType === "oneWorkgroupPerRow") {
            this.exportOneWorkgroupPerRow();
        }
    }

    /**
     * Export all the student work
     */
    exportAllStudentWork() {
        this.exportStudentWork("allStudentWork");
    }

    /**
     * Export the latest student work
     */
    exportLatestStudentWork() {
        this.exportStudentWork("latestStudentWork");
    }

    /**
     * Export all the student work
     * @param exportType the export type e.g. "allStudentWork" or "latestStudentWork"
     */
    exportStudentWork(exportType) {

        var selectedNodes = null;
        var selectedNodesMap = null;

        if (this.exportStepSelectionType === "exportSelectSteps") {
            // we are going to export the work for the steps that were selected

            // get the steps that were selected
            selectedNodes = this.getSelectedNodesToExport();

            if (selectedNodes == null || selectedNodes.length == 0) {
                /*
                 * the user did not select any steps to export so we will not
                 * generate the export
                 */
                alert('Please select a step to export.');
                return;
            } else {
                /*
                 * the user has selected some steps/components so we will
                 * generate a selected nodes map
                 */
                selectedNodesMap = this.getSelectedNodesMap(selectedNodes);
            }
        }

        // request the student data from the server and then generate the export
        this.TeacherDataService.getExport("allStudentWork", selectedNodes).then((result) => {

            // get the workgroups in the class
            var workgroups = this.ConfigService.getClassmateUserInfosSortedByWorkgroupId();

            // get the run id
            var runId = this.ConfigService.getRunId();

            // the rows that will show up in the export
            var rows = [];

            // the counter for the rows
            var rowCounter = 1;

            // mapping from column name to column number
            var columnNameToNumber = {};

            // an array of column names
            var columnNames = [
                "#",
                "Workgroup ID",
                "WISE ID 1",
                "WISE ID 2",
                "WISE ID 3",
                "Class Period",
                "Project ID",
                "Project Name",
                "Run ID",
                "Start Date",
                "End Date",
                "Student Work ID",
                "Server Timestamp",
                "Client Timestamp",
                "Node ID",
                "Component ID",
                "Component Part Number",
                "Teacher Score Server Timestamp",
                "Teacher Score Client Timestamp",
                "Teacher Score",
                "Max Teacher Score",
                "Teacher Comment Server Timestamp",
                "Teacher Comment Client Timestamp",
                "Teacher Comment",
                "Auto Score Server Timestamp",
                "Auto Score Client Timestamp",
                "Auto Score",
                "Max Auto Score",
                "Auto Comment Server Timestamp",
                "Auto Comment Client Timestamp",
                "Auto Comment",
                "Step Title",
                "Component Type",
                "Component Prompt",
                "Student Data",
                "Component Revision Counter",
                "Is Correct",
                "Is Submit",
                "Submit Count",
                "Response"
            ];

            var headerRow = [];

            // generate the header row by looping through all the column names
            for (var c = 0; c < columnNames.length; c++) {

                // get a column name
                var columnName = columnNames[c];

                if (columnName != null) {
                    // add a mapping from column name to column number
                    columnNameToNumber[columnName] = c;
                }

                // add the column name to the header row
                headerRow.push(columnName);
            }

            // add the header row to the rows
            rows.push(headerRow);

            if (workgroups != null) {

                // loop through all the workgroup
                for (var w = 0; w < workgroups.length; w++) {

                    // get a workgroup
                    var workgroup = workgroups[w];

                    if (workgroup != null) {

                        // get the workgroup information
                        var workgroupId = workgroup.workgroupId;
                        var periodName = workgroup.periodName;
                        var userInfo = this.ConfigService.getUserInfoByWorkgroupId(workgroupId);

                        // get the WISE IDs
                        var wiseIds = this.ConfigService.getWISEIds(workgroupId);
                        var wiseId1 = wiseIds[0];
                        var wiseId2 = wiseIds[1];
                        var wiseId3 = wiseIds[2];

                        /*
                         * a mapping from component to component revision counter.
                         * the key will be {{nodeId}}_{{componentId}} and the
                         * value will be a number.
                         */
                        var componentRevisionCounter = {};

                        // get the component states for the workgroup
                        var componentStates = [];

                        if (exportType === "allStudentWork") {
                            componentStates = this.TeacherDataService.getComponentStatesByWorkgroupId(workgroupId);
                        } else if (exportType === "latestStudentWork") {
                            componentStates = this.TeacherDataService.getLatestComponentStatesByWorkgroupId(workgroupId);
                        }

                        if (componentStates != null) {

                            // loop through all the component states
                            for (var c = 0; c < componentStates.length; c++) {

                                // get a component state
                                var componentState = componentStates[c];

                                if (componentState != null) {

                                    var exportRow = true;

                                    if (this.exportStepSelectionType === "exportSelectSteps") {
                                        // we are only exporting selected steps
                                        if (!this.isComponentSelected(selectedNodesMap, componentState.nodeId, componentState.componentId)) {
                                            // the component state is for a step that is not selected
                                            exportRow = false;
                                        }
                                    }

                                    if (exportRow) {

                                        // create the export row
                                        var row = this.createStudentWorkExportRow(columnNames, columnNameToNumber, rowCounter, workgroupId, wiseId1, wiseId2, wiseId3, periodName, componentRevisionCounter, componentState);

                                        // add the row to the rows
                                        rows.push(row);

                                        // increment the row counter
                                        rowCounter++;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            var fileName = "";

            // make the file name
            if (exportType === "allStudentWork") {
                fileName = runId + "_all_work.csv";
            } else if (exportType === "latestStudentWork") {
                fileName = runId + "_latest_work.csv";
            }

            // generate the csv file and have the client download it
            this.generateCSVFile(rows, fileName);
        });
    }

    /**
     * Create the array that will be used as a row in the student work export
     * @param columnNames all the header column name
     * @param columnNameToNumber the mapping from column name to column number
     * @param rowCounter the current row number
     * @param workgroupId the workgroup id
     * @param wiseId1 the WISE ID 1
     * @param wiseId2 the WISE ID 2
     * @param wiseId3 the WISE ID 3
     * @param periodName the period name
     * @param componentRevisionCounter the mapping of component to revision counter
     * @param componentState the component state
     * @return an array containing the cells in the row
     */
    createStudentWorkExportRow(columnNames, columnNameToNumber, rowCounter, workgroupId, wiseId1, wiseId2, wiseId3, periodName, componentRevisionCounter, componentState) {

        // create the row and prepopulate the elements with an empty string
        var row = new Array(columnNames.length);
        row.fill("");

        // set the row number
        row[columnNameToNumber["#"]] = rowCounter;

        // set workgroup id
        row[columnNameToNumber["Workgroup ID"]] = workgroupId;

        if (wiseId1 != null) {
            // set the WISE ID 1
            row[columnNameToNumber["WISE ID 1"]] = wiseId1;
        }

        if (wiseId2 != null) {
            // set the WISE ID 2
            row[columnNameToNumber["WISE ID 2"]] = wiseId2;
        }

        if (wiseId3 != null) {
            // set the WISE ID 3
            row[columnNameToNumber["WISE ID 3"]] = wiseId3;
        }

        row[columnNameToNumber["Class Period"]] = periodName;

        // set the project id
        row[columnNameToNumber["Project ID"]] = this.ConfigService.getProjectId();

        // set the project name
        row[columnNameToNumber["Project Name"]] = this.ProjectService.getProjectTitle();

        // set the run id
        row[columnNameToNumber["Run ID"]] = this.ConfigService.getRunId();

        // set the student work id
        row[columnNameToNumber["Student Work ID"]] = componentState.id;

        if (componentState.serverSaveTime != null) {
            // get the server save time

            // get the time stamp as a pretty printed date time string
            var formattedDateTime = this.UtilService.convertMillisecondsToFormattedDateTime(componentState.serverSaveTime);

            // set the time stamp string e.g. Wed Apr 06 2016 9:05:38 AM
            row[columnNameToNumber["Server Timestamp"]] = formattedDateTime;
        }

        if (componentState.clientSaveTime != null) {
            // get the client save time
            var clientSaveTime = new Date(componentState.clientSaveTime);

            if (clientSaveTime != null) {
                // get the time stamp string e.g. Wed Apr 06 2016 9:05:38 AM
                var clientSaveTimeString = clientSaveTime.toDateString() + " " + clientSaveTime.toLocaleTimeString();
                row[columnNameToNumber["Client Timestamp"]] = clientSaveTimeString;
            }
        }

        // set the node id
        row[columnNameToNumber["Node ID"]] = componentState.nodeId;

        // set the component id
        row[columnNameToNumber["Component ID"]] = componentState.componentId;

        // set the step title
        row[columnNameToNumber["Step Title"]] = this.ProjectService.getNodePositionAndTitleByNodeId(componentState.nodeId);

        // get the component part number
        var componentPartNumber = this.ProjectService.getComponentPositionByNodeIdAndComponentId(componentState.nodeId, componentState.componentId) + 1;

        // set the component part number
        row[columnNameToNumber["Component Part Number"]] = componentPartNumber;

        // get the component
        var component = this.ProjectService.getComponentByNodeIdAndComponentId(componentState.nodeId, componentState.componentId);

        if (component != null) {
            // set the component type
            row[columnNameToNumber["Component Type"]] = component.type;

            if (component.prompt != null) {
                // get the prompt with the html tags removed
                var prompt = this.UtilService.removeHTMLTags(component.prompt);

                // replace " with ""
                prompt = prompt.replace(/"/g, '""');

                // set the prompt with the html tags removed
                row[columnNameToNumber["Component Prompt"]] = prompt;
            }
        }

        // get the annotations
        var teacherScoreAnnotation = this.AnnotationService.getLatestTeacherScoreAnnotationByStudentWorkId(componentState.id);
        var teacherCommentAnnotation = this.AnnotationService.getLatestTeacherCommentAnnotationByStudentWorkId(componentState.id);
        var autoScoreAnnotation = this.AnnotationService.getLatestAutoScoreAnnotationByStudentWorkId(componentState.id);
        var autoCommentAnnotation = this.AnnotationService.getLatestAutoCommentAnnotationByStudentWorkId(componentState.id);

        if (teacherScoreAnnotation != null) {
            // handle the teacher score

            if (teacherScoreAnnotation.serverSaveTime != null) {
                var teacherScoreServerSaveTime = new Date(teacherScoreAnnotation.serverSaveTime);

                if (teacherScoreServerSaveTime != null) {
                    // get the teacher score server timestamp e.g. Wed Apr 06 2016 9:05:38 AM
                    var teacherScoreServerSaveTimeString = teacherScoreServerSaveTime.toDateString() + " " + teacherScoreServerSaveTime.toLocaleTimeString();
                    row[columnNameToNumber["Teacher Score Server Timestamp"]] = teacherScoreServerSaveTimeString;
                }
            }

            if (teacherScoreAnnotation.clientSaveTime != null) {
                var teacherScoreClientSaveTime = new Date(teacherScoreAnnotation.clientSaveTime);

                if (teacherScoreClientSaveTime != null) {
                    // get the teacher score client timestamp e.g. Wed Apr 06 2016 9:05:38 AM
                    var teacherScoreClientSaveTimeString = teacherScoreClientSaveTime.toDateString() + " " + teacherScoreClientSaveTime.toLocaleTimeString();
                    row[columnNameToNumber["Teacher Score Client Timestamp"]] = teacherScoreClientSaveTimeString;
                }
            }

            var data = teacherScoreAnnotation.data;

            if (data != null) {
                // get the teacher score
                var score = data.value;

                if (score != null) {
                    // set the teacher score
                    row[columnNameToNumber["Teacher Score"]] = score;
                }

                // get the max score if available
                var maxScore = this.ProjectService.getMaxScoreForComponent(componentState.nodeId, componentState.componentId);

                if (maxScore != null) {
                    // set the max score
                    row[columnNameToNumber["Max Teacher Score"]] = maxScore;
                }
            }
        }

        if (teacherCommentAnnotation != null) {
            // handle the teacher comment

            if (teacherCommentAnnotation.serverSaveTime != null) {
                var teacherCommentServerSaveTime = new Date(teacherCommentAnnotation.serverSaveTime);

                if (teacherCommentServerSaveTime != null) {
                    // get the teacher comment server timestamp e.g. Wed Apr 06 2016 9:05:38 AM
                    var teacherCommentServerSaveTimeString = teacherCommentServerSaveTime.toDateString() + " " + teacherCommentServerSaveTime.toLocaleTimeString();
                    row[columnNameToNumber["Teacher Comment Server Timestamp"]] = teacherCommentServerSaveTimeString;
                }
            }

            if (teacherCommentAnnotation.clientSaveTime != null) {
                var teacherCommentClientSaveTime = new Date(teacherCommentAnnotation.clientSaveTime);

                if (teacherCommentClientSaveTime != null) {
                    // get the teacher comment client timestamp e.g. Wed Apr 06 2016 9:05:38 AM
                    var teacherCommentClientSaveTimeString = teacherCommentClientSaveTime.toDateString() + " " + teacherCommentClientSaveTime.toLocaleTimeString();
                    row[columnNameToNumber["Teacher Comment Client Timestamp"]] = teacherCommentClientSaveTimeString;
                }
            }

            var data = teacherCommentAnnotation.data;

            if (data != null) {
                // get the teacher comment
                var comment = data.value;

                if (comment != null) {
                    // set the teacher comment
                    row[columnNameToNumber["Teacher Comment"]] = comment;
                }
            }
        }

        if (autoScoreAnnotation != null) {
            // handle the auto score

            if (autoScoreAnnotation.serverSaveTime != null) {
                var autoScoreServerSaveTime = new Date(autoScoreAnnotation.serverSaveTime);

                if (autoScoreServerSaveTime != null) {
                    // get the auto score server timestamp e.g. Wed Apr 06 2016 9:05:38 AM
                    var autoScoreServerSaveTimeString = autoScoreServerSaveTime.toDateString() + " " + autoScoreServerSaveTime.toLocaleTimeString();
                    row[columnNameToNumber["Auto Score Server Timestamp"]] = autoScoreServerSaveTimeString;
                }
            }

            if (autoScoreAnnotation.clientSaveTime != null) {
                var autoScoreClientSaveTime = new Date(autoScoreAnnotation.clientSaveTime);

                if (autoScoreClientSaveTime != null) {
                    // get the auto score client timestamp e.g. Wed Apr 06 2016 9:05:38 AM
                    var autoScoreClientSaveTimeString = autoScoreClientSaveTime.toDateString() + " " + autoScoreClientSaveTime.toLocaleTimeString();
                    row[columnNameToNumber["Auto Score Client Timestamp"]] = autoScoreClientSaveTimeString;
                }
            }

            var data = autoScoreAnnotation.data;

            if (data != null) {
                // get the auto score
                var autoScore = data.value;

                if (autoScore != null) {
                    // set the auto score
                    row[columnNameToNumber["Auto Score"]] = autoScore;
                }

                // get the max auto score
                var maxAutoScore = data.maxAutoScore;

                if (maxAutoScore != null) {
                    // set the max auto score
                    row[columnNameToNumber["Max Auto Score"]] = maxAutoScore;
                }
            }
        }

        if (autoCommentAnnotation != null) {
            // handle the auto comment

            if (autoCommentAnnotation.serverSaveTime != null) {
                var autoCommentServerSaveTime = new Date(autoCommentAnnotation.serverSaveTime);

                if (autoCommentServerSaveTime != null) {
                    // get the auto comment server timestamp e.g. Wed Apr 06 2016 9:05:38 AM
                    var autoCommentServerSaveTimeString = autoCommentServerSaveTime.toDateString() + " " + autoCommentServerSaveTime.toLocaleTimeString();
                    row[columnNameToNumber["Auto Comment Server Timestamp"]] = autoCommentServerSaveTimeString;
                }
            }

            if (autoCommentAnnotation.clientSaveTime != null) {
                var autoCommentClientSaveTime = new Date(autoCommentAnnotation.clientSaveTime);

                if (autoCommentClientSaveTime != null) {
                    // get the auto comment timestamp e.g. Wed Apr 06 2016 9:05:38 AM
                    var autoCommentClientSaveTimeString = autoCommentClientSaveTime.toDateString() + " " + autoCommentClientSaveTime.toLocaleTimeString();
                    row[columnNameToNumber["Auto Comment Client Timestamp"]] = autoCommentClientSaveTimeString;
                }
            }

            var data = autoCommentAnnotation.data;

            if (data != null) {
                // get the auto comment
                var autoComment = data.value;

                if (autoComment != null) {
                    // set the auto comment
                    row[columnNameToNumber["Auto Comment"]] = this.UtilService.removeHTMLTags(autoComment);
                }
            }
        }

        var studentData = componentState.studentData;

        if (studentData != null) {
            // set the student data JSON
            row[columnNameToNumber["Student Data"]] = studentData;

            var isCorrect = studentData.isCorrect;

            if (isCorrect != null) {
                // set the is correct value
                if (isCorrect) {
                    row[columnNameToNumber["Is Correct"]] = 1;
                } else {
                    row[columnNameToNumber["Is Correct"]] = 0;
                }
            }
        }

        // get the component type
        var componentType = componentState.componentType;

        if (componentType != null) {
            // get the component type service
            var componentService = this.$injector.get(componentType + 'Service');

            if (componentService != null && componentService.getStudentDataString != null) {

                // get the student data string from the component state
                var studentDataString = componentService.getStudentDataString(componentState);

                if (studentDataString != null) {
                    // set the response
                    row[columnNameToNumber["Response"]] = studentDataString;
                }
            }
        }

        // create the {{nodeId}}_{{componentId}} key to look up the component revision counter
        var nodeIdAndComponentId = componentState.nodeId + "_" + componentState.componentId;

        if (componentRevisionCounter[nodeIdAndComponentId] == null) {
            // initialize the component revision counter for this component to 1 if there is no entry
            componentRevisionCounter[nodeIdAndComponentId] = 1;
        }

        // get the revision counter
        var revisionCounter = componentRevisionCounter[nodeIdAndComponentId];

        if (componentState.revisionCounter == null) {
            /*
             * use the revision counter obtained from the componentRevisionCounter
             * mapping. this case will happen when we are exporting all student
             * work.
             */
            row[columnNameToNumber["Component Revision Counter"]] = revisionCounter;
        } else {
            /*
             * use the revision counter from the value in the component state.
             * this case will happen when we are exporting latest student work
             * because the revision counter needs to be previously calculated
             * and then set into the component state
             */
            row[columnNameToNumber["Component Revision Counter"]] = componentState.revisionCounter;
        }

        // increment the revision counter
        componentRevisionCounter[nodeIdAndComponentId] = revisionCounter + 1;

        var isSubmit = componentState.isSubmit;

        if (isSubmit) {
            // set the is submit value
            row[columnNameToNumber["Is Submit"]] = 1;

            if (studentData != null) {
                var submitCounter = studentData.submitCounter;

                if (submitCounter != null) {
                    // set the submit counter
                    row[columnNameToNumber["Submit Count"]] = submitCounter;
                }
            }
        } else {
            // set the is submit value
            row[columnNameToNumber["Is Submit"]] = 0;
        }

        return row;
    }

    /**
     * Check if a component is selected
     * @param selectedNodesMap a map of node id and component id strings
     * to true
     * example
     * {
     *     "node1-38fj20egrj": true,
     *     "node1-20dbj2e0sf": true
     * }
     * @param nodeId the node id to check
     * @param componentId the component id to check
     * @return whether the component is selected
     */
    isComponentSelected(selectedNodesMap, nodeId, componentId) {
        var result = false;

        if (selectedNodesMap != null) {

            if (nodeId != null && componentId != null &&
                selectedNodesMap[nodeId + "-" + componentId] == true) {

                // the component is selected
                result = true;
            }
        }

        return result;
    }

    /**
     * Check if a component is selected
     * @param selectedNodesMap a map of node id to true
     * example
     * {
     *     "node1": true,
     *     "node2": true
     * }
     * @param nodeId the node id to check
     * @param componentId the component id to check
     * @return whether the node is selected
     */
    isNodeSelected(selectedNodesMap, nodeId) {
        var result = false;

        if (selectedNodesMap != null) {

            if (nodeId != null && selectedNodesMap[nodeId] == true) {
                // the node is selected
                result = true;
            }
        }

        return result;
    }

    /**
     * Generate the csv file and have the client download it
     * @param rows a 2D array that represents the rows in the export
     * each row contains an array. the inner array contains strings or
     * numbers which represent the cell values in the export.
     * @param fileName the name of the file that will be generated
     */
    generateCSVFile(rows, fileName) {

        // used to accumulate the csv string
        var csvString = "";

        if (rows != null) {

            // loop through all the rows
            for (var r = 0; r < rows.length; r++) {
                var row = rows[r];

                if (row != null) {

                    // loop through all the cells
                    for (var c = 0; c < row.length; c++) {

                        // get the cell value
                        var cell = row[c];

                        if (typeof cell === "object") {
                            /*
                             * the cell value is an object so we will obtain the
                             * string representation of the object and wrap it
                             * in quotes
                             */

                            // convert the
                            cell = JSON.stringify(cell);

                            // replace " with ""
                            cell = cell.replace(/"/g, '""');

                            if (cell != null && cell.length >= 32767) {
                                /*
                                 * the cell value is larger than the allowable
                                 * excel cell size so we will display the string
                                 * "Data Too Large" instead
                                 */
                                cell = "Data Too Large";
                            }

                            // wrap the cell in quotes
                            cell = '"' + cell + '"';
                        } else if (typeof cell === "string") {
                            // the cell value is a string

                            if (cell != null && cell.length >= 32767) {
                                /*
                                 * the cell value is larger than the allowable
                                 * excel cell size so we will display the string
                                 * "Data Too Large" instead
                                 */
                                cell = "Data Too Large";
                            }

                            // wrap the cell in quotes
                            cell = '"' + cell + '"';
                        }

                        // separate cells with a comma
                        csvString += cell + ",";
                    }

                    // separate lines
                    csvString += "\r\n";
                }
            }
        }

        // generate the blob that will be written to the file
        let csvBlob = new Blob([csvString], {type: 'text/csv'});

        // create a url to the blob object
        let csvUrl = URL.createObjectURL(csvBlob);

        // create an <a> element
        let a = document.createElement("a");

        // add the <a> element to the body
        document.body.appendChild(a);

        // set the url of the <a> element
        a.href = csvUrl;

        // set the file name
        a.download = fileName;

        // click the <a> element to download the file
        a.click();

        // timeout is required for FF.
        window.setTimeout(() => {
            URL.revokeObjectURL(csvUrl);  // tell browser to release URL reference
        }, 3000);
    }

    escapeContent(str) {
        return str
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r')
            .replace(/[\t]/g, '\\t');
    }

    /**
     * Export the events
     */
    exportEvents() {

        var selectedNodes = null;
        var selectedNodesMap = null;

        if (this.exportStepSelectionType === "exportSelectSteps") {
            // we are going to export the work for the steps that were selected

            // get the steps that were selected
            selectedNodes = this.getSelectedNodesToExport();

            if (selectedNodes == null || selectedNodes.length == 0) {
                /*
                 * the user did not select any steps to export so we will not
                 * generate the export
                 */
                alert('Please select a step to export.');
                return;
            } else {
                /*
                 * the user has selected some steps/components so we will
                 * generate a selected nodes map
                 */
                selectedNodesMap = this.getSelectedNodesMap(selectedNodes);
            }
        }

        // request the student data from the server and then generate the export
        this.TeacherDataService.getExport("events", selectedNodes).then((result) => {

            // get the workgroups in the class
            var workgroups = this.ConfigService.getClassmateUserInfosSortedByWorkgroupId();

            // get the run id
            var runId = this.ConfigService.getRunId();

            // the rows that will show up in the export
            var rows = [];

            // the counter for the rows
            var rowCounter = 1;

            // mapping from column name to column number
            var columnNameToNumber = {};

            // an array of column names
            var columnNames = [
                "#",
                "Workgroup ID",
                "WISE ID 1",
                "WISE ID 2",
                "WISE ID 3",
                "Class Period",
                "Project ID",
                "Project Name",
                "Run ID",
                "Start Date",
                "End Date",
                "Event ID",
                "Server Timestamp",
                "Client Timestamp",
                "Node ID",
                "Component ID",
                "Component Part Number",
                "Step Title",
                "Component Type",
                "Component Prompt",
                "Group Event Counter",
                "Context",
                "Category",
                "Event",
                "Event Data",
                "Response"
            ];

            var headerRow = [];

            // generate the header row by looping through all the column names
            for (var c = 0; c < columnNames.length; c++) {

                // get a column name
                var columnName = columnNames[c];

                if (columnName != null) {
                    // add a mapping from column name to column number
                    columnNameToNumber[columnName] = c;
                }

                // add the column name to the header row
                headerRow.push(columnName);
            }

            // add the header row to the rows
            rows.push(headerRow);

            if (workgroups != null) {

                // loop through all the workgroup
                for (var w = 0; w < workgroups.length; w++) {

                    // get a workgroup
                    var workgroup = workgroups[w];

                    if (workgroup != null) {

                        // get the workgroup information
                        var workgroupId = workgroup.workgroupId;
                        var periodName = workgroup.periodName;
                        var userInfo = this.ConfigService.getUserInfoByWorkgroupId(workgroupId);

                        // get the WISE IDs
                        var wiseIds = this.ConfigService.getWISEIds(workgroupId);
                        var wiseId1 = wiseIds[0];
                        var wiseId2 = wiseIds[1];
                        var wiseId3 = wiseIds[2];

                        /*
                         * a mapping from component to component event count.
                         * the key will be {{nodeId}}_{{componentId}} and the
                         * value will be a number.
                         */
                        var componentEventCount = {};

                        // get the events for the workgroup
                        var events = [];

                        events = this.TeacherDataService.getEventsByWorkgroupId(workgroupId);

                        if (events != null) {

                            // loop through all the events
                            for (var e = 0; e < events.length; e++) {

                                // get an event
                                var event = events[e];

                                if (event != null) {

                                    var exportRow = true;


                                    if (this.exportStepSelectionType === "exportSelectSteps") {
                                        // we are only exporting selected steps

                                        if (event.nodeId != null && event.componentId != null) {
                                            // this is a component event

                                            if (!this.isComponentSelected(selectedNodesMap, event.nodeId, event.componentId)) {
                                                // the event is for a component that is not selected
                                                exportRow = false;
                                            }
                                        } else if (event.nodeId != null) {
                                            // this is a node event

                                            if (!this.isNodeSelected(selectedNodesMap, event.nodeId)) {
                                                // the event is for a node that is not selected
                                                exportRow = false;
                                            }
                                        } else {
                                            // this is a global event
                                            exportRow = false;
                                        }
                                    }


                                    if (exportRow) {

                                        // create the export row
                                        var row = this.createEventExportRow(columnNames, columnNameToNumber, rowCounter, workgroupId, wiseId1, wiseId2, wiseId3, periodName, componentEventCount, event);

                                        // add the row to the rows
                                        rows.push(row);

                                        // increment the row counter
                                        rowCounter++;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            var fileName = runId + "_events.csv";

            // generate the csv file and have the client download it
            this.generateCSVFile(rows, fileName);
        });
    }

    /**
     * Create the array that will be used as a row in the events export
     * @param columnNames all the header column name
     * @param columnNameToNumber the mapping from column name to column number
     * @param rowCounter the current row number
     * @param workgroupId the workgroup id
     * @param wiseId1 the WISE ID 1
     * @param wiseId2 the WISE ID 2
     * @param wiseId3 the WISE ID 3
     * @param periodName the period name
     * @param componentEventCount the mapping of component to event count
     * @param event the event
     * @return an array containing the cells in the row
     */
    createEventExportRow(columnNames, columnNameToNumber, rowCounter, workgroupId, wiseId1, wiseId2, wiseId3, periodName, componentEventCount, event) {

        // create the row and prepopulate the elements with an empty string
        var row = new Array(columnNames.length);
        row.fill("");

        // set the row number
        row[columnNameToNumber["#"]] = rowCounter;

        // set workgroup id
        row[columnNameToNumber["Workgroup ID"]] = workgroupId;

        if (wiseId1 != null) {
            // set the WISE ID 1
            row[columnNameToNumber["WISE ID 1"]] = wiseId1;
        }

        if (wiseId2 != null) {
            // set the WISE ID 2
            row[columnNameToNumber["WISE ID 2"]] = wiseId2;
        }

        if (wiseId3 != null) {
            // set the WISE ID 3
            row[columnNameToNumber["WISE ID 3"]] = wiseId3;
        }

        row[columnNameToNumber["Class Period"]] = periodName;

        // set the project id
        row[columnNameToNumber["Project ID"]] = this.ConfigService.getProjectId();

        // set the project name
        row[columnNameToNumber["Project Name"]] = this.ProjectService.getProjectTitle();

        // set the run id
        row[columnNameToNumber["Run ID"]] = this.ConfigService.getRunId();

        // set the student work id
        row[columnNameToNumber["Event ID"]] = event.id;

        if (event.serverSaveTime != null) {
            // get the server save time
            var serverSaveTime = new Date(event.serverSaveTime);

            if (serverSaveTime != null) {
                var serverSaveTimeString = serverSaveTime.toDateString() + " " + serverSaveTime.toLocaleTimeString();

                // set the timestamp
                row[columnNameToNumber["Server Timestamp"]] = serverSaveTimeString;
            }
        }

        if (event.clientSaveTime != null) {
            // get the client save time
            var clientSaveTime = new Date(event.clientSaveTime);

            if (clientSaveTime != null) {
                var clientSaveTimeString = clientSaveTime.toDateString() + " " + clientSaveTime.toLocaleTimeString();

                row[columnNameToNumber["Client Timestamp"]] = clientSaveTimeString;
            }
        }

        if (event.nodeId != null) {
            // set the node id
            row[columnNameToNumber["Node ID"]] = event.nodeId;
        }

        if (event.componentId != null) {
            // set the component id
            row[columnNameToNumber["Component ID"]] = event.componentId;
        }

        var stepTitle = this.ProjectService.getNodePositionAndTitleByNodeId(event.nodeId);

        if (stepTitle != null) {
            // set the step title
            row[columnNameToNumber["Step Title"]] = stepTitle;
        }

        // get the component part number
        var componentPartNumber = this.ProjectService.getComponentPositionByNodeIdAndComponentId(event.nodeId, event.componentId);

        if (componentPartNumber != -1) {
            // set the component part number
            row[columnNameToNumber["Component Part Number"]] = componentPartNumber + 1;
        }

        // get the component
        var component = this.ProjectService.getComponentByNodeIdAndComponentId(event.nodeId, event.componentId);

        if (component != null) {
            // set the component type
            row[columnNameToNumber["Component Type"]] = component.type;

            // get the prompt with the html tags removed
            var prompt = this.UtilService.removeHTMLTags(component.prompt);

            // replace " with ""
            prompt = prompt.replace(/"/g, '""');

            // set the prompt with the html tags removed
            row[columnNameToNumber["Component Prompt"]] = prompt;
        }

        // create the {{nodeId}}_{{componentId}} key to look up the component event count
        var nodeIdAndComponentId = event.nodeId + "_" + event.componentId;

        if (componentEventCount[nodeIdAndComponentId] == null) {
            // initialize the component event count for this component to 1 if there is no entry
            componentEventCount[nodeIdAndComponentId] = 1;
        }

        // get the revision counter
        var revisionCounter = componentEventCount[nodeIdAndComponentId];
        row[columnNameToNumber["Group Event Counter"]] = revisionCounter;

        // increment the revision counter
        componentEventCount[nodeIdAndComponentId] = revisionCounter + 1;

        // set the context
        if (event.context != null) {
            row[columnNameToNumber["Context"]] = event.context;
        }

        // set the category
        if (event.category != null) {
            row[columnNameToNumber["Category"]] = event.category;
        }

        // set the event
        if (event.event != null) {
            row[columnNameToNumber["Event"]] = event.event;
        }

        // set the event data JSON
        row[columnNameToNumber["Event Data"]] = event;

        // get the pretty printed representation of the event
        var response = this.getEventResponse(event);

        // set the response
        row[columnNameToNumber["Response"]] = response;

        return row;
    }

    /**
     * Get the pretty printed representation of the event
     * @param event the event JSON object
     * @return the pretty printed representation of the event
     */
    getEventResponse(event) {

        var response = " ";

        if (event != null) {
            if (event.event == "branchPathTaken") {
                /*
                 * this is a branch path taken event so we will show the title
                 * of the first step in the branch path that was taken
                 */
                if (event.data != null && event.data.toNodeId != null) {

                    // get the toNodeId
                    var toNodeId = event.data.toNodeId;

                    // get the step number and title of the toNodeId
                    var stepTitle = this.ProjectService.getNodePositionAndTitleByNodeId(toNodeId);

                    response = stepTitle;
                }
            }
        }

        return response;
    }

    exportNotebookItems(exportType) {

        this.TeacherDataService.getExport(exportType).then((result) => {
            let runId = this.ConfigService.getRunId();
            let exportFilename = "";

            let csvString = "";  // resulting csv string

            exportFilename = runId + "_notebook.csv";

            let COLUMN_INDEX_LOCAL_NOTEBOOK_ITEM_ID = 1;
            let COLUMN_INDEX_NODE_ID = 2;
            let COLUMN_INDEX_COMPONENT_ID = 3;
            let COLUMN_INDEX_STEP_NUMBER = 4;
            let COLUMN_INDEX_STEP_TITLE = 5;
            let COLUMN_INDEX_COMPONENT_PART_NUMBER = 6;
            let COLUMN_INDEX_TYPE = 9;
            let COLUMN_INDEX_STUDENT_DATA = 10;
            let COLUMN_INDEX_WORKGROUP_ID = 13;
            let COLUMN_INDEX_WISE_IDS = 17;
            let COLUMN_INDEX_WISE_ID_1 = 17;
            let COLUMN_INDEX_WISE_ID_2 = 18;
            let COLUMN_INDEX_WISE_ID_3 = 19;
            let COLUMN_INDEX_STUDENT_RESPONSE = 20;

            if (exportType === "latestNotebookItems") {
                let hash = {};  // store latestStudentWork. Assume that key = (localNotebookItemId)
                result = result.reverse().filter( (studentWorkRow) => {
                    let hashKey = studentWorkRow[COLUMN_INDEX_LOCAL_NOTEBOOK_ITEM_ID] + "_" + studentWorkRow[COLUMN_INDEX_WORKGROUP_ID];
                    if (!hash.hasOwnProperty(hashKey)) {
                        // remember in hash
                        hash[hashKey] = studentWorkRow;
                        return true;
                    } else {
                        // we already have the latest, so we can disregard this studentWorkRow.
                        return false;
                    }
                }).reverse();
                exportFilename = runId + "_latest_notebook_items.csv";
            } else if (exportType === "allNotebookItems") {
                exportFilename = runId + "_all_notebook_items.csv";
            }

            for (let rowIndex = 0; rowIndex < result.length; rowIndex++) {
                let row = result[rowIndex];

                if (rowIndex === 0) {
                    // append additional header columns
                    row[COLUMN_INDEX_WISE_ID_1] = "WISE ID 1";
                    row[COLUMN_INDEX_WISE_ID_2] = "WISE ID 2";
                    row[COLUMN_INDEX_WISE_ID_3] = "WISE ID 3";
                    row[COLUMN_INDEX_STUDENT_RESPONSE] = "response";
                } else {
                    // for all non-header rows, fill in step numbers, titles, and component part numbers.
                    let nodeId = row[COLUMN_INDEX_NODE_ID];
                    let componentId = row[COLUMN_INDEX_COMPONENT_ID];
                    row[COLUMN_INDEX_STEP_NUMBER] = this.ProjectService.getNodePositionById(nodeId);
                    row[COLUMN_INDEX_STEP_TITLE] = this.ProjectService.getNodeTitleByNodeId(nodeId);
                    row[COLUMN_INDEX_COMPONENT_PART_NUMBER] = this.ProjectService.getComponentPositionByNodeIdAndComponentId(nodeId, componentId) + 1; // make it 1-indexed for researchers
                    let wiseIDs = row[COLUMN_INDEX_WISE_IDS];
                    let wiseIDsArray = wiseIDs.split(",");
                    row[COLUMN_INDEX_WISE_ID_1] = wiseIDsArray[0];
                    row[COLUMN_INDEX_WISE_ID_2] = wiseIDsArray[1] || "";
                    row[COLUMN_INDEX_WISE_ID_3] = wiseIDsArray[2] || "";

                    // get the student data JSON and extract responses into its own column
                    let studentDataJSONCell = row[COLUMN_INDEX_STUDENT_DATA];
                    if (row[COLUMN_INDEX_TYPE] === "report") {
                        if (studentDataJSONCell.content != null) {
                            //row[COLUMN_INDEX_STUDENT_RESPONSE] = this.escapeContent(studentDataJSONCell.content);
                            row[COLUMN_INDEX_STUDENT_RESPONSE] = this.UtilService.removeHTMLTags(studentDataJSONCell.content);

                        } else {
                            row[COLUMN_INDEX_STUDENT_RESPONSE] = "";
                        }
                    } else if (row[COLUMN_INDEX_TYPE] === "note") {
                        if (studentDataJSONCell.text != null) {
                            //row[COLUMN_INDEX_STUDENT_RESPONSE] = this.escapeContent(studentDataJSONCell.text);
                            row[COLUMN_INDEX_STUDENT_RESPONSE] = this.UtilService.removeHTMLTags(studentDataJSONCell.text);
                        } else {
                            row[COLUMN_INDEX_STUDENT_RESPONSE] = "";
                        }
                    }
                }

                // append row to csvString
                for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
                    let cell = row[cellIndex];
                    if (typeof cell === "object") {
                        cell = "\"" + JSON.stringify(cell).replace(/"/g, '""') + "\"";
                    } else if (typeof cell === "string") {
                        cell = "\"" + cell + "\"";
                    }
                    csvString += cell + ",";
                }
                csvString += "\r\n";
            }

            let csvBlob = new Blob([csvString], {type: 'text/csv'});
            let csvUrl = URL.createObjectURL(csvBlob);
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.href = csvUrl;
            a.download = exportFilename;
            a.click();

            // timeout is required for FF.
            window.setTimeout(() => {
                URL.revokeObjectURL(csvUrl);  // tell browser to release URL reference
            }, 3000);
        });
    }

    exportNotifications() {

        this.TeacherDataService.getExport("notifications").then((result) => {
            let runId = this.ConfigService.getRunId();
            let exportFilename = "";

            let csvString = "";  // resulting csv string

            exportFilename = runId + "_notifications.csv";

            let COLUMN_INDEX_NODE_ID = 1;
            let COLUMN_INDEX_COMPONENT_ID = 2;
            let COLUMN_INDEX_STEP_NUMBER = 4;
            let COLUMN_INDEX_STEP_TITLE = 5;
            let COLUMN_INDEX_COMPONENT_PART_NUMBER = 6;
            let COLUMN_INDEX_TYPE = 10;
            let COLUMN_INDEX_WISE_IDS = 21;
            let COLUMN_INDEX_WISE_ID_1 = 21;
            let COLUMN_INDEX_WISE_ID_2 = 22;
            let COLUMN_INDEX_WISE_ID_3 = 23;

            for (let rowIndex = 0; rowIndex < result.length; rowIndex++) {
                let row = result[rowIndex];

                if (rowIndex === 0) {
                    // append additional header columns
                    row[COLUMN_INDEX_WISE_ID_1] = "WISE ID 1";
                    row[COLUMN_INDEX_WISE_ID_2] = "WISE ID 2";
                    row[COLUMN_INDEX_WISE_ID_3] = "WISE ID 3";
                } else {
                    // for all non-header rows, fill in step numbers, titles, and component part numbers.
                    let nodeId = row[COLUMN_INDEX_NODE_ID];
                    let componentId = row[COLUMN_INDEX_COMPONENT_ID];
                    row[COLUMN_INDEX_STEP_NUMBER] = this.ProjectService.getNodePositionById(nodeId);
                    row[COLUMN_INDEX_STEP_TITLE] = this.ProjectService.getNodeTitleByNodeId(nodeId);
                    row[COLUMN_INDEX_COMPONENT_PART_NUMBER] = this.ProjectService.getComponentPositionByNodeIdAndComponentId(nodeId, componentId) + 1; // make it 1-indexed for researchers
                    let wiseIDs = row[COLUMN_INDEX_WISE_IDS];
                    let wiseIDsArray = wiseIDs.split(",");
                    row[COLUMN_INDEX_WISE_ID_1] = wiseIDsArray[0];
                    row[COLUMN_INDEX_WISE_ID_2] = wiseIDsArray[1] || "";
                    row[COLUMN_INDEX_WISE_ID_3] = wiseIDsArray[2] || "";
                }

                // append row to csvString
                for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
                    let cell = row[cellIndex];
                    if (typeof cell === "object") {
                        cell = "\"" + JSON.stringify(cell).replace(/"/g, '""') + "\"";
                    } else if (typeof cell === "string") {
                        cell = "\"" + cell + "\"";
                    }
                    csvString += cell + ",";
                }
                csvString += "\r\n";
            }

            let csvBlob = new Blob([csvString], {type: 'text/csv'});
            let csvUrl = URL.createObjectURL(csvBlob);
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.href = csvUrl;
            a.download = exportFilename;
            a.click();

            // timeout is required for FF.
            window.setTimeout(() => {
                URL.revokeObjectURL(csvUrl);  // tell browser to release URL reference
            }, 3000);
        });
    }

    exportStudentAssets() {
        this.TeacherDataService.getExport("studentAssets");
    }

    /**
     * Get the selected nodes to export
     * @return an array of objects that contain a nodeId field and maybe also
     * a componentId field
     * example
     * [
     *     {
     *         nodeId: "node1",
     *         componentId: "343b8aesf7"
     *     },
     *     {
     *         nodeId: "node2",
     *         componentId: "b34gaf0ug2"
     *     },
     *     {
     *         nodeId: "node3"
     *     }
     * ]
     * Note: "node3" means just node3, not components in node2.
     */
    getSelectedNodesToExport() {
        let selectedNodes = [];

        // loop through all the import project items
        for (let n = 0; n < this.projectItems.length; n++) {
            let item = this.projectItems[n];
            if (item.node.type === "node") {
                let nodeId = item.node.id;
                if (item.checked) {
                    // this item is checked so we will add it to the array of nodes that we will export

                    // create the object that contains the nodeId
                    let selectedStep = {
                        nodeId: nodeId
                    };

                    selectedNodes.push(selectedStep);
                }
                // also check the components
                if (item.node.components != null && item.node.components.length > 0) {
                    item.node.components.map((component) => {
                        if (component.checked) {
                            // this item is checked so we will add it to the array of nodes that we will export

                            // create the object that contains the nodeId and componentId
                            let selectedComponent = {
                                nodeId: nodeId,
                                componentId: component.id
                            };

                            selectedNodes.push(selectedComponent);
                        }
                    });
                }
            }
        }

        return selectedNodes;
    }

    /**
     * Get a mapping of node/component id strings to true.
     * example if
     * selectedNodes = [
     *     {
     *         nodeId: "node1",
     *         componentId: "343b8aesf7"
     *     },
     *     {
     *         nodeId: "node2",
     *         componentId: "b34gaf0ug2"
     *     },
     *     {
     *         nodeId: "node3"
     *     }
     * ]
     *
     * this function will return
     * {
     *     "node1-343b8aesf7": true,
     *     "node2-b34gaf0ug2": true,
     *     "node3": true
     * }
     *
     * @param selectedNodes an array of objects that contain a nodeId field and maybe also
     * a componentId field
     * @return a mapping of node/component id strings to true
     */
    getSelectedNodesMap(selectedNodes) {

        var selectedNodesMap = {};

        if (selectedNodes != null) {

            // loop through all the selected nodes
            for (var sn = 0; sn < selectedNodes.length; sn++) {
                var selectedNode = selectedNodes[sn];

                if (selectedNode != null) {
                    var nodeId = selectedNode.nodeId;
                    var componentId = selectedNode.componentId;

                    var selectedNodeString = "";

                    if (nodeId != null && componentId != null) {
                        // create the string like "node1-343b8aesf7"
                        selectedNodeString = nodeId + "-" + componentId;
                    } else if (nodeId != null) {
                        // create the string like "node3"
                        selectedNodeString = nodeId;
                    }

                    if (selectedNodeString != null && selectedNodeString != "") {
                        // add the mapping
                        selectedNodesMap[selectedNodeString] = true;
                    }
                }
            }
        }

        return selectedNodesMap;
    }

    /**
     * Handle node item clicked
     * @param nodeItem the item object for a given activity or step
     */
    nodeItemClicked(nodeItem) {

        if (nodeItem != null) {

            if (nodeItem.node != null) {
                // the node item is a group or step

                // get the node
                var node = nodeItem.node;

                if (node.ids != null) {
                    // this is a group node

                    // loop through all the child node ids
                    for (var n = 0; n < node.ids.length; n++) {

                        // get a child step id
                        var nodeId = node.ids[n];

                        // get a child step item
                        var childNodeItem = this.projectIdToOrder[nodeId];

                        // set the checked value for the step item
                        childNodeItem.checked = nodeItem.checked;

                        // get all the components in the step
                        var components = childNodeItem.node.components;

                        if (components != null) {

                            // loop through all the components in the step
                            for (var c = 0; c < components.length; c++) {

                                // set the checked value for the component item
                                components[c].checked = nodeItem.checked;
                            }
                        }
                    }
                } else if (node.components != null) {
                    // this is a step node

                    if (nodeItem.checked) {
                        // if this node item is checked, make sure its components are also checked.
                        if (nodeItem.node != null && nodeItem.node.components != null && nodeItem.node.components.length > 0) {
                            nodeItem.node.components.map((componentItem) => { componentItem.checked = true; });
                        }
                    } else {
                        // if this node item is unchecked, make sure its components are also unchecked.
                        if (nodeItem.node != null && nodeItem.node.components != null && nodeItem.node.components.length > 0) {
                            nodeItem.node.components.map((componentItem) => { componentItem.checked = false; });
                        }
                    }
                }
            }
        }
    }

    /**
     * Handle select all items
     */
    selectAll(doSelect = true) {
        if (this.projectIdToOrder != null) {

            // loop through all the group nodes and step nodes
            for (let nodeId in this.projectIdToOrder) {
                let projectItem = this.projectIdToOrder[nodeId];
                if (projectItem.order != 0) {

                    projectItem.checked = doSelect;

                    if (projectItem.node.type != "group") {
                        // the project item is a step

                        // also check its components
                        if (projectItem.node != null && projectItem.node.components != null && projectItem.node.components.length > 0) {
                            projectItem.node.components.map((componentItem) => { componentItem.checked = doSelect; });
                        }
                    }
                }
            }
        }
    }

    /**
     * Handle deselect all items
     */
    deselectAll() {
        this.selectAll(false);
    }

    /**
     * Preview the project
     */
    previewProject() {
        let previewProjectURL = this.ConfigService.getConfigParam('previewProjectURL');
        // open the preview step in a new tab
        window.open(previewProjectURL);
    }

    /**
     * Preview the step
     * @param node
     */
    previewNode(node) {

        if (node != null) {

            // get the node id
            let nodeId = node.id;

            // get the preview project url
            let previewProjectURL = this.ConfigService.getConfigParam('previewProjectURL');

            // create the url to preview the step
            let previewStepURL  = previewProjectURL + "#/vle/" + nodeId;

            // open the preview step in a new tab
            window.open(previewStepURL);
        }
    }

    /**
     * Create a csv export file with one workgroup per row
     */
    exportOneWorkgroupPerRow() {

        // get the steps that were selected
        var selectedNodes = this.getSelectedNodesToExport();

        /*
         * holds the mappings from nodeid or nodeid-componentid to a boolean
         * value of whether the node was selected
         * example
         * selectedNodesMap["node3"] = true
         * selectedNodesMap["node4-wt38sdf1d3"] = true
         */
        var selectedNodesMap = null;

        if (this.exportStepSelectionType === "exportSelectSteps") {
            if (selectedNodes == null || selectedNodes.length == 0) {
                /*
                 * the user did not select any steps to export so we will not
                 * generate the export
                 */
                alert('Please select a step to export.');
                return;
            } else {
                /*
                 * the user has selected some steps/components so we will
                 * generate a selected nodes map
                 */
                selectedNodesMap = this.getSelectedNodesMap(selectedNodes);
            }
        }

        // request the student data from the server and then generate the export
        this.TeacherDataService.getExport("oneWorkgroupPerRow", selectedNodes).then((result) => {

            // the rows in the export
            var rows = [];

            // get the project id
            var projectId = this.ConfigService.getProjectId();

            // get the project title
            var projectTitle = this.ProjectService.getProjectTitle();

            // get the run id
            var runId = this.ConfigService.getRunId();

            var startDate = "";

            var endDate = "";

            // get the column ids that we will use for this export
            var columnIds = this.getColumnIdsForOneWorkgroupPerRow(selectedNodesMap);

            // get all the step node ids
            var nodeIds = this.ProjectService.getFlattenedProjectAsNodeIds();

            // the headers for the description row
            var descriptionRowHeaders = [
                "Workgroup ID",
                "WISE ID 1",
                "WISE ID 2",
                "WISE ID 3",
                "Class Period",
                "Project ID",
                "Project Name",
                "Run ID",
                "Start Date",
                "End Date"
            ];

            // generate the mapping from column id to column index
            var columnIdToColumnIndex = this.getColumnIdToColumnIndex(columnIds, descriptionRowHeaders);

            // generate the top rows that contain the header cells
            var topRows = this.getOneWorkgroupPerRowTopRows(columnIds, columnIdToColumnIndex, descriptionRowHeaders);

            // add the top rows
            rows = rows.concat(topRows);

            // get the workgroups in the class
            var workgroups = this.ConfigService.getClassmateUserInfosSortedByWorkgroupId();

            // loop through all the workgroups
            for (var w = 0; w < workgroups.length; w++) {

                // get a workgroup
                var workgroup = workgroups[w];

                if (workgroup != null) {

                    /*
                     * Create the row for the workgroup and fill each cell with
                     * a space " ".
                     * The array length will be equal to the number of
                     * description header columns plus a column for the vertical
                     * headers plus all the columns for the steps/components.
                     */
                    var workgroupRow = new Array(descriptionRowHeaders.length + 1 + columnIds.length);
                    workgroupRow.fill(" ");

                    // get the workgroup information
                    var workgroupId = workgroup.workgroupId;
                    var periodName = workgroup.periodName;
                    var userInfo = this.ConfigService.getUserInfoByWorkgroupId(workgroupId);

                    // get the WISE IDs
                    var wiseIds = this.ConfigService.getWISEIds(workgroupId);
                    var wiseId1 = wiseIds[0];
                    var wiseId2 = wiseIds[1];
                    var wiseId3 = wiseIds[2];

                    workgroupRow[columnIdToColumnIndex["Workgroup ID"]] = workgroupId;

                    if (wiseId1 != null) {
                        workgroupRow[columnIdToColumnIndex["WISE ID 1"]] = wiseId1;
                    }

                    if (wiseId2 != null) {
                        workgroupRow[columnIdToColumnIndex["WISE ID 2"]] = wiseId2;
                    }

                    if (wiseId3 != null) {
                        workgroupRow[columnIdToColumnIndex["WISE ID 3"]] = wiseId3;
                    }

                    workgroupRow[columnIdToColumnIndex["Class Period"]] = periodName;
                    workgroupRow[columnIdToColumnIndex["Project ID"]] = projectId;
                    workgroupRow[columnIdToColumnIndex["Project Name"]] = projectTitle;
                    workgroupRow[columnIdToColumnIndex["Run ID"]] = runId;
                    workgroupRow[columnIdToColumnIndex["Start Date"]] = startDate;
                    workgroupRow[columnIdToColumnIndex["End Date"]] = endDate;

                    // loop through all the steps
                    for (var n = 0; n < nodeIds.length; n++) {
                        var nodeId = nodeIds[n];

                        // get all the components in the step
                        var components = this.ProjectService.getComponentsByNodeId(nodeId);

                        if (components != null) {

                            // loop through all the components
                            for (var c = 0; c < components.length; c++) {
                                var component = components[c];

                                if (component != null) {
                                    var componentId = component.id;

                                    if (this.exportComponent(selectedNodesMap, nodeId, componentId)) {
                                        // the researcher wants to export this component

                                        // get the column prefix
                                        var columnIdPrefix = nodeId + "-" + componentId;

                                        // get the latest component state
                                        var componentState = this.TeacherDataService.getLatestComponentStateByWorkgroupIdNodeIdAndComponentId(workgroupId, nodeId, componentId);

                                        if (componentState != null) {

                                            // get the component service for the given component type
                                            var componentService = this.getComponentService(componentState.componentType);

                                            var studentDataString = " ";

                                            if (componentService != null &&
                                                componentService.getStudentDataString != null) {
                                                // there is a getStudentDataString function for this component type

                                                // get the student data string
                                                studentDataString = componentService.getStudentDataString(componentState);

                                                // get the student data string with the html tags removed
                                                studentDataString = this.UtilService.removeHTMLTags(studentDataString);

                                                // replace " with ""
                                                studentDataString = studentDataString.replace(/"/g, '""');
                                            } else {
                                                /*
                                                 * there is a getStudentDataString function for this component type
                                                 * so we will just show the JSON string
                                                 */
                                                studentDataString = componentState.studentData;
                                            }

                                            if (this.includeStudentWorkIds) {
                                                // we are exporting student work ids
                                                workgroupRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkId"]] = componentState.id;
                                            }

                                            if (this.includeStudentWorkTimestamps) {
                                                // we are exporting student work timestamps

                                                if (componentState.serverSaveTime != null) {
                                                    // get the time stamp as a pretty printed date time string
                                                    var formattedDateTime = this.UtilService.convertMillisecondsToFormattedDateTime(componentState.serverSaveTime);

                                                    // set the time stamp string e.g. Wed Apr 06 2016 9:05:38 AM
                                                    workgroupRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkTimestamp"]] = formattedDateTime;
                                                }
                                            }

                                            // set the student data string
                                            workgroupRow[columnIdToColumnIndex[columnIdPrefix + "-studentWork"]] = studentDataString;

                                            if (this.includeScores || this.includeComments) {
                                                // we are exporting scores or comments

                                                // get the latest score and comment annotation
                                                var latestComponentAnnotations = this.AnnotationService.getLatestComponentAnnotations(nodeId, componentId, workgroupId);

                                                if (latestComponentAnnotations != null) {
                                                    var scoreAnnotation = latestComponentAnnotations.score;
                                                    var commentAnnotation = latestComponentAnnotations.comment;

                                                    if (scoreAnnotation != null) {


                                                        if (this.includeScoreTimestamps) {
                                                            // we are exporting score timestamps

                                                            // get the score timestamp as a pretty printed date time
                                                            var scoreTimestamp = this.UtilService.convertMillisecondsToFormattedDateTime(scoreAnnotation.serverSaveTime);

                                                            // set the score timestamp
                                                            workgroupRow[columnIdToColumnIndex[columnIdPrefix + "-scoreTimestamp"]] = scoreTimestamp;
                                                        }

                                                        if (this.includeScores) {
                                                            // we are exporting scores

                                                            if (scoreAnnotation.data != null && scoreAnnotation.data.value != null) {

                                                                var scoreValue = scoreAnnotation.data.value;

                                                                // set the score
                                                                workgroupRow[columnIdToColumnIndex[columnIdPrefix + "-score"]] = scoreValue;
                                                            }
                                                        }
                                                    }

                                                    if (commentAnnotation != null) {

                                                        if (this.includeCommentTimestamps) {
                                                            // we are exporting comment timestamps

                                                            // get the comment timestamp as a pretty printed date time
                                                            var commentTimestamp = this.UtilService.convertMillisecondsToFormattedDateTime(commentAnnotation.serverSaveTime);

                                                            // set the comment timestamp
                                                            workgroupRow[columnIdToColumnIndex[columnIdPrefix + "-commentTimestamp"]] = commentTimestamp;
                                                        }

                                                        if (this.includeComments) {
                                                            // we are exporting comments

                                                            if (commentAnnotation.data != null && commentAnnotation.data.value != null) {
                                                                var commentValue = commentAnnotation.data.value;

                                                                // set the comment
                                                                workgroupRow[columnIdToColumnIndex[columnIdPrefix + "-comment"]] = commentValue;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (this.exportNode(selectedNodesMap, nodeId)) {
                            // the researcher wants to export this step

                            if (this.ProjectService.isBranchPoint(nodeId)) {
                                // this step is a branch point

                                var toNodeId = null;
                                var stepTitle = null;

                                var eventType = 'branchPathTaken';

                                /*
                                 * get the latest branchPathTaken event for this
                                 * step
                                 */
                                var latestBranchPathTakenEvent = this.TeacherDataService.getLatestEventByWorkgroupIdAndNodeIdAndType(workgroupId, nodeId, eventType);

                                if (latestBranchPathTakenEvent != null &&
                                    latestBranchPathTakenEvent.data != null &&
                                    latestBranchPathTakenEvent.data.toNodeId != null) {

                                    // get the step that the student branched to
                                    toNodeId = latestBranchPathTakenEvent.data.toNodeId;

                                    // get the title of the step
                                    stepTitle = this.ProjectService.getNodePositionAndTitleByNodeId(toNodeId);
                                }

                                if (this.includeBranchPathTakenNodeId) {
                                    // we are exporting the branch path taken node ids

                                    if (toNodeId != null) {
                                        workgroupRow[columnIdToColumnIndex[nodeId + "-branchPathTakenNodeId"]] = toNodeId;
                                    } else {
                                        workgroupRow[columnIdToColumnIndex[nodeId + "-branchPathTakenNodeId"]] = " ";
                                    }
                                }

                                if (this.includeBranchPathTaken) {
                                    // we are exporting branch path taken

                                    var branchLetter = this.ProjectService.getBranchLetter(toNodeId);

                                    if (stepTitle != null) {
                                        workgroupRow[columnIdToColumnIndex[nodeId + "-branchPathTaken"]] = branchLetter;
                                    } else {
                                        workgroupRow[columnIdToColumnIndex[nodeId + "-branchPathTaken"]] = " ";
                                    }
                                }

                                if (this.includeBranchPathTakenStepTitle) {
                                    // we are exporting branch path taken step titles

                                    if (stepTitle != null) {
                                        workgroupRow[columnIdToColumnIndex[nodeId + "-branchPathTakenStepTitle"]] = stepTitle;
                                    } else {
                                        workgroupRow[columnIdToColumnIndex[nodeId + "-branchPathTakenStepTitle"]] = " ";
                                    }
                                }
                            }
                        }
                    }

                    // add this workgroup's row to the array of all rows
                    rows.push(workgroupRow);
                }
            }

            // create the file name
            var fileName = runId + "_one_workgroup_per_row.csv";

            // generate the csv file and have the client download it
            this.generateCSVFile(rows, fileName);
        });
    }

    /**
     * Get the column ids for the One Workgroup Per Row export
     * @param selectedNodesMap the nodes that were selected
     * @return an array of column ids. the column ids will be in the format
     * nodeId-componentId-studentWork
     * nodeId-componentId-score
     * nodeId-componentId-comment
     */
    getColumnIdsForOneWorkgroupPerRow(selectedNodesMap) {
        var columnIds = [];

        // get all the step node ids in order
        var nodeIds = this.ProjectService.getFlattenedProjectAsNodeIds();

        if (nodeIds != null) {

            // loop through all the step node ids
            for (var n = 0; n < nodeIds.length; n++) {
                var nodeId = nodeIds[n];

                // get the components in the step
                var components = this.ProjectService.getComponentsByNodeId(nodeId);

                if (components != null) {

                    // loop through all the components in the step
                    for (var c = 0; c < components.length; c++) {
                        var component = components[c];

                        if (component != null) {
                            var componentId = component.id;

                            if (this.exportComponent(selectedNodesMap, nodeId, componentId)) {
                                /*
                                 * the component was selected so we will create column
                                 * ids for it
                                 */

                                var columnIdPrefix = nodeId + "-" + componentId;

                                if (this.includeStudentWorkIds) {
                                    /*
                                     * we are exporting student work ids so we
                                     * will create the column id for the student
                                     * work id
                                     */
                                    columnIds.push(columnIdPrefix + "-studentWorkId");
                                }

                                if (this.includeStudentWorkTimestamps) {
                                    /*
                                     * we are exporting timestamps so we will
                                     * create the column id for the timestamp
                                     */
                                    columnIds.push(columnIdPrefix + "-studentWorkTimestamp");
                                }

                                if (this.includeStudentWork) {
                                    // create the column id for the studentWork
                                    columnIds.push(columnIdPrefix + "-studentWork");
                                }

                                if (this.includeScoreTimestamps) {
                                    /*
                                     * we are exporting score timestamps so we
                                     * will create the column id for the score
                                     * timestamp
                                     */
                                    columnIds.push(columnIdPrefix + "-scoreTimestamp");
                                }

                                if (this.includeScores) {
                                    // we are exporting scores so we will create the column id for the score
                                    columnIds.push(columnIdPrefix + "-score");
                                }

                                if (this.includeCommentTimestamps) {
                                    /*
                                     * we are exporting comment timestamps so we
                                     * will create the column id for the comment
                                     * timestamp
                                     */
                                    columnIds.push(columnIdPrefix + "-commentTimestamp");
                                }

                                if (this.includeComments) {
                                    // we are exporting comments so we will create the column id for the comment
                                    columnIds.push(columnIdPrefix + "-comment");
                                }
                            }
                        }
                    }
                }

                if (this.exportNode(selectedNodesMap, nodeId)) {
                    // the step was selected

                    if (this.ProjectService.isBranchPoint(nodeId)) {
                        // the step is a branch point

                        if (this.includeBranchPathTakenNodeId) {
                            // we are exporting branch path taken node ids
                            columnIds.push(nodeId + "-branchPathTakenNodeId");
                        }

                        if (this.includeBranchPathTaken) {
                            // we are exporting branch path taken
                            columnIds.push(nodeId + "-branchPathTaken");
                        }

                        if (this.includeBranchPathTakenStepTitle) {
                            // we are exporting branch path taken step titles
                            columnIds.push(nodeId + "-branchPathTakenStepTitle");
                        }
                    }
                }
            }
        }

        return columnIds;
    }

    /**
     * Create mappings from column id to column index so that we can easily
     * insert cell values into the correct column when we fill in the row
     * for a workgroup
     * @param columnIds an array of column ids in the order that the
     * associated columns will appear in the export
     * @param descriptionRowHeaders an array of headers in the description row
     * @return an object that contains mappings from column id to column index
     */
    getColumnIdToColumnIndex(columnIds, descriptionRowHeaders) {

        /*
         * the student work columns will start after the description header
         * columns and vertical headers column
         */
        var numberOfColumnsToShift = descriptionRowHeaders.length + 1;

        var columnIdToColumnIndex = {};

        /*
         * loop through all the description columns
         * Workgroup ID
         * WISE ID 1
         * WISE ID 2
         * WISE ID 3
         * Class Period
         * Project ID
         * Project Name
         * Run ID
         * Start Date
         * End Date
         */
        for (var d = 0; d < descriptionRowHeaders.length; d++) {
            // get the description column
            var descriptionRowHeader = descriptionRowHeaders[d];

            // set the column index for the description column
            columnIdToColumnIndex[descriptionRowHeader] = d;
        }

        // generate the header row by looping through all the column names
        for (var c = 0; c < columnIds.length; c++) {

            // get a column name
            var columnId = columnIds[c];

            if (columnId != null) {
                /*
                 * Add a mapping from column name to column index. The columns
                 * for the components will start after the blank columns and
                 * after the column that contains the vertical headers for the
                 * top rows. We need to add +1 for the vertical headers column
                 * which contains the values Step Title, Component Part Number,
                 * Component Type, Prompt, Node ID, Component ID, Description.
                 */
                columnIdToColumnIndex[columnId] = numberOfColumnsToShift + c;
            }
        }

        return columnIdToColumnIndex;
    }

    /**
     * Get the top rows in the One Workgroup Per Row export
     * @param columnIds an array of column ids
     * @param columnIdToColumnIndex an object containing mappings from column id
     * to column index
     * @param descriptionRowHeaders an array containing the description row
     * headers
     * @return an array of of the top rows. each top row is also an array
     */
    getOneWorkgroupPerRowTopRows(columnIds, columnIdToColumnIndex, descriptionRowHeaders) {

        // get the total number of columns in a row
        var numColumns = descriptionRowHeaders.length + 1 + columnIds.length;

        // create the top rows
        var stepTitleRow = new Array(numColumns);
        var componentPartNumberRow = new Array(numColumns);
        var componentTypeRow = new Array(numColumns);
        var componentPromptRow = new Array(numColumns);
        var nodeIdRow = new Array(numColumns);
        var componentIdRow = new Array(numColumns);
        var columnIdRow = new Array(numColumns);
        var descriptionRow = new Array(numColumns);

        /*
         * populate the top rows with a space. we do this so that it makes it
         * easier to view in the export. for example if there is a cell with
         * text in it and a blank cell to the right of it, excel will display
         * the text overflow into the blank cell. if we have cells with " "
         * instead of "", this overflow will not occur.
         */
        stepTitleRow.fill(" ");
        componentPartNumberRow.fill(" ");
        componentTypeRow.fill(" ");
        componentPromptRow.fill(" ");
        nodeIdRow.fill(" ");
        componentIdRow.fill(" ");
        columnIdRow.fill(" ");
        descriptionRow.fill(" ");

        //  set the cell values for the vertical header column
        stepTitleRow[descriptionRowHeaders.length] = "Step Title";
        componentPartNumberRow[descriptionRowHeaders.length] = "Component Part Number";
        componentTypeRow[descriptionRowHeaders.length] = "Component Type";
        componentPromptRow[descriptionRowHeaders.length] = "Prompt";
        nodeIdRow[descriptionRowHeaders.length] = "Node ID";
        componentIdRow[descriptionRowHeaders.length] = "Component ID";
        columnIdRow[descriptionRowHeaders.length] = "Column ID";
        descriptionRow[descriptionRowHeaders.length] = "Description";

        // fill in the headers in the description row
        for (var d = 0; d < descriptionRowHeaders.length; d++) {
            descriptionRow[d] = descriptionRowHeaders[d];
        }

        // get all the step node ids in the order that they appear in the project
        var nodeIds = this.ProjectService.getFlattenedProjectAsNodeIds();

        if (nodeIds != null) {

            // loop through all the step node ids
            for (var n = 0; n < nodeIds.length; n++) {
                var nodeId = nodeIds[n];

                // get a step title
                var stepTitle = this.ProjectService.getNodePositionAndTitleByNodeId(nodeId);

                // get the components in the step
                var components = this.ProjectService.getComponentsByNodeId(nodeId);

                if (components != null) {

                    // loop through all the components in the step
                    for (var c = 0; c < components.length; c++) {
                        var component = components[c];

                        if (component != null) {
                            var componentId = component.id;

                            // get the column prefix
                            var columnIdPrefix = nodeId + "-" + componentId;

                            // get the prompt with the html tags removed
                            var prompt = this.UtilService.removeHTMLTags(component.prompt);

                            // replace " with ""
                            prompt = prompt.replace(/"/g, '""');

                            if (prompt == "") {
                                prompt = " ";
                            }

                            if (this.includeStudentWorkIds) {
                                // we are exporting student work ids

                                // fill in the top 7 cells in the column for this component score
                                stepTitleRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkId"]] = stepTitle;
                                componentPartNumberRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkId"]] = (c + 1);
                                componentTypeRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkId"]] = component.type;
                                componentPromptRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkId"]] = prompt;
                                nodeIdRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkId"]] = nodeId;
                                componentIdRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkId"]] = componentId;
                                columnIdRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkId"]] = columnIdPrefix + "-studentWorkId";
                                descriptionRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkId"]] = "Student Work ID";
                            }

                            if (this.includeStudentWorkTimestamps) {
                                // we are exporting timestamps

                                // fill in the top 7 cells in the column for this component score
                                stepTitleRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkTimestamp"]] = stepTitle;
                                componentPartNumberRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkTimestamp"]] = (c + 1);
                                componentTypeRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkTimestamp"]] = component.type;
                                componentPromptRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkTimestamp"]] = prompt;
                                nodeIdRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkTimestamp"]] = nodeId;
                                componentIdRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkTimestamp"]] = componentId;
                                columnIdRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkTimestamp"]] = columnIdPrefix + "-studentWorkTimestamp";
                                descriptionRow[columnIdToColumnIndex[columnIdPrefix + "-studentWorkTimestamp"]] = "Student Work Timestamp";
                            }

                            if (this.includeStudentWork) {
                                // we are exporting student work

                                // fill in the top 7 cells in the column for this component student work
                                stepTitleRow[columnIdToColumnIndex[columnIdPrefix + "-studentWork"]] = stepTitle;
                                componentPartNumberRow[columnIdToColumnIndex[columnIdPrefix + "-studentWork"]] = (c + 1);
                                componentTypeRow[columnIdToColumnIndex[columnIdPrefix + "-studentWork"]] = component.type;
                                componentPromptRow[columnIdToColumnIndex[columnIdPrefix + "-studentWork"]] = prompt;
                                nodeIdRow[columnIdToColumnIndex[columnIdPrefix + "-studentWork"]] = nodeId;
                                componentIdRow[columnIdToColumnIndex[columnIdPrefix + "-studentWork"]] = componentId;
                                columnIdRow[columnIdToColumnIndex[columnIdPrefix + "-studentWork"]] = columnIdPrefix + "-studentWork";
                                descriptionRow[columnIdToColumnIndex[columnIdPrefix + "-studentWork"]] = "Student Work";
                            }

                            if (this.includeScoreTimestamps) {
                                // we are exporting score timestamps

                                // fill in the top 7 cells in the column for this component score timestamp
                                stepTitleRow[columnIdToColumnIndex[columnIdPrefix + "-scoreTimestamp"]] = stepTitle;
                                componentPartNumberRow[columnIdToColumnIndex[columnIdPrefix + "-scoreTimestamp"]] = (c + 1);
                                componentTypeRow[columnIdToColumnIndex[columnIdPrefix + "-scoreTimestamp"]] = component.type;
                                componentPromptRow[columnIdToColumnIndex[columnIdPrefix + "-scoreTimestamp"]] = prompt;
                                nodeIdRow[columnIdToColumnIndex[columnIdPrefix + "-scoreTimestamp"]] = nodeId;
                                componentIdRow[columnIdToColumnIndex[columnIdPrefix + "-scoreTimestamp"]] = componentId;
                                columnIdRow[columnIdToColumnIndex[columnIdPrefix + "-scoreTimestamp"]] = columnIdPrefix + "-scoreTimestamp";
                                descriptionRow[columnIdToColumnIndex[columnIdPrefix + "-scoreTimestamp"]] = "Score Timestamp";
                            }

                            if (this.includeScores) {
                                // we are exporting scores

                                // fill in the top 7 cells in the column for this component score
                                stepTitleRow[columnIdToColumnIndex[columnIdPrefix + "-score"]] = stepTitle;
                                componentPartNumberRow[columnIdToColumnIndex[columnIdPrefix + "-score"]] = (c + 1);
                                componentTypeRow[columnIdToColumnIndex[columnIdPrefix + "-score"]] = component.type;
                                componentPromptRow[columnIdToColumnIndex[columnIdPrefix + "-score"]] = prompt;
                                nodeIdRow[columnIdToColumnIndex[columnIdPrefix + "-score"]] = nodeId;
                                componentIdRow[columnIdToColumnIndex[columnIdPrefix + "-score"]] = componentId;
                                columnIdRow[columnIdToColumnIndex[columnIdPrefix + "-score"]] = columnIdPrefix + "-score";
                                descriptionRow[columnIdToColumnIndex[columnIdPrefix + "-score"]] = "Score";
                            }

                            if (this.includeCommentTimestamps) {
                                // we are exporting comment timestamps

                                // fill in the top 7 cells in the column for this component comment timestamp
                                stepTitleRow[columnIdToColumnIndex[columnIdPrefix + "-commentTimestamp"]] = stepTitle;
                                componentPartNumberRow[columnIdToColumnIndex[columnIdPrefix + "-commentTimestamp"]] = (c + 1);
                                componentTypeRow[columnIdToColumnIndex[columnIdPrefix + "-commentTimestamp"]] = component.type;
                                componentPromptRow[columnIdToColumnIndex[columnIdPrefix + "-commentTimestamp"]] = prompt;
                                nodeIdRow[columnIdToColumnIndex[columnIdPrefix + "-commentTimestamp"]] = nodeId;
                                componentIdRow[columnIdToColumnIndex[columnIdPrefix + "-commentTimestamp"]] = componentId;
                                columnIdRow[columnIdToColumnIndex[columnIdPrefix + "-commentTimestamp"]] = columnIdPrefix + "-commentTimestamp";
                                descriptionRow[columnIdToColumnIndex[columnIdPrefix + "-commentTimestamp"]] = "Comment Timestamp";
                            }

                            if (this.includeComments) {
                                // we are exporting comments

                                // fill in the top 7 cells in the column for this component comment
                                stepTitleRow[columnIdToColumnIndex[columnIdPrefix + "-comment"]] = stepTitle;
                                componentPartNumberRow[columnIdToColumnIndex[columnIdPrefix + "-comment"]] = (c + 1);
                                componentTypeRow[columnIdToColumnIndex[columnIdPrefix + "-comment"]] = component.type;
                                componentPromptRow[columnIdToColumnIndex[columnIdPrefix + "-comment"]] = prompt;
                                nodeIdRow[columnIdToColumnIndex[columnIdPrefix + "-comment"]] = nodeId;
                                componentIdRow[columnIdToColumnIndex[columnIdPrefix + "-comment"]] = componentId;
                                columnIdRow[columnIdToColumnIndex[columnIdPrefix + "-comment"]] = columnIdPrefix + "-comment";
                                descriptionRow[columnIdToColumnIndex[columnIdPrefix + "-comment"]] = "Comment";
                            }
                        }
                    }
                }

                if (this.includeBranchPathTakenNodeId) {
                    // we are exporting branch path taken node ids

                    if (this.ProjectService.isBranchPoint(nodeId)) {
                        // this step is a branch point

                        // fill in the top 7 cells in the column for this step branch path taken node id
                        stepTitleRow[columnIdToColumnIndex[nodeId + "-branchPathTakenNodeId"]] = stepTitle;
                        componentPartNumberRow[columnIdToColumnIndex[nodeId + "-branchPathTakenNodeId"]] = " ";
                        componentTypeRow[columnIdToColumnIndex[nodeId + "-branchPathTakenNodeId"]] = " ";
                        componentPromptRow[columnIdToColumnIndex[nodeId + "-branchPathTakenNodeId"]] = " ";
                        nodeIdRow[columnIdToColumnIndex[nodeId + "-branchPathTakenNodeId"]] = nodeId;
                        componentIdRow[columnIdToColumnIndex[nodeId + "-branchPathTakenNodeId"]] = " ";
                        columnIdRow[columnIdToColumnIndex[nodeId + "-branchPathTakenNodeId"]] = nodeId + "-branchPathTakenNodeId";
                        descriptionRow[columnIdToColumnIndex[nodeId + "-branchPathTakenNodeId"]] = "Branch Path Taken Node ID";
                    }
                }

                if (this.includeBranchPathTaken) {
                    // we are exporting the branch path taken

                    if (this.ProjectService.isBranchPoint(nodeId)) {
                        // this step is a branch point

                        // fill in the top 7 cells in the column for this step branch path taken
                        stepTitleRow[columnIdToColumnIndex[nodeId + "-branchPathTaken"]] = stepTitle;
                        componentPartNumberRow[columnIdToColumnIndex[nodeId + "-branchPathTaken"]] = " ";
                        componentTypeRow[columnIdToColumnIndex[nodeId + "-branchPathTaken"]] = " ";
                        componentPromptRow[columnIdToColumnIndex[nodeId + "-branchPathTaken"]] = " ";
                        nodeIdRow[columnIdToColumnIndex[nodeId + "-branchPathTaken"]] = nodeId;
                        componentIdRow[columnIdToColumnIndex[nodeId + "-branchPathTaken"]] = " ";
                        columnIdRow[columnIdToColumnIndex[nodeId + "-branchPathTaken"]] = nodeId + "-branchPathTaken";
                        descriptionRow[columnIdToColumnIndex[nodeId + "-branchPathTaken"]] = "Branch Path Taken";
                    }
                }

                if (this.includeBranchPathTakenStepTitle) {
                    // we are exporting branch path taken step titles

                    if (this.ProjectService.isBranchPoint(nodeId)) {
                        // this step is a branch point

                        // fill in the top 7 cells in the column for this step branch path taken step title
                        stepTitleRow[columnIdToColumnIndex[nodeId + "-branchPathTakenStepTitle"]] = stepTitle;
                        componentPartNumberRow[columnIdToColumnIndex[nodeId + "-branchPathTakenStepTitle"]] = " ";
                        componentTypeRow[columnIdToColumnIndex[nodeId + "-branchPathTakenStepTitle"]] = " ";
                        componentPromptRow[columnIdToColumnIndex[nodeId + "-branchPathTakenStepTitle"]] = " ";
                        nodeIdRow[columnIdToColumnIndex[nodeId + "-branchPathTakenStepTitle"]] = nodeId;
                        componentIdRow[columnIdToColumnIndex[nodeId + "-branchPathTakenStepTitle"]] = " ";
                        columnIdRow[columnIdToColumnIndex[nodeId + "-branchPathTakenStepTitle"]] = nodeId + "-branchPathTakenStepTitle";
                        descriptionRow[columnIdToColumnIndex[nodeId + "-branchPathTakenStepTitle"]] = "Branch Path Taken Step Title";
                    }
                }
            }
        }

        var topRows = [];

        // add all the top rows
        topRows.push(stepTitleRow);
        topRows.push(componentPartNumberRow);
        topRows.push(componentTypeRow);
        topRows.push(componentPromptRow);
        topRows.push(nodeIdRow);
        topRows.push(componentIdRow);
        topRows.push(columnIdRow);
        topRows.push(descriptionRow);

        return topRows;
    }

    /**
     * Get the component service for a component type
     * @param componentType the component type
     * @return the component service or null if it doesn't exist
     */
    getComponentService(componentType) {

        var componentService = null;

        if (componentType != null) {

            /*
             * check our mapping of component type to component service to see
             * if we have already retrieved the component service before
             */
            componentService = this.componentTypeToComponentService[componentType];

            if (componentService == null) {
                /*
                 * we have not retrieved this component service before so we
                 * will get it
                 */
                var componentService = this.$injector.get(componentType + 'Service');

                /*
                 * save the component service to our mapping for easy retrieval
                 * in the future
                 */
                this.componentTypeToComponentService[componentType] = componentService;
            }
        }

        return componentService;
    }

    /**
     * Check if we want to export this node
     * @param selectedNodesMap a mapping of node id to boolean value of whether
     * the researcher has checked the node
     * @param nodeId the node id
     * @return whether the node was checked
     */
    exportNode(selectedNodesMap, nodeId) {
        if (selectedNodesMap == null || this.isNodeSelected(selectedNodesMap, nodeId)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Check if we want to export this component
     * @param selectedNodesMap a mapping of node id to boolean value of whether
     * the researcher has checked the node
     * @param nodeId the node id
     * @param componentId the component id
     * @return whether the component was checked
     */
    exportComponent(selectedNodesMap, nodeId, componentId) {
        if (selectedNodesMap == null || this.isComponentSelected(selectedNodesMap, nodeId, componentId)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * The "One Workgroup Per Row" button was clicked so we will display the
     * view for it
     */
    oneWorkgroupPerRowClicked() {

        // set the export type
        this.exportType = 'oneWorkgroupPerRow';
    }

    /**
     * Get the node position
     * @param nodeId the node id
     * @returns the node position
     */
    getNodePositionById(nodeId) {
        return this.ProjectService.getNodePositionById(nodeId);
    };

    /**
     * Get the node title for a node
     * @param nodeId the node id
     * @returns the node title
     */
    getNodeTitleByNodeId(nodeId) {
        return this.ProjectService.getNodeTitleByNodeId(nodeId);
    };

    /**
     * Check if a node id is for a group
     * @param nodeId
     * @returns whether the node is a group node
     */
    isGroupNode(nodeId) {
        return this.ProjectService.isGroupNode(nodeId);
    };

    /**
     * Check if the node is in any branch path
     * @param nodeId the node id of the node
     * @return whether the node is in any branch path
     */
    isNodeInAnyBranchPath(nodeId) {
        return this.ProjectService.isNodeInAnyBranchPath(nodeId);
    }

    /**
     * The default button was clicked
     */
    defaultClicked() {
        // set the default export settings
        this.setDefaultExportSettings();
    }

    /**
     * The everything button was clicked
     */
    everythingClicked() {
        // enable all the settings

        // settings for one workgroup per row export
        this.includeStudentWork = true;
        this.includeStudentWorkIds = true;
        this.includeStudentWorkTimestamps = true;
        this.includeBranchPathTaken = true;
        this.includeBranchPathTakenStepTitle = true;
        this.includeBranchPathTakenNodeId = true;
        this.includeScores = true;
        this.includeScoreTimestamps = true;
        this.includeComments = true;
        this.includeCommentTimestamps = true;
        this.exportStepSelectionType = 'exportAllSteps';

        // settings for raw data export
        this.includeAnnotations = true;
        this.includeEvents = true;
    }

    /**
     * Set the default export settings
     */
    setDefaultExportSettings() {
        // enable the default settings

        // settings for one workgroup per row export
        this.includeStudentWork = true;
        this.includeStudentWorkIds = false;
        this.includeStudentWorkTimestamps = false;
        this.includeBranchPathTaken = true;
        this.includeBranchPathTakenStepTitle = false;
        this.includeBranchPathTakenNodeId = false;
        this.includeScores = false;
        this.includeScoreTimestamps = false;
        this.includeComments = false;
        this.includeCommentTimestamps = false;
        this.exportStepSelectionType = 'exportAllSteps';

        // settings for raw data export
        this.includeAnnotations = false;
        this.includeEvents = false;
    }

    /**
     * The "Export Raw Data" button was clicked
     */
    rawDataExportClicked() {
        // set the export type
        this.exportType = 'rawData';
    }

    /**
     * Export the raw data
     */
    exportRawData() {

        // get the steps that were selected
        var selectedNodes = this.getSelectedNodesToExport();

        /*
         * holds the mappings from nodeid or nodeid-componentid to a boolean
         * value of whether the node was selected
         * example
         * selectedNodesMap["node3"] = true
         * selectedNodesMap["node4-wt38sdf1d3"] = true
         */
        var selectedNodesMap = null;

        if (this.exportStepSelectionType === "exportSelectSteps") {
            if (selectedNodes == null || selectedNodes.length == 0) {
                /*
                 * the user did not select any steps to export so we will not
                 * generate the export
                 */
                alert('Please select a step to export.');
                return;
            } else {
                /*
                 * the user has selected some steps/components so we will
                 * generate a selected nodes map
                 */
                selectedNodesMap = this.getSelectedNodesMap(selectedNodes);
            }
        }

        // request the student data from the server and then generate the export
        this.TeacherDataService.getExport("rawData", selectedNodes).then((result) => {

            // get the run id
            var runId = this.ConfigService.getRunId();

            var data = {};

            // get the workgroups in the class
            var workgroups = this.ConfigService.getClassmateUserInfosSortedByWorkgroupId();

            // make a copy of the workgroups array to prevent referencing issues
            workgroups = this.UtilService.makeCopyOfJSONObject(workgroups);

            // loop through all the workgroups
            for (var w = 0; w < workgroups.length; w++) {
                var workgroup = workgroups[w];

                if (workgroup != null) {

                    // remove the user name and display name fields
                    delete workgroup.userName;
                    delete workgroup.displayNames;

                    // get the workgroup id
                    var workgroupId = workgroup.workgroupId;

                    if (this.includeStudentWork) {
                        // the user wants to export the student work
                        workgroup.studentWork = [];

                        // get all the component states for the workgroup
                        var componentStates = this.TeacherDataService.getComponentStatesByWorkgroupId(workgroupId);

                        if (componentStates != null) {

                            // loop through all the component states
                            for (var c = 0; c < componentStates.length; c++) {
                                var componentState = componentStates[c];

                                if (componentState != null) {

                                    // get the composite id. example 'node2-b34gaf0ug2'
                                    var compositeId = this.getCompositeId(componentState);

                                    if (selectedNodesMap == null || (compositeId != null && selectedNodesMap[compositeId] == true)) {
                                        /*
                                         * we are exporting all steps or the step was selected
                                         * so we will add the component state
                                         */
                                        workgroup.studentWork.push(componentState);
                                    }
                                }
                            }
                        }
                    }

                    if (this.includeAnnotations) {
                        // the user wants to export the annotations
                        workgroup.annotations = [];

                        // get all the annotations for the workgroup
                        var annotations = this.TeacherDataService.getAnnotationsToWorkgroupId(workgroupId);

                        if (annotations != null) {

                            // loop through all the annotations for the workgroup
                            for (var a = 0; a < annotations.length; a++) {
                                var annotation = annotations[a];

                                if (annotation != null) {

                                    // get the composite id. example 'node2-b34gaf0ug2'
                                    var compositeId = this.getCompositeId(annotation);

                                    if (selectedNodesMap == null || (compositeId != null && selectedNodesMap[compositeId] == true)) {
                                        /*
                                         * we are exporting all steps or the step was selected
                                         * so we will add the annotation
                                         */
                                        workgroup.annotations.push(annotation);
                                    }
                                }
                            }
                        }
                    }

                    if (this.includeEvents) {
                        // the user wants to export the events
                        workgroup.events = [];

                        var events = [];

                        // get all the events for the workgroup
                        var events = this.TeacherDataService.getEventsByWorkgroupId(workgroupId);

                        if (events != null) {

                            // loop through all the events for the workgroup
                            for (var e = 0; e < events.length; e++) {
                                var event = events[e];

                                if (event != null) {

                                    // get the composite id. example 'node2-b34gaf0ug2'
                                    var compositeId = this.getCompositeId(event);

                                    if (selectedNodesMap == null || (compositeId != null && selectedNodesMap[compositeId] == true)) {
                                        /*
                                         * we are exporting all steps or the step was selected
                                         * so we will add the event
                                         */
                                        workgroup.events.push(event);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // add the workgroups to the data
            data.workgroups = workgroups;

            // get the data as a JSON string
            var dataJSONString = angular.toJson(data, 4);

            // get the data JSON string as a blob
            var blob = new Blob([dataJSONString]);

            // generate a file and download it to the user's computer
            this.FileSaver.saveAs(blob, runId + "_raw_data.json");
        });
    }

    /**
     * Get the composite id for a given object
     * @param object a component state, annotation, or event
     * @return the composite id for the object
     * example
     * 'node3'
     * 'node4-wt38sdf1d3'
     */
    getCompositeId(object) {
        var compositeId = null;

        if (object.nodeId != null) {
            // the object has a node id
            compositeId = object.nodeId;
        }

        if (object.componentId != null) {
            // the object has a component id
            compositeId += '-' + object.componentId;
        }

        return compositeId;
    }
}

DataExportController.$inject = [
    '$injector',
    '$rootScope',
    '$scope',
    '$state',
    'AnnotationService',
    'ConfigService',
    'ProjectService',
    'StudentStatusService',
    'TeacherDataService',
    'TeacherWebSocketService',
    'UtilService'
];

export default DataExportController;
