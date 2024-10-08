"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _editNotebookItemController = require('../editNotebookItemController');

var _editNotebookItemController2 = _interopRequireDefault(_editNotebookItemController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NotebookController = function () {
    function NotebookController($filter, $mdDialog, $scope, $rootScope, ConfigService, NotebookService, ProjectService, StudentAssetService, StudentDataService) {
        var _this = this;

        _classCallCheck(this, NotebookController);

        this.$filter = $filter;
        this.$mdDialog = $mdDialog;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.ConfigService = ConfigService;
        this.NotebookService = NotebookService;
        this.ProjectService = ProjectService;
        this.StudentAssetService = StudentAssetService;
        this.StudentDataService = StudentDataService;

        this.$translate = this.$filter('translate');

        this.themePath = this.ProjectService.getThemePath();
        this.itemId = null;
        this.item = null;
        this.config = this.NotebookService.config;

        if (!this.config.enabled) {
            return;
        }

        this.workgroupId = this.ConfigService.getWorkgroupId();
        //this.reportVisible = false;
        this.reportVisible = this.config.itemTypes.report.enabled;
        this.notesVisible = false;
        this.insertMode = false;
        this.insertContent = null;

        this.$scope.$on('notebookUpdated', function (event, args) {
            _this.notebook = angular.copy(args.notebook);
        });

        // show edit note dialog on 'editNote' event
        this.$scope.$on('editNote', function (event, args) {
            var itemId = args.itemId;
            var ev = args.ev;
            _this.editNote(itemId, true, null, ev);
        });

        // show edit note dialog on 'addNewNote' event
        this.$scope.$on('addNewNote', function (event, args) {
            var ev = args.ev;
            var file = args.file;
            _this.editNote(null, true, file, ev);
        });

        // show delete note confirm dialog on 'deleteNote' event
        this.$scope.$on('deleteNote', function (event, args) {
            var itemId = args.itemId;
            var ev = args.ev;
            var doDelete = true;
            _this.deleteNote(itemId, ev, doDelete);
        });

        // show delete note confirm dialog on 'reviveNote' event
        this.$scope.$on('reviveNote', function (event, args) {
            var itemId = args.itemId;
            var ev = args.ev;
            var doDelete = false;
            _this.deleteNote(itemId, ev, doDelete);
        });

        this.logOutListener = $scope.$on('logOut', function (event, args) {
            _this.logOutListener();
            _this.$rootScope.$broadcast('componentDoneUnloading');
        });

        // get the notebook for this workgroup
        this.notebook = this.NotebookService.getNotebookByWorkgroup(this.workgroupId);
        // assume only 1 report for now
        this.reportId = this.config.itemTypes.report.notes[0].reportId;
    }

    _createClass(NotebookController, [{
        key: 'deleteStudentAsset',
        value: function deleteStudentAsset(studentAsset) {
            alert(this.$translate('deleteStudentAssetFromNotebookNotImplementedYet'));
            /*
             StudentAssetService.deleteAsset(studentAsset).then(angular.bind(this, function(deletedStudentAsset) {
             // remove studentAsset
             this.studentAssets.splice(this.studentAssets.indexOf(deletedStudentAsset), 1);
             this.calculateTotalUsage();
             }));
             */
        }
    }, {
        key: 'editNote',
        value: function editNote(itemId, isEditMode, file, ev) {
            var notebookItemTemplate = this.themePath + '/notebook/editNotebookItem.html';

            // Display a dialog where students can view/add/edit a notebook item
            this.$mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: ev,
                templateUrl: notebookItemTemplate,
                controller: _editNotebookItemController2.default,
                controllerAs: 'editNotebookItemController',
                bindToController: true,
                locals: {
                    itemId: itemId,
                    isEditMode: isEditMode,
                    file: file
                }
            });
        }

        /**
         * Delete the note specified by the itemId.
         */

    }, {
        key: 'deleteNote',
        value: function deleteNote(itemId, ev) {
            var _this2 = this;

            var doDelete = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var confirm = null;

            if (doDelete) {
                confirm = this.$mdDialog.confirm().title(this.$translate('deleteNoteConfirmMessage')).ariaLabel('delete note confirmation').targetEvent(ev).ok(this.$translate('delete')).cancel(this.$translate('cancel'));
            } else {
                confirm = this.$mdDialog.confirm().title(this.$translate('reviveNoteConfirmMessage')).ariaLabel('revive note confirmation').targetEvent(ev).ok(this.$translate('revive')).cancel(this.$translate('cancel'));
            }

            this.$mdDialog.show(confirm).then(function () {
                var noteCopy = angular.copy(_this2.NotebookService.getLatestNotebookItemByLocalNotebookItemId(itemId));
                noteCopy.id = null; // set to null so we're creating a new notebook item. An edit to a notebook item results in a new entry in the db.
                noteCopy.content.clientSaveTime = Date.parse(new Date()); // set save timestamp
                var clientDeleteTime = null; // if delete timestamp is null, then we are in effect un-deleting this note item
                if (doDelete) {
                    clientDeleteTime = Date.parse(new Date()); // set delete timestamp
                }
                _this2.NotebookService.saveNotebookItem(noteCopy.id, noteCopy.nodeId, noteCopy.localNotebookItemId, noteCopy.type, noteCopy.title, noteCopy.content, noteCopy.content.clientSaveTime, clientDeleteTime);
            }, function () {
                // they chose not to delete. Do nothing, the dialog will close.
            });
        }
    }, {
        key: 'notebookItemSelected',
        value: function notebookItemSelected($event, notebookItem) {
            this.selectedNotebookItem = notebookItem;
        }
    }, {
        key: 'attachNotebookItemToComponent',
        value: function attachNotebookItemToComponent($event, notebookItem) {
            this.componentController.attachNotebookItemToComponent(notebookItem);
            this.selectedNotebookItem = null; // reset selected notebook item
            // TODO: add some kind of unobtrusive confirmation to let student know that the notebook item has been added to current component
            $event.stopPropagation(); // prevents parent notebook list item from getting the onclick event so this item won't be re-selected.
        }
    }, {
        key: 'getNotes',
        value: function getNotes() {
            var notes = [];
            var notebookItems = this.notebook.items;
            for (var notebookItemKey in notebookItems) {
                var notebookItem = notebookItems[notebookItemKey];
                if (notebookItem.last().type === 'note') {
                    notes.push(notebookItem);
                }
            }
            return notes;
        }
    }, {
        key: 'open',
        value: function open(value, event) {
            if (value === 'report') {
                // toggle the report view
                this.reportVisible = !this.reportVisible;
            } else if (value === 'note') {
                // toggle the notes view
                if (this.notesVisible) {
                    this.closeNotes(event);
                } else {
                    this.notesVisible = true;
                }
            } else if (value === 'new') {
                // open the new note dialog
                this.NotebookService.addNewItem(event);
            }
        }
    }, {
        key: 'closeNotes',
        value: function closeNotes($event) {
            this.notesVisible = false;
            this.insertMode = false;
        }

        /*closeReport() {
            this.reportVisible = false;
        }*/

    }, {
        key: 'setInsertMode',
        value: function setInsertMode(value) {
            this.insertMode = value;
            if (value) {
                this.notesVisible = true;
            }
        }
    }, {
        key: 'insert',
        value: function insert(value, $event) {
            // user is inserting new content into the report
            this.insertContent = angular.copy(this.NotebookService.getLatestNotebookItemByLocalNotebookItemId(value, this.workgroupId));
        }
    }]);

    return NotebookController;
}();

