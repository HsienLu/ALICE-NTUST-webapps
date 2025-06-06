'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AudioOscillatorController = function () {
    function AudioOscillatorController($filter, $injector, $mdDialog, $q, $rootScope, $scope, $timeout, AnnotationService, ConfigService, NodeService, AudioOscillatorService, ProjectService, StudentAssetService, StudentDataService, UtilService) {
        var _this2 = this;

        _classCallCheck(this, AudioOscillatorController);

        this.$filter = $filter;
        this.$injector = $injector;
        this.$mdDialog = $mdDialog;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.AnnotationService = AnnotationService;
        this.ConfigService = ConfigService;
        this.NodeService = NodeService;
        this.AudioOscillatorService = AudioOscillatorService;
        this.ProjectService = ProjectService;
        this.StudentAssetService = StudentAssetService;
        this.StudentDataService = StudentDataService;
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

        // holds the text that the student has typed
        this.studentResponse = '';

        // an array of frequencies that the student has played
        this.frequenciesPlayed = [];

        // an array of sorted frequencies that the student has played
        this.frequenciesPlayedSorted = [];

        // the number of frequences the student has played
        this.numberOfFrequenciesPlayed = 0;

        // the lowest frequency the student played
        this.minFrequencyPlayed = null;

        // the highest frequency the student played
        this.maxFrequencyPlayed = null;

        // holds student attachments like assets
        this.attachments = [];

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

        // whether this component is showing previous work
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

        // whether the submit button is disabled
        this.isSubmitButtonDisabled = false;

        // counter to keep track of the number of submits
        this.submitCounter = 0;

        // flag for whether to show the advanced authoring
        this.showAdvancedAuthoring = false;

        // whether the JSON authoring is displayed
        this.showJSONAuthoring = false;

        // the latest annotations
        this.latestAnnotations = null;

        // whether the audio is playing
        this.isPlaying = false;

        // default oscillator type to sine
        this.oscillatorType = "sine";

        // default frequency is 440
        this.frequency = 440;

        // holds the oscillator types the student can choose
        this.oscillatorTypes = [];

        // the default dimensions of the oscilloscope
        this.oscilloscopeId = 'oscilloscope';
        this.oscilloscopeWidth = 800;
        this.oscilloscopeHeight = 400;
        this.gridCellSize = 50;

        // create the audio context
        this.audioContext = new AudioContext();

        // whether we should stop drawing after a good draw
        this.stopAfterGoodDraw = true;

        this.showOscillatorTypeChooser = false;
        this.availableOscillatorTypes = ['sine', 'square', 'triangle', 'sawtooth'];
        this.oscillatorTypeToAdd = 'sine';

        // the text to display on the play/stop button
        this.playStopButtonText = this.$translate('audioOscillator.play');

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
        this.authoringComponentContentJSONString = this.$scope.authoringComponentContentJSONString;

        /*
         * get the original component content. this is used when showing
         * previous work from another component.
         */
        this.originalComponentContent = this.$scope.originalComponentContent;

        this.mode = this.$scope.mode;

        if (this.componentContent != null) {

            // get the component id
            this.componentId = this.componentContent.id;

            if (this.mode === 'student') {
                this.isPromptVisible = true;
                this.isSaveButtonVisible = this.componentContent.showSaveButton;
                this.isSubmitButtonVisible = this.componentContent.showSubmitButton;

                // get the latest annotations
                this.latestAnnotations = this.AnnotationService.getLatestComponentAnnotations(this.nodeId, this.componentId, this.workgroupId);
            } else if (this.mode === 'grading') {
                this.isPromptVisible = true;
                this.isSaveButtonVisible = false;
                this.isSubmitButtonVisible = false;
                this.isDisabled = true;

                // get the latest annotations
                this.latestAnnotations = this.AnnotationService.getLatestComponentAnnotations(this.nodeId, this.componentId, this.workgroupId);
            } else if (this.mode === 'onlyShowWork') {
                this.isPromptVisible = false;
                this.isSaveButtonVisible = false;
                this.isSubmitButtonVisible = false;
                this.isDisabled = true;
            } else if (this.mode === 'showPreviousWork') {
                this.isPromptVisible = true;
                this.isSaveButtonVisible = false;
                this.isSubmitButtonVisible = false;
                this.isDisabled = true;
            } else if (this.mode === 'authoring') {
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
                    var _this = this;

                    // stop the audio if it is playing
                    this.stop();

                    // inject asset paths if necessary
                    this.componentContent = this.ProjectService.injectAssetPaths(newValue);

                    this.submitCounter = 0;
                    this.isSaveButtonVisible = this.componentContent.showSaveButton;
                    this.isSubmitButtonVisible = this.componentContent.showSubmitButton;

                    // load the parameters into the component
                    this.setParametersFromComponentContent();

                    // draw the oscilloscope gride after the view has rendered
                    $timeout(function () {
                        _this.drawOscilloscopeGrid();
                    }, 0);
                }.bind(this), true);
            }

            this.oscilloscopeId = 'oscilloscope' + this.componentId;

            // load the parameters into the component
            this.setParametersFromComponentContent();

            var componentState = null;

            // set whether studentAttachment is enabled
            this.isStudentAttachmentEnabled = this.componentContent.isStudentAttachmentEnabled;

            // get the component state from the scope
            componentState = this.$scope.componentState;

            if (componentState == null) {
                /*
                 * only import work if the student does not already have
                 * work for this component
                 */

                // check if we need to import work
                var importPreviousWorkNodeId = this.componentContent.importPreviousWorkNodeId;
                var importPreviousWorkComponentId = this.componentContent.importPreviousWorkComponentId;

                if (importPreviousWorkNodeId == null || importPreviousWorkNodeId == '') {
                    /*
                     * check if the node id is in the field that we used to store
                     * the import previous work node id in
                     */
                    importPreviousWorkNodeId = this.componentContent.importWorkNodeId;
                }

                if (importPreviousWorkComponentId == null || importPreviousWorkComponentId == '') {
                    /*
                     * check if the component id is in the field that we used to store
                     * the import previous work component id in
                     */
                    importPreviousWorkComponentId = this.componentContent.importWorkComponentId;
                }

                if (importPreviousWorkNodeId != null && importPreviousWorkComponentId != null) {
                    // import the work from the other component
                    this.importWork();
                } else if (this.componentContent.starterSentence != null) {
                    /*
                     * the student has not done any work and there is a starter sentence
                     * so we will populate the textarea with the starter sentence
                     */
                    this.studentResponse = this.componentContent.starterSentence;
                }
            } else {
                // populate the student work into this component
                this.setStudentWork(componentState);
            }

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

            /*
             * draw the oscilloscope grid after angular has finished rendering
             * the view. we need to wait until after angular has set the
             * canvas width and height to draw the grid because setting the
             * dimensions of the canvas will erase it.
             */
            $timeout(function () {
                _this2.drawOscilloscopeGrid();
            }, 0);
        }

        /**
         * Returns true iff there is student work that hasn't been saved yet
         */
        this.$scope.isDirty = function () {
            return this.$scope.audioOscillatorController.isDirty;
        }.bind(this);

        /**
         * Get the component state from this component. The parent node will
         * call this function to obtain the component state when it needs to
         * save student data.
         * @param isSubmit boolean whether the request is coming from a submit
         * action (optional; default is false)
         * @return a component state containing the student data
         */
        this.$scope.getComponentState = function (isSubmit) {
            var deferred = this.$q.defer();
            var getState = false;
            var action = 'change';

            if (isSubmit) {
                if (this.$scope.audioOscillatorController.isSubmitDirty) {
                    getState = true;
                    action = 'submit';
                }
            } else {
                if (this.$scope.audioOscillatorController.isDirty) {
                    getState = true;
                    action = 'save';
                }
            }

            if (getState) {
                // create a component state populated with the student data
                this.$scope.audioOscillatorController.createComponentState(action).then(function (componentState) {
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
        this.$scope.$on('nodeSubmitClicked', function (event, args) {

            // get the node id of the node
            var nodeId = args.nodeId;

            // make sure the node id matches our parent node
            if (this.nodeId === nodeId) {

                // trigger the submit
                var submitTriggeredBy = 'nodeSubmitButton';
                this.submit(submitTriggeredBy);
            }
        }.bind(this));

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
                    this.setSaveMessage(this.$translate('SUBMITTED'), clientSaveTime);

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
                    if (_this2.nodeId === annotationNodeId && _this2.componentId === annotationComponentId) {

                        // get latest score and comment annotations for this component
                        _this2.latestAnnotations = _this2.AnnotationService.getLatestComponentAnnotations(_this2.nodeId, _this2.componentId, _this2.workgroupId);
                    }
                }
            }
        });

        /**
         * Listen for the 'exitNode' event which is fired when the student
         * exits the parent node. This will perform any necessary cleanup
         * when the student exits the parent node.
         */
        this.$scope.$on('exitNode', function (event, args) {
            // stop playing the audio if the student leaves the step
            this.stop();
            this.audioContext.close();
        }.bind(this));

        /*
         * Listen for the assetSelected event which occurs when the user
         * selects an asset from the choose asset popup
         */
        this.$scope.$on('assetSelected', function (event, args) {

            if (args != null) {

                // make sure the event was fired for this component
                if (args.nodeId == _this2.nodeId && args.componentId == _this2.componentId) {
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
                            var assetsDirectoryPath = _this2.ConfigService.getProjectAssetsDirectoryPath();
                            var fullAssetPath = assetsDirectoryPath + '/' + fileName;

                            var summernoteId = '';

                            if (args.target == 'prompt') {
                                // the target is the summernote prompt element
                                summernoteId = 'summernotePrompt_' + _this2.nodeId + '_' + _this2.componentId;
                            } else if (args.target == 'rubric') {
                                // the target is the summernote rubric element
                                summernoteId = 'summernoteRubric_' + _this2.nodeId + '_' + _this2.componentId;
                            }

                            if (summernoteId != '') {
                                if (_this2.UtilService.isImage(fileName)) {
                                    /*
                                     * move the cursor back to its position when the asset chooser
                                     * popup was clicked
                                     */
                                    $('#' + summernoteId).summernote('editor.restoreRange');
                                    $('#' + summernoteId).summernote('editor.focus');

                                    // add the image html
                                    $('#' + summernoteId).summernote('insertImage', fullAssetPath, fileName);
                                } else if (_this2.UtilService.isVideo(fileName)) {
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
            _this2.$mdDialog.hide();
        });
    }

    /**
     * Load the parameters from the component content object
     */


    _createClass(AudioOscillatorController, [{
        key: 'setParametersFromComponentContent',
        value: function setParametersFromComponentContent() {
            if (this.componentContent.startingFrequency != null) {
                this.frequency = this.componentContent.startingFrequency;
            }

            if (this.componentContent.oscillatorTypes != null) {
                this.oscillatorTypes = this.componentContent.oscillatorTypes;

                if (this.componentContent.oscillatorTypes.length > 0) {
                    this.oscillatorType = this.componentContent.oscillatorTypes[0];
                }
            }

            if (this.componentContent.oscilloscopeWidth != null) {
                this.oscilloscopeWidth = this.componentContent.oscilloscopeWidth;
            }

            if (this.componentContent.oscilloscopeHeight != null) {
                this.oscilloscopeHeight = this.componentContent.oscilloscopeHeight;
            }

            if (this.componentContent.gridCellSize != null) {
                this.gridCellSize = this.componentContent.gridCellSize;
            }

            if (this.componentContent.stopAfterGoodDraw != null) {
                this.stopAfterGoodDraw = this.componentContent.stopAfterGoodDraw;
            }
        }

        /**
         * Populate the student work into the component
         * @param componentState the component state to populate into the component
         */

    }, {
        key: 'setStudentWork',
        value: function setStudentWork(componentState) {

            if (componentState != null) {
                var studentData = componentState.studentData;

                if (studentData != null) {

                    if (studentData.frequenciesPlayed != null) {
                        // the frequencies the student has played
                        this.frequenciesPlayed = studentData.frequenciesPlayed;

                        if (this.frequenciesPlayed.length > 0) {
                            // repopulate the last frequency played
                            this.frequency = this.frequenciesPlayed[this.frequenciesPlayed.length - 1];
                        }
                    }

                    if (studentData.frequenciesPlayedSorted != null) {
                        // the sorted frequencies the student has played
                        this.frequenciesPlayedSorted = studentData.frequenciesPlayedSorted;
                    }

                    if (studentData.numberOfFrequenciesPlayed != null) {
                        // the number of frequencies the student has played
                        this.numberOfFrequenciesPlayed = studentData.numberOfFrequenciesPlayed;
                    }

                    if (studentData.minFrequencyPlayed != null) {
                        // the minimum frequency the student has played
                        this.minFrequencyPlayed = studentData.minFrequencyPlayed;
                    }

                    if (studentData.maxFrequencyPlayed != null) {
                        // the maximum frequency the student has played
                        this.maxFrequencyPlayed = studentData.maxFrequencyPlayed;
                    }

                    var submitCounter = studentData.submitCounter;

                    if (submitCounter != null) {
                        // populate the submit counter
                        this.submitCounter = submitCounter;
                    }

                    var attachments = studentData.attachments;

                    if (attachments != null) {
                        this.attachments = attachments;
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

            if (this.mode === 'authoring') {
                /*
                 * we are in authoring mode so we will set isDirty to false here
                 * because the 'componentSaveTriggered' event won't work in
                 * authoring mode
                 */
                this.isDirty = false;
            }

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
            var _this3 = this;

            /*
             * set the dirty flags so we will know we need to save or submit the
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
                _this3.$scope.$emit('componentStudentDataChanged', { nodeId: _this3.nodeId, componentId: componentId, componentState: componentState });
            });
        }
    }, {
        key: 'setFrequenciesPlayed',


        /**
         * Set the frequencies played array
         * @param frequenciesPlayed an array of numbers
         */
        value: function setFrequenciesPlayed(frequenciesPlayed) {
            this.frequenciesPlayed = frequenciesPlayed;
        }

        /**
         * Get the frequencies the student played
         */

    }, {
        key: 'getFrequenciesPlayed',
        value: function getFrequenciesPlayed() {
            return this.frequenciesPlayed;
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

            // set the response into the component state
            var studentData = {};

            // set the frequencies the student has played
            studentData.frequenciesPlayed = this.frequenciesPlayed;

            // set the sorted frequencies the student has played
            studentData.frequenciesPlayedSorted = this.frequenciesPlayedSorted;

            // set the number of frequencies the student has played
            studentData.numberOfFrequenciesPlayed = this.numberOfFrequenciesPlayed;

            // set the minimum frequency the student has played
            studentData.minFrequencyPlayed = this.minFrequencyPlayed;

            // set the maximum frequency the student has played
            studentData.maxFrequencyPlayed = this.maxFrequencyPlayed;

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

            // get the component content
            var componentContent = this.componentContent;

            if (componentContent != null) {

                // check if the parent has set this component to disabled
                if (componentContent.isDisabled) {
                    this.isDisabled = true;
                } else if (componentContent.lockAfterSubmit) {
                    // we need to lock the component after the student has submitted

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
        key: 'removeAttachment',
        value: function removeAttachment(attachment) {
            if (this.attachments.indexOf(attachment) != -1) {
                this.attachments.splice(this.attachments.indexOf(attachment), 1);
                this.studentDataChanged();
                // YOU ARE NOW FREEEEEEEEE!
            }
        }
    }, {
        key: 'attachStudentAsset',


        /**
         * Attach student asset to this Component's attachments
         * @param studentAsset
         */
        value: function attachStudentAsset(studentAsset) {
            var _this4 = this;

            if (studentAsset != null) {
                this.StudentAssetService.copyAssetForReference(studentAsset).then(function (copiedAsset) {
                    if (copiedAsset != null) {
                        var attachment = {
                            studentAssetId: copiedAsset.id,
                            iconURL: copiedAsset.iconURL
                        };

                        _this4.attachments.push(attachment);
                        _this4.studentDataChanged();
                    }
                });
            }
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
        key: 'getResponse',


        /**
         * Get the text the student typed
         */
        value: function getResponse() {
            var response = null;

            if (this.studentResponse != null) {
                response = this.studentResponse;
            }

            return response;
        }
    }, {
        key: 'playStopClicked',


        /**
         * The play/stop button was clicked
         */
        value: function playStopClicked() {

            if (this.isPlaying) {
                // the audio is playing so we will now stop it
                this.stop();

                // change the button text to display 'Play'
                this.playStopButtonText = this.$translate('audioOscillator.play');
            } else {
                // the audio is not playing so we will now play it
                this.play();

                // change the button text to display 'Stop'
                this.playStopButtonText = this.$translate('audioOscillator.stop');
            }
        }
    }, {
        key: 'play',


        /**
         * Start playing the audio and draw the oscilloscope
         */
        value: function play() {

            // create the oscillator
            this.oscillator = this.audioContext.createOscillator();
            this.oscillator.type = this.oscillatorType;
            this.oscillator.frequency.value = this.frequency;

            this.gain = this.audioContext.createGain();
            this.gain.gain.value = 0.5;
            this.destination = this.audioContext.destination;
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;

            // connect the audio components together
            this.oscillator.connect(this.gain);
            this.gain.connect(this.destination);
            this.gain.connect(this.analyser);

            this.oscillator.start();

            /*
             * reset the goodDraw boolean value to false because we need
             * to find a good draw again
             */
            this.goodDraw = false;

            // draw the oscilloscope
            this.drawOscilloscope(this.analyser);

            this.isPlaying = true;

            /*
             * add the current frequency to the array of frequencies the student
             * has played
             */
            this.addFrequencyPlayed(this.frequency);

            // set the student data to dirty
            this.studentDataChanged();
        }

        /**
         * Add a frequency the student has played
         * @param frequency the new frequency the student has played
         */

    }, {
        key: 'addFrequencyPlayed',
        value: function addFrequencyPlayed(frequency) {

            // add the new frequency to the array of frequencies
            this.frequenciesPlayed.push(frequency);

            // make a copy of the frequencies played and sort it
            this.frequenciesPlayedSorted = this.UtilService.makeCopyOfJSONObject(this.frequenciesPlayed);
            this.frequenciesPlayedSorted.sort(function (a, b) {
                return a - b;
            });

            // get the number of frequencies the student has played
            this.numberOfFrequenciesPlayed = this.frequenciesPlayed.length;

            // get the minimum frequency the student has played
            this.minFrequencyPlayed = Math.min.apply(Math, _toConsumableArray(this.frequenciesPlayed));

            // get the maximum frequency the student has played
            this.maxFrequencyPlayed = Math.max.apply(Math, _toConsumableArray(this.frequenciesPlayed));
        }

        /**
         * Stop the audio
         */

    }, {
        key: 'stop',
        value: function stop() {
            if (this.oscillator != null) {
                this.oscillator.stop();
            }

            this.isPlaying = false;
        }

        /**
         * Draw the oscilloscope
         */

    }, {
        key: 'drawOscilloscope',
        value: function drawOscilloscope() {
            var _this5 = this;

            // get the analyser to obtain the oscillator data
            var analyser = this.analyser;

            // get the oscilloscope canvas context
            var ctx = document.getElementById(this.oscilloscopeId).getContext('2d');

            var width = ctx.canvas.width;
            var height = ctx.canvas.height;

            // get the number of samples, this will be half the fftSize
            var bufferLength = analyser.frequencyBinCount;

            // create an array to hold the oscillator data
            var timeData = new Uint8Array(bufferLength);

            // populate the oscillator data into the timeData array
            analyser.getByteTimeDomainData(timeData);

            // draw the grid
            this.drawOscilloscopeGrid();

            // start drawing the audio signal line from the oscillator
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgb(0, 200, 0)'; // green
            ctx.beginPath();

            var sliceWidth = width * 1.0 / bufferLength;
            var x = 0;
            var v = 0;
            var y = 0;

            /*
             * we want to start drawing the audio signal such that the first point
             * is at 0,0 on the oscilloscope and the signal rises after that.
             * e.g. pretend the ascii below is a sine wave
             *   _      _
             *  / \    / \
             * -------------------
             *     \_/    \_/
             */
            var foundFirstRisingZeroCrossing = false;
            var firstRisingZeroCrossingIndex = null;
            var firstPointDrawn = false;

            /*
             * loop through all the points and draw the signal from the first
             * rising zero crossing to the end of the buffer
             */
            for (var i = 0; i < bufferLength; i++) {
                var currentY = timeData[i] - 128;
                var nextY = timeData[i + 1] - 128;

                // check if the current data point is the first rising zero crossing
                if (!foundFirstRisingZeroCrossing && (currentY < 0 || currentY == 0) && nextY > 0) {

                    // the point is the first rising zero crossing
                    foundFirstRisingZeroCrossing = true;
                    firstRisingZeroCrossingIndex = i;
                }

                if (foundFirstRisingZeroCrossing) {
                    /*
                     * we have found the first rising zero crossing so we can start
                     * drawing the points.
                     */

                    /*
                     * get the height of the point. we need to perform this
                     * subtraction of 128 to flip the value since canvas
                     * positioning is relative to the upper left corner being 0,0.
                     */
                    v = (128 - (timeData[i] - 128)) / 128.0;
                    y = v * height / 2;

                    if (firstPointDrawn) {
                        // this is not the first point to be drawn
                        ctx.lineTo(x, y);
                    } else {
                        // this is the first point to be drawn
                        ctx.moveTo(x, y);
                        firstPointDrawn = true;
                    }

                    // update the x position we are drawing at
                    x += sliceWidth;
                }
            }

            if (firstRisingZeroCrossingIndex > 0 && firstRisingZeroCrossingIndex < 10) {
                /*
                 * we want the first rising zero crossing index to be close to zero
                 * so that the graph spans almost the whole width of the canvas.
                 * if first rising zero crossing index was close to bufferLength
                 * then we would see a cut off graph.
                 */
                this.goodDraw = true;
            }

            // draw the lines on the canvas
            ctx.stroke();

            if (!this.stopAfterGoodDraw || this.stopAfterGoodDraw && !this.goodDraw) {
                /*
                 * the draw was not good so we will try to draw it again by
                 * sampling the oscillator again and drawing again. if the
                 * draw was good we will stop drawing.
                 */
                requestAnimationFrame(function () {
                    _this5.drawOscilloscope();
                });
            }
        }

        /**
         * Draw the oscilloscope gride
         */

    }, {
        key: 'drawOscilloscopeGrid',
        value: function drawOscilloscopeGrid() {
            // get the oscilliscope canvas context
            var ctx = document.getElementById(this.oscilloscopeId).getContext('2d');

            var width = ctx.canvas.width;
            var height = ctx.canvas.height;
            var gridCellSize = this.gridCellSize;

            // draw a white background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, width, height);

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'lightgrey';
            ctx.beginPath();

            var x = 0;

            // draw the vertical lines
            while (x < width) {

                // draw a vertical line
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);

                // move the x position to the right
                x += gridCellSize;
            }

            // start by drawing the line in the middle
            var y = height / 2;

            // draw the horizontal lines above and including the middle line
            while (y >= 0) {

                // draw a horizontal line
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);

                // move the y position up (this is up because of canvas positioning)
                y -= gridCellSize;
            }

            y = height / 2;

            // draw the horizontal lines below the middle line
            while (y <= height) {

                // draw a horizontal line
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);

                // move the y position down (this is down because of canvas positioning)
                y += gridCellSize;
            }

            // draw the lines on the canvas
            ctx.stroke();
        }

        /**
         * The oscillator type changed
         */

    }, {
        key: 'oscillatorTypeChanged',
        value: function oscillatorTypeChanged() {

            // clear the grid
            this.drawOscilloscopeGrid();

            if (this.isPlaying) {
                this.restartPlayer();
            }
        }

        /**
         * The frequency changed
         */

    }, {
        key: 'frequencyChanged',
        value: function frequencyChanged() {

            // clear the grid
            this.drawOscilloscopeGrid();

            if (this.isPlaying) {
                this.restartPlayer();
            }
        }

        /**
         * Restart the player
         */

    }, {
        key: 'restartPlayer',
        value: function restartPlayer() {
            this.stop();
            this.play();
        }

        /**
         * Show the controls for adding an oscillator type
         */

    }, {
        key: 'authoringOpenAddOscillatorType',
        value: function authoringOpenAddOscillatorType() {
            this.showOscillatorTypeChooser = true;
        }

        /**
         * The author has clicked the add button to add an oscillator type
         */

    }, {
        key: 'authoringAddOscillatorTypeClicked',
        value: function authoringAddOscillatorTypeClicked() {
            var oscillatorTypeToAdd = this.oscillatorTypeToAdd;

            if (this.authoringComponentContent.oscillatorTypes.indexOf(oscillatorTypeToAdd) != -1) {
                // the oscillator type is already in the array of oscillator types

                alert(this.$translate('audioOscillator.errorYouHaveAlreadyAddedOscillatorType', { oscillatorTypeToAdd: oscillatorTypeToAdd }));
            } else {
                // the oscillator type is not already in the array of oscillator types
                this.authoringComponentContent.oscillatorTypes.push(oscillatorTypeToAdd);

                // hide the oscillator type chooser
                this.showOscillatorTypeChooser = false;

                // perform preview updating and project saving
                this.authoringViewComponentChanged();
            }
        }

        /**
         * The author has clicked the cancel button for adding an oscillator type
         */

    }, {
        key: 'authoringCancelOscillatorTypeClicked',
        value: function authoringCancelOscillatorTypeClicked() {
            // hide the oscillator type chooser
            this.showOscillatorTypeChooser = false;
        }

        /**
         * The author has clicked the delete button for removing an oscillator type
         * @param index the index of the oscillator type to remove
         */

    }, {
        key: 'authoringDeleteOscillatorTypeClicked',
        value: function authoringDeleteOscillatorTypeClicked(index) {

            // remove the oscillator type at the given index
            this.authoringComponentContent.oscillatorTypes.splice(index, 1);

            // perform preview updating and project saving
            this.authoringViewComponentChanged();
        }

        /**
         * Import work from another component
         */

    }, {
        key: 'importWork',
        value: function importWork() {

            // get the component content
            var componentContent = this.componentContent;

            if (componentContent != null) {

                // get the import previous work node id and component id
                var importPreviousWorkNodeId = componentContent.importPreviousWorkNodeId;
                var importPreviousWorkComponentId = componentContent.importPreviousWorkComponentId;

                if (importPreviousWorkNodeId == null || importPreviousWorkNodeId == '') {

                    /*
                     * check if the node id is in the field that we used to store
                     * the import previous work node id in
                     */
                    if (componentContent.importWorkNodeId != null && componentContent.importWorkNodeId != '') {
                        importPreviousWorkNodeId = componentContent.importWorkNodeId;
                    }
                }

                if (importPreviousWorkComponentId == null || importPreviousWorkComponentId == '') {

                    /*
                     * check if the component id is in the field that we used to store
                     * the import previous work component id in
                     */
                    if (componentContent.importWorkComponentId != null && componentContent.importWorkComponentId != '') {
                        importPreviousWorkComponentId = componentContent.importWorkComponentId;
                    }
                }

                if (importPreviousWorkNodeId != null && importPreviousWorkComponentId != null) {

                    // get the latest component state for this component
                    var componentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(this.nodeId, this.componentId);

                    /*
                     * we will only import work into this component if the student
                     * has not done any work for this component
                     */
                    if (componentState == null) {
                        // the student has not done any work for this component

                        // get the latest component state from the component we are importing from
                        var importWorkComponentState = this.StudentDataService.getLatestComponentStateByNodeIdAndComponentId(importPreviousWorkNodeId, importPreviousWorkComponentId);

                        if (importWorkComponentState != null) {
                            /*
                             * populate a new component state with the work from the
                             * imported component state
                             */
                            var populatedComponentState = this.AudioOscillatorService.populateComponentState(importWorkComponentState);

                            // populate the component state into this component
                            this.setStudentWork(populatedComponentState);

                            // make the work dirty so that it gets saved
                            this.studentDataChanged();
                        }
                    }
                }
            }
        }
    }, {
        key: 'getComponentId',


        /**
         * Get the component id
         * @return the component id
         */
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
                var editedComponentContent = angular.fromJson(this.authoringComponentContentJSONString);

                // replace the component in the project
                this.ProjectService.replaceComponent(this.nodeId, this.componentId, editedComponentContent);

                // set the new component into the controller
                this.componentContent = editedComponentContent;

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
         * Update the component JSON string that will be displayed in the advanced authoring view textarea
         */

    }, {
        key: 'updateAdvancedAuthoringView',
        value: function updateAdvancedAuthoringView() {
            this.authoringComponentContentJSONString = angular.toJson(this.authoringComponentContent, 4);
        }
    }, {
        key: 'setSaveMessage',


        /**
         * Set the message next to the save button
         * @param message the message to display
         * @param time the time to display
         */
        value: function setSaveMessage(message, time) {
            this.saveMessage.text = message;
            this.saveMessage.time = time;
        }
    }, {
        key: 'registerExitListener',


        /**
         * Register the the listener that will listen for the exit event
         * so that we can perform saving before exiting.
         */
        value: function registerExitListener() {

            /*
             * Listen for the 'exit' event which is fired when the student exits
             * the VLE. This will perform saving before the VLE exits.
             */
            exitListener = this.$scope.$on('exit', angular.bind(this, function (event, args) {}));
        }
    }, {
        key: 'componentHasWork',


        /**
         * Check if a component generates student work
         * @param component the component
         * @return whether the component generates student work
         */
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
    }]);

    return AudioOscillatorController;
}();

;

AudioOscillatorController.$inject = ['$filter', '$injector', '$mdDialog', '$q', '$rootScope', '$scope', '$timeout', 'AnnotationService', 'ConfigService', 'NodeService', 'AudioOscillatorService', 'ProjectService', 'StudentAssetService', 'StudentDataService', 'UtilService'];

exports.default = AudioOscillatorController;
//# sourceMappingURL=audioOscillatorController.js.map