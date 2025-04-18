'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodeService = require('../../services/nodeService');

var _nodeService2 = _interopRequireDefault(_nodeService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DrawService = function (_NodeService) {
    _inherits(DrawService, _NodeService);

    function DrawService($filter, StudentDataService, UtilService) {
        _classCallCheck(this, DrawService);

        var _this = _possibleConstructorReturn(this, (DrawService.__proto__ || Object.getPrototypeOf(DrawService)).call(this));

        _this.$filter = $filter;
        _this.StudentDataService = StudentDataService;
        _this.UtilService = UtilService;

        _this.$translate = _this.$filter('translate');
        return _this;
    }

    /**
     * Create a Draw component object
     * @returns a new Draw component object
     */


    _createClass(DrawService, [{
        key: 'createComponent',
        value: function createComponent() {
            var component = {};
            component.id = this.UtilService.generateKey();
            component.type = 'Draw';
            component.prompt = this.$translate('ENTER_PROMPT_HERE');
            component.showSaveButton = false;
            component.showSubmitButton = false;
            component.stamps = {};
            component.stamps.Stamps = [];
            component.tools = {};
            component.tools.select = true;
            component.tools.line = true;
            component.tools.shape = true;
            component.tools.freeHand = true;
            component.tools.text = true;
            component.tools.stamp = true;
            component.tools.strokeColor = true;
            component.tools.fillColor = true;
            component.tools.clone = true;
            component.tools.strokeWidth = true;
            component.tools.sendBack = true;
            component.tools.sendForward = true;
            component.tools.undo = true;
            component.tools.redo = true;
            component.tools.delete = true;
            return component;
        }

        /**
         * Copies an existing Draw component object
         * @returns a copied Draw component object
         */

    }, {
        key: 'copyComponent',
        value: function copyComponent(componentToCopy) {
            var component = this.createComponent();
            component.prompt = componentToCopy.prompt;
            component.showSaveButton = componentToCopy.showSaveButton;
            component.showSubmitButton = componentToCopy.showSubmitButton;
            component.stamps = componentToCopy.stamps;
            component.stamps.Stamps = componentToCopy.stamps.Stamps;
            return component;
        }
    }, {
        key: 'getStudentWorkJPEG',
        value: function getStudentWorkJPEG(componentState) {
            if (componentState != null) {
                var studentData = componentState.studentData;

                if (studentData != null && studentData.drawData != null) {
                    var drawData = JSON.parse(studentData.drawData);
                    if (drawData != null && drawData.jpeg != null && drawData.jpeg != "") {
                        return drawData.jpeg;
                    }
                }
            }
            return null;
        }
    }, {
        key: 'populateComponentState',


        /**
         * Populate a component state with the data from another component state
         * @param componentStateFromOtherComponent the component state to obtain the data from
         * @return a new component state that contains the student data from the other
         * component state
         */
        value: function populateComponentState(componentStateFromOtherComponent) {
            var componentState = null;

            if (componentStateFromOtherComponent != null) {

                // create an empty component state
                componentState = this.StudentDataService.createComponentState();

                // get the component type of the other component state
                var otherComponentType = componentStateFromOtherComponent.componentType;

                if (otherComponentType === 'Draw') {
                    // the other component is an Draw component

                    // get the student data from the other component state
                    var studentData = componentStateFromOtherComponent.studentData;

                    // create a copy of the student data
                    var studentDataCopy = this.UtilService.makeCopyOfJSONObject(studentData);

                    // set the student data into the new component state
                    componentState.studentData = studentDataCopy;
                }
            }

            return componentState;
        }
    }, {
        key: 'isCompleted',


        /**
         * Check if the component was completed
         * @param component the component object
         * @param componentStates the component states for the specific component
         * @param componentEvents the events for the specific component
         * @param nodeEvents the events for the parent node of the component
         * @param node parent node of the component
         * @returns whether the component was completed
         */
        value: function isCompleted(component, componentStates, componentEvents, nodeEvents, node) {
            var result = false;

            if (componentStates && componentStates.length) {
                var submitRequired = node.showSubmitButton || component.showSubmitButton && !node.showSaveButton;

                if (submitRequired) {
                    // completion requires a submission, so check for isSubmit in any component states
                    for (var i = 0, l = componentStates.length; i < l; i++) {
                        var state = componentStates[i];
                        if (state.isSubmit && state.studentData) {
                            // component state is a submission
                            if (state.studentData.drawData) {
                                // there is draw data so the component is completed
                                // TODO: check for empty drawing or drawing same as initial state
                                result = true;
                                break;
                            }
                        }
                    }
                } else {
                    // get the last component state
                    var _l = componentStates.length - 1;
                    var componentState = componentStates[_l];

                    var studentData = componentState.studentData;

                    if (studentData) {
                        if (studentData.drawData) {
                            // there is draw data so the component is completed
                            // TODO: check for empty drawing or drawing same as initial state
                            result = true;
                        }
                    }
                }
            }

            return result;
        }
    }, {
        key: 'removeBackgroundFromComponentState',


        /**
         * Remove the background object from the draw data in the component state
         * @param componentState the component state
         * @returns the componentState
         */
        value: function removeBackgroundFromComponentState(componentState) {

            if (componentState != null) {
                var studentData = componentState.studentData;

                if (studentData != null) {

                    // get the draw data string
                    var drawData = studentData.drawData;

                    if (drawData != null) {

                        // convert the draw data string to an object
                        var drawDataObject = angular.fromJson(drawData);

                        if (drawDataObject != null) {

                            // get the canvas value
                            var canvas = drawDataObject.canvas;

                            if (canvas != null) {

                                // remove the background image from the canvas
                                delete canvas.backgroundImage;

                                // convert the object back to a JSON string
                                var drawDataJSONString = angular.toJson(drawDataObject);

                                if (drawDataJSONString != null) {
                                    // set the draw data JSON string back into the student data
                                    studentData.drawData = drawDataJSONString;
                                }
                            }
                        }
                    }
                }
            };

            return componentState;
        }

        /**
         * Whether this component generates student work
         * @param component (optional) the component object. if the component object
         * is not provided, we will use the default value of whether the
         * component type usually has work.
         * @return whether this component generates student work
         */

    }, {
        key: 'componentHasWork',
        value: function componentHasWork(component) {
            return true;
        }

        /**
         * Whether this component uses a save button
         * @return whether this component uses a save button
         */

    }, {
        key: 'componentUsesSaveButton',
        value: function componentUsesSaveButton() {
            return true;
        }

        /**
         * Whether this component uses a submit button
         * @return whether this component uses a submit button
         */

    }, {
        key: 'componentUsesSubmitButton',
        value: function componentUsesSubmitButton() {
            return true;
        }
    }]);

    return DrawService;
}(_nodeService2.default);

DrawService.$inject = ['$filter', 'StudentDataService', 'UtilService'];

exports.default = DrawService;
//# sourceMappingURL=drawService.js.map