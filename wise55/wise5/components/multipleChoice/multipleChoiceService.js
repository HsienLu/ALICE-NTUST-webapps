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

var MultipleChoiceService = function (_NodeService) {
    _inherits(MultipleChoiceService, _NodeService);

    function MultipleChoiceService($filter, StudentDataService, UtilService) {
        _classCallCheck(this, MultipleChoiceService);

        var _this = _possibleConstructorReturn(this, (MultipleChoiceService.__proto__ || Object.getPrototypeOf(MultipleChoiceService)).call(this));

        _this.$filter = $filter;
        _this.StudentDataService = StudentDataService;
        _this.UtilService = UtilService;
        _this.$translate = _this.$filter('translate');
        return _this;
    }

    /**
     * Create a MultipleChoice component object
     * @returns a new MultipleChoice component object
     */


    _createClass(MultipleChoiceService, [{
        key: 'createComponent',
        value: function createComponent() {
            var component = {};
            component.id = this.UtilService.generateKey();
            component.type = 'MultipleChoice';
            component.prompt = this.$translate('ENTER_PROMPT_HERE');
            component.showSaveButton = false;
            component.showSubmitButton = false;
            component.choiceType = 'radio';
            component.choices = [];
            component.showFeedback = true;
            return component;
        }

        /**
         * Copies an existing MultipleChoice component object
         * @returns a copied MultipleChoice component object
         */

    }, {
        key: 'copyComponent',
        value: function copyComponent(componentToCopy) {
            var component = this.createComponent();
            component.prompt = componentToCopy.prompt;
            component.showSaveButton = componentToCopy.showSaveButton;
            component.showSubmitButton = componentToCopy.showSubmitButton;
            component.choiceType = componentToCopy.choiceType;
            component.choices = [];
            // go through the original choices and create new id's
            if (componentToCopy.choices != null && componentToCopy.choices.length > 0) {
                for (var c = 0; c < componentToCopy.choices.length; c++) {
                    var choice = componentToCopy.choices[c];
                    choice.id = this.UtilService.generateKey(); // generate a new id for this choice.
                    component.choices.push(choice);
                }
            }
            return component;
        }

        /**
         * Returns all possible criteria for this component.
         * @param component a MultipleChoice component
         */

    }, {
        key: 'getPossibleTransitionCriteria',
        value: function getPossibleTransitionCriteria(nodeId, componentId, component) {
            var allPossibleTransitionCriteria = [];
            if (component.choiceType === "radio") {
                // Go through all the choices
                for (var c = 0; c < component.choices.length; c++) {
                    var choice = component.choices[c];
                    var possibleTransitionCriteria = {
                        "name": "choiceChosen",
                        "id": "choiceChosen_" + choice.id,
                        "params": {
                            "nodeId": nodeId,
                            "componentId": componentId,
                            "choiceIds": [choice.id]
                        },
                        "userFriendlyDescription": this.$translate('multipleChoice.userChose', { choiceText: choice.text, choiceId: choice.id })
                    };
                    allPossibleTransitionCriteria.push(possibleTransitionCriteria);
                }
            } else if (component.choiceType === "checkbox") {
                // TODO: implement meeee!
            }
            return allPossibleTransitionCriteria;
        }

        /**
         * Check if the student chose a specific choice
         * @param criteria the criteria object
         * @returns a boolean value whether the student chose the choice specified in the
         * criteria object
         */

    }, {
        key: 'choiceChosen',
        value: function choiceChosen(criteria) {

            var result = false;

            if (criteria != null && criteria.params != null) {
                var nodeId = criteria.params.nodeId;
                var componentId = criteria.params.componentId;
                var choiceIds = criteria.params.choiceIds; // the choice ids that we expect the student to have chosen

                if (nodeId != null && componentId != null) {

                    // get the component states
                    var componentStates = this.StudentDataService.getComponentStatesByNodeIdAndComponentId(nodeId, componentId);

                    if (componentStates != null && componentStates.length > 0) {

                        if (choiceIds != null) {
                            // get the latest component state
                            var componentState = componentStates[componentStates.length - 1];

                            // get the student data
                            var studentData = componentState.studentData;

                            if (studentData != null) {

                                // get the choice(s) the student chose
                                var studentChoices = studentData.studentChoices;

                                if (studentChoices != null) {

                                    if (studentChoices.length === choiceIds.length) {
                                        /*
                                         * the number of choices the student chose do match so the student may
                                         * have matched the choices. we will now need to compare each of the
                                         * choice ids to make sure the student chose the ones that are required
                                         */

                                        var studentChoiceIds = this.getStudentChoiceIdsFromStudentChoiceObjects(studentChoices);

                                        for (var c = 0; c < choiceIds.length; c++) {
                                            var choiceId = choiceIds[c];

                                            if (studentChoiceIds.indexOf(choiceId) === -1) {
                                                /*
                                                 * the required choice id is not in the student choices so the student
                                                 * did not match all the choices
                                                 */
                                                result = false;
                                                break;
                                            } else {
                                                // the required choice id is in the student choices
                                                result = true;
                                            }
                                        }
                                    } else {
                                        /*
                                         * the number of choices the student chose do not match so the student did
                                         * not match the choices
                                         */

                                        result = false;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return result;
        }
    }, {
        key: 'getStudentChoiceIdsFromStudentChoiceObjects',


        /**
         * Get the student choice ids from the student choice objects
         * @param studentChoices an array of student choice objects. these objects contain
         * an id and text fields
         * @returns an array of choice id strings
         */
        value: function getStudentChoiceIdsFromStudentChoiceObjects(studentChoices) {
            var choiceIds = [];

            if (studentChoices != null) {

                // loop through all the student choice objects
                for (var c = 0; c < studentChoices.length; c++) {

                    // get a student choice object
                    var studentChoice = studentChoices[c];

                    if (studentChoice != null) {

                        // get the student choice id
                        var studentChoiceId = studentChoice.id;

                        choiceIds.push(studentChoiceId);
                    }
                }
            }

            return choiceIds;
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

                if (otherComponentType === 'MultipleChoice') {
                    // the other component is an MultipleChoice component

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

                // loop through all the component states
                for (var c = 0, l = componentStates.length; c < l; c++) {

                    // the component state
                    var componentState = componentStates[c];

                    // get the student data from the component state
                    var studentData = componentState.studentData;

                    if (studentData != null) {
                        var studentChoices = studentData.studentChoices;

                        if (studentChoices != null) {
                            // there is a student choice so the component has saved work
                            if (submitRequired) {
                                // completion requires a submission, so check for isSubmit
                                if (componentState.isSubmit) {
                                    result = true;
                                    break;
                                }
                            } else {
                                result = true;
                                break;
                            }
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
         * Get the human readable student data string
         * @param componentState the component state
         * @return a human readable student data string
         */

    }, {
        key: 'getStudentDataString',
        value: function getStudentDataString(componentState) {

            var studentDataString = "";

            if (componentState != null) {
                var studentData = componentState.studentData;

                if (studentData != null) {

                    // get the choices the student chose
                    var studentChoices = studentData.studentChoices;

                    if (studentChoices != null) {

                        // loop through all the choices the student chose
                        for (var c = 0; c < studentChoices.length; c++) {
                            var studentChoice = studentChoices[c];

                            if (studentChoice != null) {

                                // get the choice text
                                var text = studentChoice.text;

                                if (text != null) {
                                    if (studentDataString != "") {
                                        // separate the choices with a comma
                                        studentDataString += ", ";
                                    }

                                    // append the choice text
                                    studentDataString += text;
                                }
                            }
                        }
                    }
                }
            }

            return studentDataString;
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

    return MultipleChoiceService;
}(_nodeService2.default);

MultipleChoiceService.$inject = ['$filter', 'StudentDataService', 'UtilService'];

exports.default = MultipleChoiceService;
//# sourceMappingURL=multipleChoiceService.js.map