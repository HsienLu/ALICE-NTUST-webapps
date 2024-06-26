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

var TableService = function (_NodeService) {
    _inherits(TableService, _NodeService);

    function TableService($filter, StudentDataService, UtilService) {
        _classCallCheck(this, TableService);

        var _this = _possibleConstructorReturn(this, (TableService.__proto__ || Object.getPrototypeOf(TableService)).call(this));

        _this.$filter = $filter;
        _this.StudentDataService = StudentDataService;
        _this.UtilService = UtilService;
        _this.$translate = _this.$filter('translate');
        return _this;
    }

    /**
     * Create an Table component object
     * @returns a new Table component object
     */


    _createClass(TableService, [{
        key: 'createComponent',
        value: function createComponent() {
            var component = {};
            component.id = this.UtilService.generateKey();
            component.type = 'Table';
            component.prompt = this.$translate('ENTER_PROMPT_HERE');
            component.showSaveButton = false;
            component.showSubmitButton = false;
            component.globalCellSize = 10;
            component.numRows = 3;
            component.numColumns = 3;
            component.tableData = [[{
                "text": "",
                "editable": true,
                "size": null
            }, {
                "text": "",
                "editable": true,
                "size": null
            }, {
                "text": "",
                "editable": true,
                "size": null
            }], [{
                "text": "",
                "editable": true,
                "size": null
            }, {
                "text": "",
                "editable": true,
                "size": null
            }, {
                "text": "",
                "editable": true,
                "size": null
            }], [{
                "text": "",
                "editable": true,
                "size": null
            }, {
                "text": "",
                "editable": true,
                "size": null
            }, {
                "text": "",
                "editable": true,
                "size": null
            }]];

            return component;
        }

        /**
         * Copies an existing Table component object
         * @returns a copied Table component object
         */

    }, {
        key: 'copyComponent',
        value: function copyComponent(componentToCopy) {
            var component = this.createComponent();
            component.prompt = componentToCopy.prompt;
            component.showSaveButton = componentToCopy.showSaveButton;
            component.showSubmitButton = componentToCopy.showSubmitButton;
            component.globalCellSize = componentToCopy.globalCellSize;
            component.numRows = componentToCopy.numRows;
            component.numColumns = componentToCopy.numColumns;
            component.tableData = componentToCopy.tableData;
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

                if (otherComponentType === 'Table') {
                    // the other component is an Table component

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
                        var tableData = studentData.tableData;

                        if (tableData != null) {
                            // there is a table data so the component has saved work
                            // TODO: check for actual student data from the table (compare to starting state)
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

    return TableService;
}(_nodeService2.default);

TableService.$inject = ['$filter', 'StudentDataService', 'UtilService'];

exports.default = TableService;
//# sourceMappingURL=tableService.js.map