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

var AudioOscillatorService = function (_NodeService) {
    _inherits(AudioOscillatorService, _NodeService);

    function AudioOscillatorService($filter, StudentDataService, UtilService) {
        _classCallCheck(this, AudioOscillatorService);

        var _this = _possibleConstructorReturn(this, (AudioOscillatorService.__proto__ || Object.getPrototypeOf(AudioOscillatorService)).call(this));

        _this.$filter = $filter;
        _this.StudentDataService = StudentDataService;
        _this.UtilService = UtilService;
        _this.$translate = _this.$filter('translate');
        return _this;
    }

    /**
     * Create a AudioOscillator component object
     * @returns a new AudioOscillator component object
     */


    _createClass(AudioOscillatorService, [{
        key: 'createComponent',
        value: function createComponent() {

            var component = {};
            component.id = this.UtilService.generateKey();
            component.type = 'AudioOscillator';
            component.prompt = this.$translate('ENTER_PROMPT_HERE');
            component.oscillatorTypes = ['sine'];
            component.startingFrequency = 440;
            component.oscilloscopeWidth = 800;
            component.oscilloscopeHeight = 400;
            component.gridCellSize = 50;
            component.stopAfterGoodDraw = true;
            component.showSaveButton = false;
            component.showSubmitButton = false;
            component.starterSentence = null;
            component.isStudentAttachmentEnabled = false;

            return component;
        }

        /**
         * Populate a component state with the data from another component state
         * @param componentStateFromOtherComponent the component state to obtain the data from
         * @return a new component state that contains the student data from the other
         * component state
         */

    }, {
        key: 'populateComponentState',
        value: function populateComponentState(componentStateFromOtherComponent) {
            var componentState = null;

            if (componentStateFromOtherComponent != null) {

                // create an empty component state
                componentState = this.StudentDataService.createComponentState();

                // get the component type of the other component state
                var otherComponentType = componentStateFromOtherComponent.componentType;

                if (otherComponentType === 'AudioOscillator') {
                    // the other component is an OpenResponse component

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
                            if (state.studentData.frequenciesPlayed != null && studentData.frequenciesPlayed.length > 0) {
                                // the student has played at least one frequency so the component is completed
                                result = true;
                                break;
                            }
                        }
                    }
                } else {
                    // get the last component state
                    var _l = componentStates.length - 1;
                    var componentState = componentStates[_l];

                    var _studentData = componentState.studentData;

                    if (_studentData != null) {
                        if (_studentData.frequenciesPlayed != null && _studentData.frequenciesPlayed.length > 0) {
                            // the student has played at least one frequency so the component is completed
                            result = true;
                        }
                    }
                }
            }

            return result;
        }
    }, {
        key: 'componentHasWork',


        /**
         * Whether this component generates student work
         * @param component (optional) the component object. if the component object
         * is not provided, we will use the default value of whether the
         * component type usually has work.
         * @return whether this component generates student work
         */
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

    return AudioOscillatorService;
}(_nodeService2.default);

AudioOscillatorService.$inject = ['$filter', 'StudentDataService', 'UtilService'];

exports.default = AudioOscillatorService;
//# sourceMappingURL=audioOscillatorService.js.map