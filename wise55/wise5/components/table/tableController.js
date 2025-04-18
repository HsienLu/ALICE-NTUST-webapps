'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _html2canvas = require('html2canvas');

var _html2canvas2 = _interopRequireDefault(_html2canvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TableController = function () {
    function TableController($anchorScroll, $filter, $injector, $location, $mdDialog, $q, $rootScope, $scope, AnnotationService, ConfigService, NodeService, NotebookService, ProjectService, StudentDataService, TableService, UtilService) {
        var _this = this;

        _classCallCheck(this, TableController);

        this.$anchorScroll = $anchorScroll;
        this.$filter = $filter;
        this.$injector = $injector;
        this.$location = $location;
        this.$mdDialog = $mdDialog;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.AnnotationService = AnnotationService;
        this.ConfigService = ConfigService;
        this.NodeService = NodeService;
        this.NotebookService = NotebookService;
        this.ProjectService = ProjectService;
        this.StudentDataService = StudentDataService;
        this.TableService = TableService;
        this.UtilService = UtilService;
        this.idToOrder = this.ProjectService.idToOrder;

        this.$translate = this.$filter('translate');

        // the node id of the current node
        this.nodeId = null;

        // the component id
        this.componentId = null;

        // field that will hold the component content
        this.componentContent = null;

        // field that will hold the authoring component content
        this.authoringComponentContent = null;

        // whether the step should be disabled
        this.isDisabled = false;

        // whether the student work is dirty and needs saving
        this.isDirty = false;

        // whether the student work has changed since last submit
        this.isSubmitDirty = false;

        // message to show next to save/submit buttons
        this.saveMessage = {
            text: '',
            time: ''
        };

        // holds the the table data
        this.tableData = null;

        // whether this part is showing previous work
        this.isShowPreviousWork = false;

        // whether the student work is for a submit
        this.isSubmit = false;

        // whether students can attach files to their work
        this.isStudentAttachmentEnabled = false;

        // whether the prompt is shown or not
        this.isPromptVisible = true;

        // whether the save button is shown or not
        this.isSaveButtonVisible = false;

        // whether the submit button is shown or not
        this.isSubmitButtonVisible = false;

        // counter to keep track of the number of submits
        this.submitCounter = 0;

        // flag for whether to show the advanced authoring
        this.showAdvancedAuthoring = false;

        // whether the JSON authoring is displayed
        this.showJSONAuthoring = false;

        // the latest annotations
        this.latestAnnotations = null;

        // whether the reset table button is shown or not
        this.isResetTableButtonVisible = true;

        // whether the snip table button is shown or not
        this.isSnipTableButtonVisible = true;

        // the label for the notebook in thos project
        this.notebookConfig = this.NotebookService.getNotebookConfig();

        // the options for when to update this component from a connected component
        this.connectedComponentUpdateOnOptions = [{
            value: 'change',
            text: 'Change'
        }, {
            value: 'submit',
            text: 'Submit'
        }];

        // get the current node and node id
        var currentNode = this.StudentDataService.getCurrentNode();
        if (currentNode != null) {
            this.nodeId = currentNode.id;
        } else {
            this.nodeId = this.$scope.nodeId;
        }

        // get the component content from the scope
        this.componentContent = this.$scope.componentContent;

        // get the authoring component content
        this.authoringComponentContent = this.$scope.authoringComponentContent;

        /*
         * get the original component content. this is used when showing
         * previous work from another component.
         */
        this.originalComponentContent = this.$scope.originalComponentContent;

        // the mode to load the component in e.g. 'student', 'grading', 'onlyShowWork'
        this.mode = this.$scope.mode;

        this.latestConnectedComponentState = null;
        this.latestConnectedComponentParams = null;

        this.workgroupId = this.$scope.workgroupId;
        this.teacherWorkgroupId = this.$scope.teacherWorkgroupId;

        if (this.componentContent != null) {

            // get the component id
            this.componentId = this.componentContent.id;

            if (this.mode === 'student') {
                this.isPromptVisible = true;
                this.isSaveButtonVisible = this.componentContent.showSaveButton;
                this.isSubmitButtonVisible = this.componentContent.showSubmitButton;

                this.tableId = 'table_' + this.nodeId + "_" + this.componentId;

                // get the latest annotations
                this.latestAnnotations = this.AnnotationService.getLatestComponentAnnotations(this.nodeId, this.componentId, this.workgroupId);
                this.isResetTableButtonVisible = true;
            } else if (this.mode === 'grading') {
                this.isPromptVisible = true;
                this.isSaveButtonVisible = false;
                this.isSubmitButtonVisible = false;
                this.isResetTableButtonVisible = false;
                this.isSnipTableButtonVisible = false;
                this.isDisabled = true;

                // get the latest annotations
                this.latestAnnotations = this.AnnotationService.getLatestComponentAnnotations(this.nodeId, this.componentId, this.workgroupId);
            } else if (this.mode === 'onlyShowWork') {
                this.isPromptVisible = false;
                this.isSaveButtonVisible = false;
                this.isSubmitButtonVisible = false;
                this.isResetTableButtonVisible = false;
                this.isSnipTableButtonVisible = false;
                this.isDisabled = true;
            } else if (this.mode === 'showPreviousWork') {
                this.isPromptVisible = true;
                this.isSaveButtonVisible = false;
                this.isSubmitButtonVisible = false;
                this.isResetTableButtonVisible = false;
                this.isDisabled = true;
            } else if (this.mode === 'authoring') {
                this.isSaveButtonVisible = this.componentContent.showSaveButton;
                this.isSubmitButtonVisible = this.componentContent.showSubmitButton;
                // generate the summernote rubric element id
                this.summernoteRubricId = 'summernoteRubric_' + this.nodeId + '_' + this.componentId;

                // set the component rubric into the summernote rubric
                this.summernoteRubricHTML = this.componentContent.rubric;

                // the tooltip text for the insert WISE asset button
                var insertAssetString = this.$translate('INSERT_ASSET');

                /*
                 * create the custom button for inserting WISE assets into
                 * summernote
                 */
                var InsertAssetButton = this.UtilService.createInsertAssetButton(this, null, this.nodeId, this.componentId, 'rubric', insertAssetString);

                /*
                 * the options that specifies the tools to display in the
                 * summernote prompt
                 */
                this.summernoteRubricOptions = {
                    toolbar: [['style', ['style']], ['font', ['bold', 'underline', 'clear']], ['fontname', ['fontname']], ['fontsize', ['fontsize']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['table', ['table']], ['insert', ['link', 'video']], ['view', ['fullscreen', 'codeview', 'help']], ['customButton', ['insertAssetButton']]],
                    height: 300,
                    disableDragAndDrop: true,
                    buttons: {
                        insertAssetButton: InsertAssetButton
                    }
                };

                this.updateAdvancedAuthoringView();

                $scope.$watch(function () {
                    return this.authoringComponentContent;
                }.bind(this), function (newValue, oldValue) {

                    /*
                     * reset the values so that the preview is refreshed with
                     * the new content
                     */
                    this.submitCounter = 0;
                    this.componentContent = this.ProjectService.injectAssetPaths(newValue);
                    this.isSaveButtonVisible = this.componentContent.showSaveButton;
                    this.isSubmitButtonVisible = this.componentContent.showSubmitButton;
                    this.resetTable();
                }.bind(this), true);
            }

            var componentState = null;

            // get the component state from the scope
            componentState = this.$scope.componentState;

            // set whether studentAttachment is enabled
            this.isStudentAttachmentEnabled = this.componentContent.isStudentAttachmentEnabled;

            if (componentState == null) {
                // check if we need to import work

                var importPreviousWorkNodeId = this.getImportPreviousWorkNodeId();
                var importPreviousWorkComponentId = this.getImportPreviousWorkComponentId();

                if (importPreviousWorkNodeId != null && importPreviousWorkComponentId != null) {
                    // import the work from the other component
                    this.importWork();
                }
            } else {
                // populate the student work into this component
                this.setStudentWork(componentState);
            }

            // set up the table
            this.setupTable();

            // check if the student has used up all of their submits
            if (this.componentContent.maxSubmitCount != null && this.submitCounter >= this.componentContent.maxSubmitCount) {
                /*
                 * the student has used up all of their chances to submit so we
                 * will disable the submit button
                 */
                this.isSubmitButtonDisabled = true;
            }

            // check if we need to lock this component
            this.calculateDisabled();

            if (this.$scope.$parent.nodeController != null) {
                // register this component with the parent node
                this.$scope.$parent.nodeController.registerComponentController(this.$scope, this.componentContent);
            }
        }

        /**
         * A connected component has changed its student data so we will
         * perform any necessary changes to this component
         * @param connectedComponent the connected component
         * @param connectedComponentParams the connected component params
         * @param componentState the component state from the connected
         * component that has changed
         */
        this.$scope.handleConnectedComponentStudentDataChanged = function (connectedComponent, connectedComponentParams, componentState) {

            if (connectedComponent != null && connectedComponentParams != null && componentState != null) {

                if (connectedComponentParams.updateOn === 'change') {
                    // get the component type that has changed
                    var componentType = connectedComponent.type;

                    /*
                     * make a copy of the component state so we don't accidentally
                     * change any values in the referenced object
                     */
                    componentState = this.UtilService.makeCopyOfJSONObject(componentState);

                    if (componentType === 'Table') {

                        // set the table data
                        this.$scope.tableController.setStudentWork(componentState);

                        // the table has changed
                        this.$scope.tableController.isDirty = true;
                    } else if (componentType === 'Graph') {

                        // set the graph data into the table
                        this.$scope.tableController.setGraphDataIntoTableData(componentState, connectedComponentParams);

                        // the table has changed
                        this.$scope.tableController.isDirty = true;
                    } else if (componentType === 'Embedded') {

                        // set the table data
                        this.$scope.tableController.setStudentWork(componentState);

                        // the table has changed
                        this.$scope.tableController.isDirty = true;
                    }
                }
            }
        }.bind(this);

        /**
         * Get the component state from this component. The parent node will
         * call this function to obtain the component state when it needs to
         * save student data.
         * @param isSubmit boolean whether the request is coming from a submit
         * action (optional; default is false)
         * @return a promise of a component state containing the student data
         */
        this.$scope.getComponentState = function (isSubmit) {
            var deferred = this.$q.defer();
            var getState = false;
            var action = 'change';

            if (isSubmit) {
                if (this.$scope.tableController.isSubmitDirty) {
                    getState = true;
                    action = 'submit';
                }
            } else {
                if (this.$scope.tableController.isDirty) {
                    getState = true;
                    action = 'save';
                }
            }

            if (getState) {
                // create a component state populated with the student data
                this.$scope.tableController.createComponentState(action).then(function (componentState) {
                    deferred.resolve(componentState);
                });
            } else {
                /*
                 * the student does not have any unsaved changes in this component
                 * so we don't need to save a component state for this component.
                 * we will immediately resolve the promise here.
                 */
                deferred.resolve();
            }

            return deferred.promise;
        }.bind(this);

        /**
         * The parent node submit button was clicked
         */
        this.$scope.$on('nodeSubmitClicked', angular.bind(this, function (event, args) {

            // get the node id of the node
            var nodeId = args.nodeId;

            // make sure the node id matches our parent node
            if (this.nodeId === nodeId) {

                // trigger the submit
                var submitTriggeredBy = 'nodeSubmitButton';
                this.submit(submitTriggeredBy);
            }
        }));

        /**
         * Listen for the 'studentWorkSavedToServer' event which is fired when
         * we receive the response from saving a component state to the server
         */
        this.$scope.$on('studentWorkSavedToServer', angular.bind(this, function (event, args) {

            var componentState = args.studentWork;

            // check that the component state is for this component
            if (componentState && this.nodeId === componentState.nodeId && this.componentId === componentState.componentId) {

                // set isDirty to false because the component state was just saved and notify node
                this.isDirty = false;
                this.$scope.$emit('componentDirty', { componentId: this.componentId, isDirty: false });

                var isAutoSave = componentState.isAutoSave;
                var isSubmit = componentState.isSubmit;
                var serverSaveTime = componentState.serverSaveTime;
                var clientSaveTime = this.ConfigService.convertToClientTimestamp(serverSaveTime);

                // set save message
                if (isSubmit) {
                    this.setSaveMessage(this.$translate('submitted'), clientSaveTime);

                    this.lockIfNecessary();

                    // set isSubmitDirty to false because the component state was just submitted and notify node
                    this.isSubmitDirty = false;
                    this.$scope.$emit('componentSubmitDirty', { componentId: this.componentId, isDirty: false });
                } else if (isAutoSave) {
                    this.setSaveMessage(this.$translate('AUTO_SAVED'), clientSaveTime);
                } else {
                    this.setSaveMessage(this.$translate('SAVED'), clientSaveTime);
                }
            }

            // check if the component state is from a connected component
            if (this.ProjectService.isConnectedComponent(this.nodeId, this.componentId, componentState.componentId)) {

                // get the connected component params
                var connectedComponentParams = this.ProjectService.getConnectedComponentParams(this.componentContent, componentState.componentId);

                if (connectedComponentParams != null) {

                    if (connectedComponentParams.updateOn === 'save' || connectedComponentParams.updateOn === 'submit' && componentState.isSubmit) {

                        var performUpdate = false;

                        /*
                         * make a copy of the component state so we don't accidentally
                         * change any values in the referenced object
                         */
                        componentState = this.UtilService.makeCopyOfJSONObject(componentState);

                        /*
                         * make sure the student hasn't entered any values into the
                         * table so that we don't overwrite any of their work.
                         */
                        if (this.isTableEmpty() || this.isTableReset()) {
                            /*
                             * the student has not entered any values into the table
                             * so we can update it
                             */
                            performUpdate = true;
                        } else {
                            /*
                             * the student has entered values into the table so we
                             * will ask them if they want to update it
                             */
                            /*
                            var answer = confirm('Do you want to update the connected table?');
                             if (answer) {
                                // the student answered yes
                                performUpdate = true;
                            }
                            */
                            performUpdate = true;
                        }

                        if (performUpdate) {
                            // set the table data
                            this.$scope.tableController.setStudentWork(componentState);

                            // the table has changed
                            this.$scope.tableController.isDirty = true;
                            this.$scope.tableController.isSubmitDirty = true;
                        }

                        /*
                         * remember the component state and connected component params
                         * in case we need to use them again later
                         */
                        this.latestConnectedComponentState = componentState;
                        this.latestConnectedComponentParams = connectedComponentParams;
                    }
                }
            }
        }));

        /**
         * Listen for the 'annotationSavedToServer' event which is fired when
         * we receive the response from saving an annotation to the server
         */
        this.$scope.$on('annotationSavedToServer', function (event, args) {

            if (args != null) {

                // get the annotation that was saved to the server
                var annotation = args.annotation;

                if (annotation != null) {

                    // get the node id and component id of the annotation
                    var annotationNodeId = annotation.nodeId;
                    var annotationComponentId = annotation.componentId;

                    // make sure the annotation was for this component
                    if (_this.nodeId === annotationNodeId && _this.componentId === annotationComponentId) {

                        // get latest score and comment annotations for this component
                        _this.latestAnnotations = _this.AnnotationService.getLatestComponentAnnotations(_this.nodeId, _this.componentId, _this.workgroupId);
                    }
                }
            }
        });

        /**
         * Listen for the 'exitNode' event which is fired when the student
         * exits the parent node. This will perform any necessary cleanup
         * when the student exits the parent node.
         */
        this.$scope.$on('exitNode', angular.bind(this, function (event, args) {}));

        this.$scope.getNumber = function (num) {
            var array = new Array();

            // make sure num is a valid number
            if (num != null && !isNaN(num)) {
                array = new Array(parseInt(num));
            }

            return array;
        };

        /*
         * Listen for the assetSelected event which occurs when the user
         * selects an asset from the choose asset popup
         */
        this.$scope.$on('assetSelected', function (event, args) {

            if (args != null) {

                // make sure the event was fired for this component
                if (args.nodeId == _this.nodeId && args.componentId == _this.componentId) {
                    // the asset was selected for this component
                    var assetItem = args.assetItem;

                    if (assetItem != null) {
                        var fileName = assetItem.fileName;

                        if (fileName != null) {
                            /*
                             * get the assets directory path
                             * e.g.
                             * /wise/curriculum/3/
                             */
                            var assetsDirectoryPath = _this.ConfigService.getProjectAssetsDirectoryPath();
                            var fullAssetPath = assetsDirectoryPath + '/' + fileName;

                            var summernoteId = '';

                            if (args.target == 'prompt') {
                                // the target is the summernote prompt element
                                summernoteId = 'summernotePrompt_' + _this.nodeId + '_' + _this.componentId;
                            } else if (args.target == 'rubric') {
                                // the target is the summernote rubric element
                                summernoteId = 'summernoteRubric_' + _this.nodeId + '_' + _this.componentId;
                            }

                            if (summernoteId != '') {
                                if (_this.UtilService.isImage(fileName)) {
                                    /*
                                     * move the cursor back to its position when the asset chooser
                                     * popup was clicked
                                     */
                                    $('#' + summernoteId).summernote('editor.restoreRange');
                                    $('#' + summernoteId).summernote('editor.focus');

                                    // add the image html
                                    $('#' + summernoteId).summernote('insertImage', fullAssetPath, fileName);
                                } else if (_this.UtilService.isVideo(fileName)) {
                                    /*
                                     * move the cursor back to its position when the asset chooser
                                     * popup was clicked
                                     */
                                    $('#' + summernoteId).summernote('editor.restoreRange');
                                    $('#' + summernoteId).summernote('editor.focus');

                                    // insert the video element
                                    var videoElement = document.createElement('video');
                                    videoElement.controls = 'true';
                                    videoElement.innerHTML = "<source ng-src='" + fullAssetPath + "' type='video/mp4'>";
                                    $('#' + summernoteId).summernote('insertNode', videoElement);
                                }
                            }
                        }
                    }
                }
            }

            // close the popup
            _this.$mdDialog.hide();
        });
    }

    /**
     * Get a copy of the table data
     * @param tableData the table data to copy
     * @return a copy of the table data
     */


    _createClass(TableController, [{
        key: 'getCopyOfTableData',
        value: function getCopyOfTableData(tableData) {
            var tableDataCopy = null;

            if (tableData != null) {
                // create a JSON string from the table data
                var tableDataJSONString = JSON.stringify(tableData);

                // create a JSON object from the table data string
                var tableDataJSON = JSON.parse(tableDataJSONString);

                tableDataCopy = tableDataJSON;
            }

            return tableDataCopy;
        }
    }, {
        key: 'setupTable',


        /**
         * Setup the table
         */
        value: function setupTable() {

            if (this.tableData == null) {
                /*
                 * the student does not have any table data so we will use
                 * the table data from the component content
                 */
                this.tableData = this.getCopyOfTableData(this.componentContent.tableData);
            }
        }
    }, {
        key: 'resetTable',


        /**
         * Reset the table data to its initial state from the component content
         */
        value: function resetTable() {

            var importPreviousWorkNodeId = this.getImportPreviousWorkNodeId();
            var importPreviousWorkComponentId = this.getImportPreviousWorkComponentId();

            if (importPreviousWorkNodeId != null && importPreviousWorkComponentId != null) {
                // import the work from the other component
                this.importWork();
            } else {
                // get the original table from the step content
                this.tableData = this.getCopyOfTableData(this.componentContent.tableData);
            }

            // the table has changed so we will perform additional processing
            this.studentDataChanged();
        }
    }, {
        key: 'getTableDataRows',


        /**
         * Get the rows of the table data
         */
        value: function getTableDataRows() {
            return this.tableData;
        }
    }, {
        key: 'setStudentWork',


        /**
         * Populate the student work into the component
         * @param componentState the component state to populate into the component
         */
        value: function setStudentWork(componentState) {

            if (componentState != null) {

                // get the student data from the component state
                var studentData = componentState.studentData;

                if (studentData != null) {
                    // set the table into the controller
                    this.tableData = studentData.tableData;

                    var submitCounter = studentData.submitCounter;

                    if (submitCounter != null) {
                        // populate the submit counter
                        this.submitCounter = submitCounter;
                    }

                    this.processLatestSubmit();
                }
            }
        }
    }, {
        key: 'processLatestSubmit',


        /**
         * Check if latest component state is a submission and set isSubmitDirty accordingly
         */
        value: function processLatestSubmit() {
            var latestState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(this.nodeId, this.componentId);

            if (latestState) {
                var serverSaveTime = latestState.serverSaveTime;
                var clientSaveTime = this.ConfigService.convertToClientTimestamp(serverSaveTime);
                if (latestState.isSubmit) {
                    // latest state is a submission, so set isSubmitDirty to false and notify node
                    this.isSubmitDirty = false;
                    this.$scope.$emit('componentSubmitDirty', { componentId: this.componentId, isDirty: false });
                    // set save message
                    this.setSaveMessage(this.$translate('LAST_SUBMITTED'), clientSaveTime);
                } else {
                    // latest state is not a submission, so set isSubmitDirty to true and notify node
                    this.isSubmitDirty = true;
                    this.$scope.$emit('componentSubmitDirty', { componentId: this.componentId, isDirty: true });
                    // set save message
                    this.setSaveMessage(this.$translate('LAST_SAVED'), clientSaveTime);
                }
            }
        }
    }, {
        key: 'saveButtonClicked',


        /**
         * Called when the student clicks the save button
         */
        value: function saveButtonClicked() {
            this.isSubmit = false;

            // tell the parent node that this component wants to save
            this.$scope.$emit('componentSaveTriggered', { nodeId: this.nodeId, componentId: this.componentId });
        }
    }, {
        key: 'submitButtonClicked',


        /**
         * Called when the student clicks the submit button
         */
        value: function submitButtonClicked() {
            // trigger the submit
            var submitTriggeredBy = 'componentSubmitButton';
            this.submit(submitTriggeredBy);
        }
    }, {
        key: 'submit',


        /**
         * A submit was triggered by the component submit button or node submit button
         * @param submitTriggeredBy what triggered the submit
         * e.g. 'componentSubmitButton' or 'nodeSubmitButton'
         */
        value: function submit(submitTriggeredBy) {

            if (this.isSubmitDirty) {
                // the student has unsubmitted work

                var performSubmit = true;

                if (this.componentContent.maxSubmitCount != null) {
                    // there is a max submit count

                    // calculate the number of submits this student has left
                    var numberOfSubmitsLeft = this.componentContent.maxSubmitCount - this.submitCounter;

                    var message = '';

                    if (numberOfSubmitsLeft <= 0) {
                        // the student does not have any more chances to submit
                        performSubmit = false;
                    } else if (numberOfSubmitsLeft == 1) {
                        /*
                         * the student has one more chance to submit left so maybe
                         * we should ask the student if they are sure they want to submit
                         */
                    } else if (numberOfSubmitsLeft > 1) {
                        /*
                         * the student has more than one chance to submit left so maybe
                         * we should ask the student if they are sure they want to submit
                         */
                    }
                }

                if (performSubmit) {

                    /*
                     * set isSubmit to true so that when the component state is
                     * created, it will know that is a submit component state
                     * instead of just a save component state
                     */
                    this.isSubmit = true;

                    // increment the submit counter
                    this.incrementSubmitCounter();

                    // check if the student has used up all of their submits
                    if (this.componentContent.maxSubmitCount != null && this.submitCounter >= this.componentContent.maxSubmitCount) {
                        /*
                         * the student has used up all of their submits so we will
                         * disable the submit button
                         */
                        this.isSubmitButtonDisabled = true;
                    }

                    if (this.mode === 'authoring') {
                        /*
                         * we are in authoring mode so we will set values appropriately
                         * here because the 'componentSubmitTriggered' event won't
                         * work in authoring mode
                         */
                        this.isDirty = false;
                        this.isSubmitDirty = false;
                        this.createComponentState('submit');
                    }

                    if (submitTriggeredBy == null || submitTriggeredBy === 'componentSubmitButton') {
                        // tell the parent node that this component wants to submit
                        this.$scope.$emit('componentSubmitTriggered', { nodeId: this.nodeId, componentId: this.componentId });
                    } else if (submitTriggeredBy === 'nodeSubmitButton') {
                        // nothing extra needs to be performed
                    }
                } else {
                    /*
                     * the student has cancelled the submit so if a component state
                     * is created, it will just be a regular save and not submit
                     */
                    this.isSubmit = false;
                }
            }
        }

        /**
         * Increment the submit counter
         */

    }, {
        key: 'incrementSubmitCounter',
        value: function incrementSubmitCounter() {
            this.submitCounter++;
        }
    }, {
        key: 'lockIfNecessary',
        value: function lockIfNecessary() {
            // check if we need to lock the component after the student submits
            if (this.isLockAfterSubmit()) {
                this.isDisabled = true;
            }
        }
    }, {
        key: 'studentDataChanged',


        /**
         * Called when the student changes their work
         */
        value: function studentDataChanged() {
            var _this2 = this;

            /*
             * set the dirty flag so we will know we need to save the
             * student work later
             */
            this.isDirty = true;
            this.$scope.$emit('componentDirty', { componentId: this.componentId, isDirty: true });

            this.isSubmitDirty = true;
            this.$scope.$emit('componentSubmitDirty', { componentId: this.componentId, isDirty: true });

            // clear out the save message
            this.setSaveMessage('', null);

            // get this part id
            var componentId = this.getComponentId();

            /*
             * the student work in this component has changed so we will tell
             * the parent node that the student data will need to be saved.
             * this will also notify connected parts that this component's student
             * data has changed.
             */
            var action = 'change';

            // create a component state populated with the student data
            this.createComponentState(action).then(function (componentState) {
                _this2.$scope.$emit('componentStudentDataChanged', { nodeId: _this2.nodeId, componentId: componentId, componentState: componentState });
            });
        }
    }, {
        key: 'createComponentState',


        /**
         * Create a new component state populated with the student data
         * @param action the action that is triggering creating of this component state
         * e.g. 'submit', 'save', 'change'
         * @return a promise that will return a component state
         */
        value: function createComponentState(action) {

            var deferred = this.$q.defer();

            // create a new component state
            var componentState = this.NodeService.createNewComponentState();

            var studentData = {};

            // insert the table data
            studentData.tableData = this.getCopyOfTableData(this.tableData);

            // set the submit counter
            studentData.submitCounter = this.submitCounter;

            // set the flag for whether the student submitted this work
            componentState.isSubmit = this.isSubmit;

            // set the student data into the component state
            componentState.studentData = studentData;

            /*
             * reset the isSubmit value so that the next component state
             * doesn't maintain the same value
             */
            this.isSubmit = false;

            /*
             * perform any additional processing that is required before returning
             * the component state
             */
            this.createComponentStateAdditionalProcessing(deferred, componentState, action);

            return deferred.promise;
        }
    }, {
        key: 'createBlankComponentState',


        /**
         * Create a new component state with no student data
         * @return a component state with no student data
         */
        value: function createBlankComponentState() {

            // create a new component state
            var componentState = this.NodeService.createNewComponentState();

            if (componentState != null) {
                var studentData = {};

                // set the student data into the component state
                componentState.studentData = studentData;
            }

            return componentState;
        }
    }, {
        key: 'createComponentStateAdditionalProcessing',


        /**
         * Perform any additional processing that is required before returning the
         * component state
         * Note: this function must call deferred.resolve() otherwise student work
         * will not be saved
         * @param deferred a deferred object
         * @param componentState the component state
         * @param action the action that we are creating the component state for
         * e.g. 'submit', 'save', 'change'
         */
        value: function createComponentStateAdditionalProcessing(deferred, componentState, action) {
            /*
             * we don't need to perform any additional processing so we can resolve
             * the promise immediately
             */
            deferred.resolve(componentState);
        }

        /**
         * Check if we need to lock the component
         */

    }, {
        key: 'calculateDisabled',
        value: function calculateDisabled() {

            var nodeId = this.nodeId;

            // get the component content
            var componentContent = this.componentContent;

            if (componentContent != null) {

                // check if the parent has set this component to disabled
                if (componentContent.isDisabled) {
                    this.isDisabled = true;
                } else if (componentContent.lockAfterSubmit) {
                    // we need to lock the step after the student has submitted

                    // get the component states for this component
                    var componentStates = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(this.nodeId, this.componentId);

                    // check if any of the component states were submitted
                    var isSubmitted = this.NodeService.isWorkSubmitted(componentStates);

                    if (isSubmitted) {
                        // the student has submitted work for this component
                        this.isDisabled = true;
                    }
                }
            }
        }
    }, {
        key: 'showResetTableButton',


        /**
         * Check whether we need to show the reset table button
         * @return whether to show the reset table button
         */
        value: function showResetTableButton() {
            return this.isResetTableButtonVisible;
        }
    }, {
        key: 'isLockAfterSubmit',


        /**
         * Check whether we need to lock the component after the student
         * submits an answer.
         */
        value: function isLockAfterSubmit() {
            var result = false;

            if (this.componentContent != null) {

                // check the lockAfterSubmit field in the component content
                if (this.componentContent.lockAfterSubmit) {
                    result = true;
                }
            }

            return result;
        }
    }, {
        key: 'getPrompt',


        /**
         * Get the prompt to show to the student
         */
        value: function getPrompt() {
            var prompt = null;

            if (this.originalComponentContent != null) {
                // this is a show previous work component

                if (this.originalComponentContent.showPreviousWorkPrompt) {
                    // show the prompt from the previous work component
                    prompt = this.componentContent.prompt;
                } else {
                    // show the prompt from the original component
                    prompt = this.originalComponentContent.prompt;
                }
            } else if (this.componentContent != null) {
                prompt = this.componentContent.prompt;
            }

            return prompt;
        }
    }, {
        key: 'importWork',


        /**
         * Import work from another component
         */
        value: function importWork() {

            // get the component content
            var componentContent = this.componentContent;

            if (componentContent != null) {

                var importPreviousWorkNodeId = this.getImportPreviousWorkNodeId();
                var importPreviousWorkComponentId = this.getImportPreviousWorkComponentId();

                if (importPreviousWorkNodeId != null && importPreviousWorkComponentId != null) {

                    // get the latest component state from the component we are importing from
                    var importWorkComponentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(importPreviousWorkNodeId, importPreviousWorkComponentId);

                    if (importWorkComponentState != null) {

                        // create a blank component state without student work
                        var defaultComponentState = this.createBlankComponentState();

                        if (defaultComponentState != null && defaultComponentState.studentData != null) {
                            // set the authored component content table data into the component state
                            defaultComponentState.studentData.tableData = this.getCopyOfTableData(this.componentContent.tableData);
                        }

                        // copy the cell text values into the default component state
                        var mergedComponentState = this.copyTableDataCellText(importWorkComponentState, defaultComponentState);

                        // set the merged component state into this component
                        this.setStudentWork(mergedComponentState);

                        // make the work dirty so that it gets saved
                        this.studentDataChanged();
                    }
                }
            }
        }
    }, {
        key: 'attachStudentAsset',


        /**
         * handle importing notebook item data (we only support csv for now)
         */
        value: function attachStudentAsset(studentAsset) {
            // TODO: implement me
        }
    }, {
        key: 'setGraphDataIntoTableData',


        /**
         * Set the graph data into the table data
         * @param componentState the component state to get the graph data from
         * @param params (optional) the params to specify what columns
         * and rows to overwrite in the table data
         */
        value: function setGraphDataIntoTableData(componentState, params) {

            /*
             * the default is set to not skip the first row and for the
             * x column to be the first column and the y column to be the
             * second column
             */
            var skipFirstRow = false;
            var xColumn = 0;
            var yColumn = 1;
            var seriesIndex = 0;

            if (params != null) {

                if (params.skipFirstRow != null) {
                    // determine whether to skip the first row
                    skipFirstRow = params.skipFirstRow;
                }

                if (params.xColumn != null) {
                    // get the x column
                    xColumn = params.xColumn;
                }

                if (params.yColumn != null) {
                    // get the y column
                    yColumn = params.yColumn;
                }

                if (params.seriesIndex != null) {
                    // get the series index
                    seriesIndex = params.seriesIndex;
                }
            }

            if (componentState != null && componentState.studentData != null) {

                // get the table data rows
                var tableDataRows = this.getTableDataRows();

                if (tableDataRows != null) {

                    var data = null;

                    var studentData = componentState.studentData;

                    // get the series
                    var series = studentData.series;

                    if (series != null && series.length > 0) {

                        // get the series that we will get data from
                        var tempSeries = series[seriesIndex];

                        if (tempSeries != null) {

                            // get the data from the series
                            data = tempSeries.data;

                            if (data != null) {

                                // our counter for traversing the data rows
                                var dataRowCounter = 0;

                                // loop through all the table data rows
                                for (var r = 0; r < tableDataRows.length; r++) {

                                    if (skipFirstRow && r === 0) {
                                        // skip the first table data row
                                        continue;
                                    }

                                    var x = '';
                                    var y = '';

                                    // get the data row
                                    var dataRow = data[dataRowCounter];

                                    if (dataRow != null) {
                                        // get the x and y values from the data row
                                        x = dataRow[0];
                                        y = dataRow[1];
                                    }

                                    // set the x and y values into the table data
                                    this.setTableDataCellValue(xColumn, r, null, x);
                                    this.setTableDataCellValue(yColumn, r, null, y);

                                    // increment the data row counter
                                    dataRowCounter++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }, {
        key: 'setTableDataCellValue',


        /**
         * Set the table data cell value
         * @param x the x index (0 indexed)
         * @param y the y index (0 indexed)
         * @param value the value to set in the cell
         */
        value: function setTableDataCellValue(x, y, table, value) {

            var tableDataRows = table;

            if (table == null) {
                // get the table data rows
                tableDataRows = this.getTableDataRows();
            }

            if (tableDataRows != null) {

                // get the row we want
                var row = tableDataRows[y];

                if (row != null) {

                    // get the cell we want
                    var cell = row[x];

                    if (cell != null) {

                        // set the value into the cell
                        cell.text = value;
                    }
                }
            }
        }
    }, {
        key: 'getTableDataCellValue',


        /**
         * Get the value of a cell in the table
         * @param x the x coordinate
         * @param y the y coordinate
         * @param table (optional) table data to get the value from. this is used
         * when we want to look up the value in the default authored table
         * @returns the cell value (text or a number)
         */
        value: function getTableDataCellValue(x, y, table) {

            var cellValue = null;

            if (table == null) {
                // get the table data rows
                table = this.getTableDataRows();
            }

            if (table != null) {

                // get the row we want
                var row = table[y];

                if (row != null) {

                    // get the cell we want
                    var cell = row[x];

                    if (cell != null) {

                        // set the value into the cell
                        cellValue = cell.text;
                    }
                }
            }

            return cellValue;
        }

        /**
         * Get the component id
         * @return the component id
         */

    }, {
        key: 'getComponentId',
        value: function getComponentId() {
            return this.componentContent.id;
        }
    }, {
        key: 'authoringViewComponentChanged',


        /**
         * The component has changed in the regular authoring view so we will save the project
         */
        value: function authoringViewComponentChanged() {
            // update the JSON string in the advanced authoring view textarea
            this.updateAdvancedAuthoringView();

            /*
             * notify the parent node that the content has changed which will save
             * the project to the server
             */
            this.$scope.$parent.nodeAuthoringController.authoringViewNodeChanged();
        }
    }, {
        key: 'advancedAuthoringViewComponentChanged',


        /**
         * The component has changed in the advanced authoring view so we will update
         * the component and save the project.
         */
        value: function advancedAuthoringViewComponentChanged() {

            try {
                /*
                 * create a new component by converting the JSON string in the advanced
                 * authoring view into a JSON object
                 */
                var authoringComponentContent = angular.fromJson(this.authoringComponentContentJSONString);

                // replace the component in the project
                this.ProjectService.replaceComponent(this.nodeId, this.componentId, authoringComponentContent);

                this.authoringComponentContent = authoringComponentContent;

                // set the new component into the controller
                this.componentContent = this.ProjectService.injectAssetPaths(authoringComponentContent);

                /*
                 * notify the parent node that the content has changed which will save
                 * the project to the server
                 */
                this.$scope.$parent.nodeAuthoringController.authoringViewNodeChanged();
            } catch (e) {
                this.$scope.$parent.nodeAuthoringController.showSaveErrorAdvancedAuthoring();
            }
        }
    }, {
        key: 'updateAdvancedAuthoringView',


        /**
         * Update the component JSON string that will be displayed in the advanced authoring view textarea
         */
        value: function updateAdvancedAuthoringView() {
            this.authoringComponentContentJSONString = angular.toJson(this.authoringComponentContent, 4);
        }
    }, {
        key: 'authoringViewTableSizeConfirmChange',


        /**
         * Confirm whether user really want to change row/column size. Only confirm if they're decreasing the size.
         */
        value: function authoringViewTableSizeConfirmChange(rowOrColumn, oldValue) {
            if (rowOrColumn === 'rows') {
                if (this.authoringComponentContent.numRows < oldValue) {
                    // author wants to decrease number of rows, so confirm
                    var answer = confirm(this.$translate('table.areYouSureYouWantToDecreaseTheNumberOfRows'));
                    if (answer) {
                        // author confirms yes, proceed with change
                        this.authoringViewTableSizeChanged();
                    } else {
                        // author says no, so revert
                        this.authoringComponentContent.numRows = oldValue;
                    }
                } else {
                    // author wants to increase number of rows, so let them.
                    this.authoringViewTableSizeChanged();
                }
            } else if (rowOrColumn === 'columns') {
                if (this.authoringComponentContent.numColumns < oldValue) {
                    // author wants to decrease number of columns, so confirm
                    var answer = confirm(this.$translate('table.areYouSureYouWantToDecreaseTheNumberOfColumns'));
                    if (answer) {
                        // author confirms yes, proceed with change
                        this.authoringViewTableSizeChanged();
                    } else {
                        // author says no, so revert
                        this.authoringComponentContent.numColumns = oldValue;
                    }
                } else {
                    // author wants to increase number of columns, so let them.
                    this.authoringViewTableSizeChanged();
                }
            }
        }

        /**
         * The table size has changed in the authoring view so we will update it
         */

    }, {
        key: 'authoringViewTableSizeChanged',
        value: function authoringViewTableSizeChanged() {

            // create a new table with the new size and populate it with the existing cells
            var newTable = this.getUpdatedTableSize(this.authoringComponentContent.numRows, this.authoringComponentContent.numColumns);

            // set the new table into the component content
            this.authoringComponentContent.tableData = newTable;

            // perform preview updating and project saving
            this.authoringViewComponentChanged();
        }

        /**
         * Create a table with the given dimensions. Populate the cells with
         * the cells from the old table.
         * @param newNumRows the number of rows in the new table
         * @param newNumColumns the number of columns in the new table
         * @returns a new table
         */

    }, {
        key: 'getUpdatedTableSize',
        value: function getUpdatedTableSize(newNumRows, newNumColumns) {

            var newTable = [];

            // create the rows
            for (var r = 0; r < newNumRows; r++) {

                var newRow = [];

                // create the columns
                for (var c = 0; c < newNumColumns; c++) {

                    // try to get the cell from the old table
                    var cell = this.getCellObjectFromComponentContent(c, r);

                    if (cell == null) {
                        /*
                         * the old table does not have a cell for the given
                         * row/column location so we will create an empty cell
                         */
                        cell = this.createEmptyCell();
                    }

                    newRow.push(cell);
                }

                newTable.push(newRow);
            }

            return newTable;
        }

        /**
         * Get the cell object at the given x, y location
         * @param x the column number (zero indexed)
         * @param y the row number (zero indexed)
         * @returns the cell at the given x, y location or null if there is none
         */

    }, {
        key: 'getCellObjectFromComponentContent',
        value: function getCellObjectFromComponentContent(x, y) {
            var cellObject = null;

            var tableData = this.authoringComponentContent.tableData;

            if (tableData != null) {

                // get the row
                var row = tableData[y];

                if (row != null) {

                    // get the cell
                    cellObject = row[x];
                }
            }

            return cellObject;
        }

        /**
         * Create an empty cell
         * @returns an empty cell object
         */

    }, {
        key: 'createEmptyCell',
        value: function createEmptyCell() {
            var cell = {};

            cell.text = '';
            cell.editable = true;
            cell.size = null;

            return cell;
        }

        /**
         * Insert a row into the table from the authoring view
         * @param y the row number to insert at
         */

    }, {
        key: 'authoringViewInsertRow',
        value: function authoringViewInsertRow(y) {

            // get the table
            var tableData = this.authoringComponentContent.tableData;

            if (tableData != null) {

                // create the new row that we will insert
                var newRow = [];

                // get the number of columns
                var numColumns = this.authoringComponentContent.numColumns;

                // populate the new row with the correct number of cells
                for (var c = 0; c < numColumns; c++) {
                    // create an empty cell
                    var newCell = this.createEmptyCell();
                    newRow.push(newCell);
                }

                // insert the new row into the table
                tableData.splice(y, 0, newRow);

                // update the number of rows value
                this.authoringComponentContent.numRows++;
            }

            // save the project and update the preview
            this.authoringViewComponentChanged();
        }

        /**
         * Delete a row in the table from the authoring view
         * @param y the row number to delete
         */

    }, {
        key: 'authoringViewDeleteRow',
        value: function authoringViewDeleteRow(y) {

            var answer = confirm(this.$translate('table.areYouSureYouWantToDeleteThisRow'));

            if (answer) {
                // get the table
                var tableData = this.authoringComponentContent.tableData;

                if (tableData != null) {

                    // remove the row
                    tableData.splice(y, 1);

                    // update the number of rows value
                    this.authoringComponentContent.numRows--;
                }

                // save the project and update the preview
                this.authoringViewComponentChanged();
            }
        }

        /**
         * Insert a column into the table from the authoring view
         * @param x the column number to insert at
         */

    }, {
        key: 'authoringViewInsertColumn',
        value: function authoringViewInsertColumn(x) {

            // get the table
            var tableData = this.authoringComponentContent.tableData;

            if (tableData != null) {

                var numRows = this.authoringComponentContent.numRows;

                // loop through all the rows
                for (var r = 0; r < numRows; r++) {

                    // get a row
                    var tempRow = tableData[r];

                    if (tempRow != null) {

                        // create an empty cell
                        var newCell = this.createEmptyCell();

                        // insert the cell into the row
                        tempRow.splice(x, 0, newCell);
                    }
                }

                // update the number of columns value
                this.authoringComponentContent.numColumns++;
            }

            // save the project and update the preview
            this.authoringViewComponentChanged();
        }

        /**
         * Delete a column in the table from the authoring view
         * @param x the column number to delete
         */

    }, {
        key: 'authoringViewDeleteColumn',
        value: function authoringViewDeleteColumn(x) {

            var answer = confirm(this.$translate('table.areYouSureYouWantToDeleteThisColumn'));

            if (answer) {
                // get the table
                var tableData = this.authoringComponentContent.tableData;

                if (tableData != null) {

                    var numRows = this.authoringComponentContent.numRows;

                    // loop through all the rows
                    for (var r = 0; r < numRows; r++) {

                        // get a row
                        var tempRow = tableData[r];

                        if (tempRow != null) {

                            // remove the cell from the row
                            tempRow.splice(x, 1);
                        }
                    }

                    // update the number of columns value
                    this.authoringComponentContent.numColumns--;
                }

                // save the project and update the preview
                this.authoringViewComponentChanged();
            }
        }

        /**
         * Get all the step node ids in the project
         * @returns all the step node ids
         */

    }, {
        key: 'getStepNodeIds',
        value: function getStepNodeIds() {
            var stepNodeIds = this.ProjectService.getNodeIds();

            return stepNodeIds;
        }

        /**
         * Get the step number and title
         * @param nodeId get the step number and title for this node
         * @returns the step number and title
         */

    }, {
        key: 'getNodePositionAndTitleByNodeId',
        value: function getNodePositionAndTitleByNodeId(nodeId) {
            var nodePositionAndTitle = this.ProjectService.getNodePositionAndTitleByNodeId(nodeId);

            return nodePositionAndTitle;
        }

        /**
         * Get the components in a step
         * @param nodeId get the components in the step
         * @returns the components in the step
         */

    }, {
        key: 'getComponentsByNodeId',
        value: function getComponentsByNodeId(nodeId) {
            var components = this.ProjectService.getComponentsByNodeId(nodeId);

            return components;
        }

        /**
         * Check if a node is a step node
         * @param nodeId the node id to check
         * @returns whether the node is an application node
         */

    }, {
        key: 'isApplicationNode',
        value: function isApplicationNode(nodeId) {
            var result = this.ProjectService.isApplicationNode(nodeId);

            return result;
        }

        /**
         * Set the message next to the save button
         * @param message the message to display
         * @param time the time to display
         */

    }, {
        key: 'setSaveMessage',
        value: function setSaveMessage(message, time) {
            this.saveMessage.text = message;
            this.saveMessage.time = time;
        }
    }, {
        key: 'getNumRows',


        /**
         * Get the number of rows in the table
         * @returns the number of rows in the table
         */
        value: function getNumRows() {
            return this.componentContent.numRows;
        }

        /**
         * Get the number of columns in the table
         * @returns the number of columns in the table
         */

    }, {
        key: 'getNumColumns',
        value: function getNumColumns() {
            return this.componentContent.numColumns;
        }

        /**
         * Check if the table is empty. The table is empty if all the
         * cells are empty string.
         * @returns whether the table is empty
         */

    }, {
        key: 'isTableEmpty',
        value: function isTableEmpty() {
            var result = true;

            var numRows = this.getNumRows();
            var numColumns = this.getNumColumns();

            // loop through all the rows
            for (var r = 0; r < numRows; r++) {

                // loop through all the cells in the row
                for (var c = 0; c < numColumns; c++) {

                    // get a cell value
                    var cellValue = this.getTableDataCellValue(c, r);

                    if (cellValue != null && cellValue != '') {
                        // the cell is not empty so the table is not empty
                        result = false;
                        break;
                    }
                }

                if (result == false) {
                    break;
                }
            }

            return result;
        }

        /**
         * Check if the table is set to the default values. The table
         * is set to the default values if all the cells match the
         * values in the default authored table.
         * @returns whether the table is set to the default values
         */

    }, {
        key: 'isTableReset',
        value: function isTableReset() {
            var result = true;

            var numRows = this.getNumRows();
            var numColumns = this.getNumColumns();

            // get the default table
            var defaultTable = this.componentContent.tableData;

            // loop through all the rows
            for (var r = 0; r < numRows; r++) {

                // loop through all the cells in the row
                for (var c = 0; c < numColumns; c++) {

                    // get the cell value from the student table
                    var cellValue = this.getTableDataCellValue(c, r);

                    // get the cell value from the default table
                    var defaultCellValue = this.getTableDataCellValue(c, r, defaultTable);

                    if (cellValue != defaultCellValue) {
                        // the cell values do not match so the table is not set to the default values
                        result = false;
                        break;
                    }
                }

                if (result == false) {
                    break;
                }
            }

            return result;
        }

        /**
         * Snip the table by converting it to an image
         * @param $event the click event
         */

    }, {
        key: 'snipTable',
        value: function snipTable($event) {
            var _this3 = this;

            // get the table element. this will obtain an array.
            var tableElement = angular.element('#table_' + this.nodeId + '_' + this.componentId);

            if (tableElement != null && tableElement.length > 0) {

                // hide all the iframes otherwise html2canvas may cut off the table
                this.UtilService.hideIFrames();

                // scroll to the component so html2canvas doesn't cut off the table
                this.$location.hash(this.componentId);
                this.$anchorScroll();

                // get the table element
                tableElement = tableElement[0];

                try {
                    // convert the table element to a canvas element
                    (0, _html2canvas2.default)(tableElement).then(function (canvas) {

                        // get the canvas as a base64 string
                        var img_b64 = canvas.toDataURL('image/png');

                        // get the image object
                        var imageObject = _this3.UtilService.getImageObjectFromBase64String(img_b64);

                        // create a notebook item with the image populated into it
                        _this3.NotebookService.addNewItem($event, imageObject);

                        // we are done capturing the table so we will show the iframes again
                        _this3.UtilService.showIFrames();

                        /*
                         * scroll to the component in case the view has shifted after
                         * showing the iframe
                         */
                        _this3.$location.hash(_this3.componentId);
                        _this3.$anchorScroll();
                    }).catch(function () {

                        /*
                         * an error occurred while trying to capture the table so we
                         * will show the iframes again
                         */
                        _this3.UtilService.showIFrames();

                        /*
                         * scroll to the component in case the view has shifted after
                         * showing the iframe
                         */
                        _this3.$location.hash(_this3.componentId);
                        _this3.$anchorScroll();
                    });
                } catch (e) {

                    /*
                     * an error occurred while trying to capture the table so we
                     * will show the iframes again
                     */
                    this.UtilService.showIFrames();

                    /*
                     * scroll to the component in case the view has shifted after
                     * showing the iframe
                     */
                    this.$location.hash(this.componentId);
                    this.$anchorScroll();
                }
            }
        }

        /**
         * Check whether we need to show the snip table button
         * @return whether to show the snip table button
         */

    }, {
        key: 'showSnipTableButton',
        value: function showSnipTableButton() {
            if (this.NotebookService.isNotebookEnabled() && this.isSnipTableButtonVisible) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Copy the table data cell text from one component state to another
         * @param fromComponentState get the cell text values from this component state
         * @param toComponentState set the cell text values in this component state
         */

    }, {
        key: 'copyTableDataCellText',
        value: function copyTableDataCellText(fromComponentState, toComponentState) {

            if (fromComponentState != null && toComponentState != null) {
                var fromStudentData = fromComponentState.studentData;
                var toStudentData = toComponentState.studentData;

                if (fromStudentData != null && toStudentData != null) {
                    var fromTableData = fromStudentData.tableData;
                    var toTableData = toStudentData.tableData;

                    if (fromTableData != null & toTableData != null) {

                        // loop through all the rows
                        for (var y = 0; y < this.getNumRows(); y++) {

                            // loop through all the columns
                            for (var x = 0; x < this.getNumColumns(); x++) {

                                // get the cell value
                                var cellValue = this.getTableDataCellValue(x, y, fromTableData);

                                if (cellValue != null) {
                                    // set the cell value
                                    this.setTableDataCellValue(x, y, toTableData, cellValue);
                                }
                            }
                        }
                    }
                }
            }

            return toComponentState;
        }

        /**
         * Register the the listener that will listen for the exit event
         * so that we can perform saving before exiting.
         */

    }, {
        key: 'registerExitListener',
        value: function registerExitListener() {

            /*
             * Listen for the 'exit' event which is fired when the student exits
             * the VLE. This will perform saving before the VLE exits.
             */
            this.exitListener = this.$scope.$on('exit', angular.bind(this, function (event, args) {

                this.$rootScope.$broadcast('doneExiting');
            }));
        }
    }, {
        key: 'authoringShowPreviousWorkClicked',


        /**
         * The show previous work checkbox was clicked
         */
        value: function authoringShowPreviousWorkClicked() {

            if (!this.authoringComponentContent.showPreviousWork) {
                /*
                 * show previous work has been turned off so we will clear the
                 * show previous work node id, show previous work component id, and
                 * show previous work prompt values
                 */
                this.authoringComponentContent.showPreviousWorkNodeId = null;
                this.authoringComponentContent.showPreviousWorkComponentId = null;
                this.authoringComponentContent.showPreviousWorkPrompt = null;

                // the authoring component content has changed so we will save the project
                this.authoringViewComponentChanged();
            }
        }

        /**
         * The show previous work node id has changed
         */

    }, {
        key: 'authoringShowPreviousWorkNodeIdChanged',
        value: function authoringShowPreviousWorkNodeIdChanged() {

            if (this.authoringComponentContent.showPreviousWorkNodeId == null || this.authoringComponentContent.showPreviousWorkNodeId == '') {

                /*
                 * the show previous work node id is null so we will also set the
                 * show previous component id to null
                 */
                this.authoringComponentContent.showPreviousWorkComponentId = '';
            } else {
                this.authoringShowPreviousWorkNode = this.ProjectService.getNodeById(this.authoringComponentContent.showPreviousWorkNodeId);
            }

            // the authoring component content has changed so we will save the project
            this.authoringViewComponentChanged();
        }

        /**
         * The show previous work component id has changed
         */

    }, {
        key: 'authoringShowPreviousWorkComponentIdChanged',
        value: function authoringShowPreviousWorkComponentIdChanged() {

            // get the show previous work node id
            var showPreviousWorkNodeId = this.authoringComponentContent.showPreviousWorkNodeId;

            // get the show previous work prompt boolean value
            var showPreviousWorkPrompt = this.authoringComponentContent.showPreviousWorkPrompt;

            // get the old show previous work component id
            var oldShowPreviousWorkComponentId = this.componentContent.showPreviousWorkComponentId;

            // get the new show previous work component id
            var newShowPreviousWorkComponentId = this.authoringComponentContent.showPreviousWorkComponentId;

            // get the new show previous work component
            var newShowPreviousWorkComponent = this.ProjectService.getComponentByNodeIdAndComponentId(showPreviousWorkNodeId, newShowPreviousWorkComponentId);

            if (newShowPreviousWorkComponent == null || newShowPreviousWorkComponent == '') {
                // the new show previous work component is empty

                // save the component
                this.authoringViewComponentChanged();
            } else if (newShowPreviousWorkComponent != null) {

                // get the current component type
                var currentComponentType = this.componentContent.type;

                // get the new component type
                var newComponentType = newShowPreviousWorkComponent.type;

                // check if the component types are different
                if (newComponentType != currentComponentType) {
                    /*
                     * the component types are different so we will need to change
                     * the whole component
                     */

                    // make sure the author really wants to change the component type
                    var answer = confirm(this.$translate('ARE_YOU_SURE_YOU_WANT_TO_CHANGE_THIS_COMPONENT_TYPE'));

                    if (answer) {
                        // the author wants to change the component type

                        /*
                         * get the component service so we can make a new instance
                         * of the component
                         */
                        var componentService = this.$injector.get(newComponentType + 'Service');

                        if (componentService != null) {

                            // create a new component
                            var newComponent = componentService.createComponent();

                            // set move over the values we need to keep
                            newComponent.id = this.authoringComponentContent.id;
                            newComponent.showPreviousWork = true;
                            newComponent.showPreviousWorkNodeId = showPreviousWorkNodeId;
                            newComponent.showPreviousWorkComponentId = newShowPreviousWorkComponentId;
                            newComponent.showPreviousWorkPrompt = showPreviousWorkPrompt;

                            /*
                             * update the authoring component content JSON string to
                             * change the component
                             */
                            this.authoringComponentContentJSONString = JSON.stringify(newComponent);

                            // update the component in the project and save the project
                            this.advancedAuthoringViewComponentChanged();
                        }
                    } else {
                        /*
                         * the author does not want to change the component type so
                         * we will rollback the showPreviousWorkComponentId value
                         */
                        this.authoringComponentContent.showPreviousWorkComponentId = oldShowPreviousWorkComponentId;
                    }
                } else {
                    /*
                     * the component types are the same so we do not need to change
                     * the component type and can just save
                     */
                    this.authoringViewComponentChanged();
                }
            }
        }

        /**
         * Check if a component generates student work
         * @param component the component
         * @return whether the component generates student work
         */

    }, {
        key: 'componentHasWork',
        value: function componentHasWork(component) {
            var result = true;

            if (component != null) {
                result = this.ProjectService.componentHasWork(component);
            }

            return result;
        }

        /**
         * The import previous work checkbox was clicked
         */

    }, {
        key: 'authoringImportPreviousWorkClicked',
        value: function authoringImportPreviousWorkClicked() {

            if (!this.authoringComponentContent.importPreviousWork) {
                /*
                 * import previous work has been turned off so we will clear the
                 * import previous work node id, and import previous work
                 * component id
                 */
                this.authoringComponentContent.importPreviousWorkNodeId = null;
                this.authoringComponentContent.importPreviousWorkComponentId = null;

                // the authoring component content has changed so we will save the project
                this.authoringViewComponentChanged();
            }
        }

        /**
         * The import previous work node id has changed
         */

    }, {
        key: 'authoringImportPreviousWorkNodeIdChanged',
        value: function authoringImportPreviousWorkNodeIdChanged() {

            if (this.authoringComponentContent.importPreviousWorkNodeId == null || this.authoringComponentContent.importPreviousWorkNodeId == '') {

                /*
                 * the import previous work node id is null so we will also set the
                 * import previous component id to null
                 */
                this.authoringComponentContent.importPreviousWorkComponentId = '';
            }

            // the authoring component content has changed so we will save the project
            this.authoringViewComponentChanged();
        }

        /**
         * The import previous work component id has changed
         */

    }, {
        key: 'authoringImportPreviousWorkComponentIdChanged',
        value: function authoringImportPreviousWorkComponentIdChanged() {

            // the authoring component content has changed so we will save the project
            this.authoringViewComponentChanged();
        }

        /**
         * The author has changed the rubric
         */

    }, {
        key: 'summernoteRubricHTMLChanged',
        value: function summernoteRubricHTMLChanged() {

            // get the summernote rubric html
            var html = this.summernoteRubricHTML;

            /*
             * remove the absolute asset paths
             * e.g.
             * <img src='https://wise.berkeley.edu/curriculum/3/assets/sun.png'/>
             * will be changed to
             * <img src='sun.png'/>
             */
            html = this.ConfigService.removeAbsoluteAssetPaths(html);

            /*
             * replace <a> and <button> elements with <wiselink> elements when
             * applicable
             */
            html = this.UtilService.insertWISELinks(html);

            // update the component rubric
            this.authoringComponentContent.rubric = html;

            // the authoring component content has changed so we will save the project
            this.authoringViewComponentChanged();
        }

        /**
         * Get the import previous work node id
         * @return the import previous work node id or null
         */

    }, {
        key: 'getImportPreviousWorkNodeId',
        value: function getImportPreviousWorkNodeId() {
            var importPreviousWorkNodeId = null;

            if (this.componentContent != null && this.componentContent.importPreviousWorkNodeId != null) {
                importPreviousWorkNodeId = this.componentContent.importPreviousWorkNodeId;

                if (importPreviousWorkNodeId == null || importPreviousWorkNodeId == '') {
                    /*
                     * check if the node id is in the field that we used to store
                     * the import previous work node id in
                     */
                    importPreviousWorkNodeId = this.componentContent.importWorkNodeId;
                }
            }

            return importPreviousWorkNodeId;
        }

        /**
         * Get the import previous work component id
         * @return the import previous work component id or null
         */

    }, {
        key: 'getImportPreviousWorkComponentId',
        value: function getImportPreviousWorkComponentId() {
            var importPreviousWorkComponentId = null;

            if (this.componentContent != null && this.componentContent.importPreviousWorkComponentId != null) {
                var importPreviousWorkComponentId = this.componentContent.importPreviousWorkComponentId;

                if (importPreviousWorkComponentId == null || importPreviousWorkComponentId == '') {
                    /*
                     * check if the component id is in the field that we used to store
                     * the import previous work component id in
                     */
                    importPreviousWorkComponentId = this.componentContent.importWorkComponentId;
                }
            }

            return importPreviousWorkComponentId;
        }

        /**
         * Add a connected component
         */

    }, {
        key: 'addConnectedComponent',
        value: function addConnectedComponent() {

            /*
             * create the new connected component object that will contain a
             * node id and component id
             */
            var newConnectedComponent = {};
            newConnectedComponent.nodeId = this.nodeId;
            newConnectedComponent.componentId = null;
            newConnectedComponent.updateOn = 'change';

            // initialize the array of connected components if it does not exist yet
            if (this.authoringComponentContent.connectedComponents == null) {
                this.authoringComponentContent.connectedComponents = [];
            }

            // add the connected component
            this.authoringComponentContent.connectedComponents.push(newConnectedComponent);

            // the authoring component content has changed so we will save the project
            this.authoringViewComponentChanged();
        }

        /**
         * Delete a connected component
         * @param index the index of the component to delete
         */

    }, {
        key: 'deleteConnectedComponent',
        value: function deleteConnectedComponent(index) {

            if (this.authoringComponentContent.connectedComponents != null) {
                this.authoringComponentContent.connectedComponents.splice(index, 1);
            }

            // the authoring component content has changed so we will save the project
            this.authoringViewComponentChanged();
        }

        /**
         * Set the show submit button value
         * @param show whether to show the submit button
         */

    }, {
        key: 'setShowSubmitButtonValue',
        value: function setShowSubmitButtonValue(show) {

            if (show == null || show == false) {
                // we are hiding the submit button
                this.authoringComponentContent.showSaveButton = false;
                this.authoringComponentContent.showSubmitButton = false;
            } else {
                // we are showing the submit button
                this.authoringComponentContent.showSaveButton = true;
                this.authoringComponentContent.showSubmitButton = true;
            }

            /*
             * notify the parent node that this component is changing its
             * showSubmitButton value so that it can show save buttons on the
             * step or sibling components accordingly
             */
            this.$scope.$emit('componentShowSubmitButtonValueChanged', { nodeId: this.nodeId, componentId: this.componentId, showSubmitButton: show });
        }

        /**
         * The showSubmitButton value has changed
         */

    }, {
        key: 'showSubmitButtonValueChanged',
        value: function showSubmitButtonValueChanged() {

            /*
             * perform additional processing for when we change the showSubmitButton
             * value
             */
            this.setShowSubmitButtonValue(this.authoringComponentContent.showSubmitButton);

            // the authoring component content has changed so we will save the project
            this.authoringViewComponentChanged();
        }

        /**
         * Make all the cells uneditable
         */

    }, {
        key: 'makeAllCellsUneditable',
        value: function makeAllCellsUneditable() {

            // get the table data
            var tableData = this.authoringComponentContent.tableData;

            if (tableData != null) {

                // loop through all the rows
                for (var r = 0; r < tableData.length; r++) {
                    var row = tableData[r];

                    if (row != null) {

                        // loop through all the cells in the row
                        for (var c = 0; c < row.length; c++) {

                            // get a cell
                            var cell = row[c];

                            if (cell != null) {

                                // make the cell uneditable
                                cell.editable = false;
                            }
                        }
                    }
                }
            }

            // the authoring component content has changed so we will save the project
            this.authoringViewComponentChanged();
        }

        /**
         * Make all the cells edtiable
         */

    }, {
        key: 'makeAllCellsEditable',
        value: function makeAllCellsEditable() {

            // get the table data
            var tableData = this.authoringComponentContent.tableData;

            if (tableData != null) {

                // loop through all the rows
                for (var r = 0; r < tableData.length; r++) {
                    var row = tableData[r];

                    if (row != null) {

                        // loop through all the cells in the row
                        for (var c = 0; c < row.length; c++) {

                            // get a cell
                            var cell = row[c];

                            if (cell != null) {

                                // make the cell editable
                                cell.editable = true;
                            }
                        }
                    }
                }
            }

            // the authoring component content has changed so we will save the project
            this.authoringViewComponentChanged();
        }
    }]);

    return TableController;
}();

TableController.$inject = ['$anchorScroll', '$filter', '$injector', '$location', '$mdDialog', '$q', '$rootScope', '$scope', 'AnnotationService', 'ConfigService', 'NodeService', 'NotebookService', 'ProjectService', 'StudentDataService', 'TableService', 'UtilService'];

exports.default = TableController;
//# sourceMappingURL=tableController.js.map