NotebookController.$inject = ['$filter', '$mdDialog', '$scope', '$rootScope', 'ConfigService', 'NotebookService', 'ProjectService', 'StudentAssetService', 'StudentDataService'];

var Notebook = {
    bindings: {},
    template: '<div ng-if="$ctrl.config.enabled" ng-class="{\'notes-visible\': $ctrl.notesVisible}">\n            <div class="notebook-overlay"></div>\n            <notebook-launcher config="$ctrl.config"\n                               note-count="$ctrl.notebook.items.length"\n                               notes-visible="$ctrl.notesVisible"\n                               on-open="$ctrl.open(value, event)"></notebook-launcher>\n            <notebook-report ng-if="$ctrl.config.itemTypes.report.enabled"\n                             insert-content="$ctrl.insertContent"\n                             insert-mode="$ctrl.insertMode"\n                             config="$ctrl.config"\n                             reportId="$ctrl.reportId"\n                             visible="$ctrl.reportVisible"\n                             workgroup-id="$ctrl.workgroupId"\n                             on-collapse="$ctrl.insertMode=false"\n                             on-set-insert-mode="$ctrl.setInsertMode(value)"></notebook-report>\n        </div>\n        <notebook-notes ng-if="$ctrl.config.enabled"\n                        notebook="$ctrl.notebook"\n                        notes-visible="$ctrl.notesVisible"\n                        config="$ctrl.config"\n                        insert-mode="$ctrl.insertMode"\n                        workgroup-id="$ctrl.workgroupId"\n                        on-close="$ctrl.closeNotes()"\n                        on-insert="$ctrl.insert(value, event)"\n                        on-set-insert-mode="$ctrl.setInsertMode(value)"></notebook-notes>',
    controller: NotebookController
};

exports.default = Notebook;
//# sourceMappingURL=notebook.js.map