'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NotebookItemReportController = function () {
    function NotebookItemReportController($injector, $mdBottomSheet, $rootScope, $scope, $filter, ConfigService, NotebookService, ProjectService, StudentAssetService, StudentDataService) {
        var _this = this;

        _classCallCheck(this, NotebookItemReportController);

        this.$injector = $injector;
        this.$mdBottomSheet = $mdBottomSheet;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$filter = $filter;
        this.ConfigService = ConfigService;
        this.NotebookService = NotebookService;
        this.ProjectService = ProjectService;
        this.StudentAssetService = StudentAssetService;
        this.StudentDataService = StudentDataService;

        this.$translate = this.$filter('translate');
        this.mode = this.ConfigService.getMode();

        this.dirty = false;

        this.autoSaveInterval = 60000; // the auto save interval in milliseconds

        this.saveMessage = {
            text: '',
            time: ''
        };

        this.reportItem = this.NotebookService.getLatestNotebookReportItemByReportId(this.reportId, this.workgroupId);
        if (this.reportItem) {
            var serverSaveTime = this.reportItem.serverSaveTime;
            var clientSaveTime = this.ConfigService.convertToClientTimestamp(serverSaveTime);
            this.setSaveMessage(this.$translate('LAST_SAVED'), clientSaveTime);
        } else {
            // Student doesn't have work for this report yet, so we'll use the template.
            this.reportItem = this.NotebookService.getTemplateReportItemByReportId(this.reportId);
            if (this.reportItem == null) {
                // if there is no template, don't allow student to work on the report.
                return;
            }
        }

        this.notebookConfig = this.NotebookService.getNotebookConfig();
        this.label = this.notebookConfig.itemTypes.report.label;

        // replace relative asset paths with absolute asset paths
        this.reportItemContent = this.ProjectService.injectAssetPaths(this.reportItem.content.content);

        // summernote editor options
        this.summernoteOptions = {
            toolbar: [['edit', ['undo', 'redo']], ['style', ['bold', 'italic', 'underline' /*, 'superscript', 'subscript', 'strikethrough', 'clear'*/]],
            //['style', ['style']],
            //['fontface', ['fontname']],
            //['textsize', ['fontsize']],
            //['fontclr', ['color']],
            ['para', ['ul', 'ol', 'paragraph' /*, 'lineheight'*/]],
            //['height', ['height']],
            //['table', ['table']],
            //['insert', ['link','picture','video','hr']],
            //['view', ['fullscreen', 'codeview']],
            //['help', ['help']]
            ['customButton', ['customButton']]
            //['print', ['print']]
            ],
            popover: {
                image: [['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                //['float', ['floatLeft', 'floatRight', 'floatNone']],
                ['remove', ['removeMedia']]]
            },
            customButton: {
                buttonText: 'Add ' + this.notebookConfig.label + ' Item +',
                tooltip: 'Insert from ' + this.notebookConfig.label,
                buttonClass: 'accent-1 notebook-item--report__add-note',
                action: function action($event) {
                    _this.addNotebookItemContent($event);
                }
            },
            disableDragAndDrop: true,
            toolbarContainer: '#' + this.reportId + '-toolbar',
            callbacks: {
                onBlur: function onBlur() {
                    $(this).summernote('saveRange');
                }
            }
        };

        this.$scope.$watch(function () {
            return _this.reportItem.content.content;
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                _this.dirty = true;
            }
        });

        this.$scope.$on('toggleNotebook', function () {
            if (_this.dirty) {
                _this.saveNotebookReportItem();
            }
        });

        // start the auto save interval
        if (this.mode != "classroomMonitor") {
            this.startAutoSaveInterval();
        }
    }

    _createClass(NotebookItemReportController, [{
        key: 'getItemNodeId',
        value: function getItemNodeId() {
            if (this.item == null) {
                return null;
            } else {
                return this.item.nodeId;
            }
        }

        /**
         * Returns this NotebookItem's position and title.
         */

    }, {
        key: 'getItemNodePositionAndTitle',
        value: function getItemNodePositionAndTitle() {
            if (this.item == null) {
                return "";
            } else {
                return this.ProjectService.getNodePositionAndTitleByNodeId(this.item.nodeId);
            }
        }
    }, {
        key: 'getTemplateUrl',
        value: function getTemplateUrl() {
            return this.templateUrl;
        }
    }, {
        key: 'addNotebookItemContent',
        value: function addNotebookItemContent(ev) {
            var notebookItems = this.NotebookService.getNotebookByWorkgroup(this.workgroupId).items;
            var templateUrl = this.themePath + '/notebook/notebookItemChooser.html';
            var reportTextareaCursorPosition = angular.element('textarea.report').prop("selectionStart"); // insert the notebook item at the cursor position later
            var $reportElement = $('#' + this.reportId);

            this.$mdBottomSheet.show({
                parent: angular.element(document.body),
                templateUrl: templateUrl,
                locals: {
                    notebookItems: notebookItems,
                    reportItem: this.reportItem,
                    reportTextareaCursorPosition: reportTextareaCursorPosition,
                    themePath: this.themePath,
                    notebookConfig: this.notebookConfig
                },
                controller: NotebookItemChooserController,
                controllerAs: 'notebookItemChooserController',
                bindToController: true
            });

            function NotebookItemChooserController($mdBottomSheet, $scope, notebookItems, reportItem, reportTextareaCursorPosition, themePath) {
                $scope.notebookItems = notebookItems;
                $scope.reportItem = reportItem;
                $scope.reportTextareaCursorPosition = reportTextareaCursorPosition;
                $scope.themePath = themePath;
                $scope.chooseNotebookItem = function (notebookItem) {
                    var $item = $('<div></div>').css('text-align', 'center');
                    if (notebookItem.content && notebookItem.content.attachments) {
                        for (var a = 0; a < notebookItem.content.attachments.length; a++) {
                            var notebookItemAttachment = notebookItem.content.attachments[a];
                            var $img = $('<img src="' + notebookItemAttachment.iconURL + '" alt="notebook image" style="width: 75%; max-width: 100%; height: auto; border: 1px solid #aaaaaa; padding: 8px; margin-bottom: 4px;" />');
                            $img.addClass('notebook-item--report__note-img');
                            $item.append($img);
                        }
                    }
                    if (notebookItem.content && notebookItem.content.text) {
                        var $caption = $('<div><b>' + notebookItem.content.text + '</b></div>').css({ 'text-align': 'center' });
                        $item.append($caption);
                    }

                    $reportElement.summernote('focus');
                    $reportElement.summernote('restoreRange');
                    $reportElement.summernote('insertNode', $item[0]);

                    // hide chooser
                    $mdBottomSheet.hide();
                };
            }

            NotebookItemChooserController.$inject = ["$mdBottomSheet", "$scope", "notebookItems", "reportItem", "reportTextareaCursorPosition", "themePath"];
        }

        /**
         * Start the auto save interval for this report
         */

    }, {
        key: 'startAutoSaveInterval',
        value: function startAutoSaveInterval() {
            var _this2 = this;

            this.stopAutoSaveInterval(); // stop any existing interval
            this.autoSaveIntervalId = setInterval(function () {
                // check if the student work is dirty
                if (_this2.dirty) {
                    // the student work is dirty so we will save.
                    // obtain the component states from the children and save them to the server
                    _this2.saveNotebookReportItem();
                }
            }, this.autoSaveInterval);
        }
    }, {
        key: 'stopAutoSaveInterval',


        /**
         * Stop the auto save interval for this report
         */
        value: function stopAutoSaveInterval() {
            clearInterval(this.autoSaveIntervalId);
        }
    }, {
        key: 'saveNotebookReportItem',


        /**
         * Save the notebook report item to server
         */
        value: function saveNotebookReportItem() {
            var _this3 = this;

            // save new report notebook item
            this.reportItem.content.clientSaveTime = Date.parse(new Date()); // set save timestamp
            this.reportItem.id = null; // set the id to null so it can be inserted as initial version, as opposed to updated. this is true for both new and just-loaded reports.

            this.NotebookService.saveNotebookItem(this.reportItem.id, this.reportItem.nodeId, this.reportItem.localNotebookItemId, this.reportItem.type, this.reportItem.title, this.reportItem.content, this.reportItem.content.clientSaveTime).then(function (result) {
                if (result) {
                    _this3.dirty = false;
                    _this3.reportItem.id = result.id; // set the reportNotebookItemId to the newly-incremented id so that future saves during this visit will be an update instead of an insert.
                    var serverSaveTime = result.serverSaveTime;
                    var clientSaveTime = _this3.ConfigService.convertToClientTimestamp(serverSaveTime);

                    // set save message
                    _this3.setSaveMessage(_this3.$translate('SAVED'), clientSaveTime);
                }
            });
        }

        /**
         * Account for potential vertical scrollbar on Notebook content and set
         * fixed rich text toolbar location accordingly
         */

    }, {
        key: 'setEditorPosition',
        value: function setEditorPosition(distance, elem, edge) {
            var scrollBarWidth = document.body.clientWidth - angular.element(document.querySelector('#notebook')).outerWidth(true);
            elem.find('.notebook-item--report__toolbar').css('right', scrollBarWidth);
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

        /**
         * The report item content changed
         */

    }, {
        key: 'reportItemContentChanged',
        value: function reportItemContentChanged() {
            /*
             * remove the absolute asset paths
             * e.g.
             * <img src='https://wise.berkeley.edu/curriculum/3/assets/sun.png'/>
             * will be changed to
             * <img src='sun.png'/>
             */
            this.reportItem.content.content = this.ConfigService.removeAbsoluteAssetPaths(this.reportItemContent);
        }

        /**
         * Print the selected report
         */

    }, {
        key: 'print',
        value: function print() {
            // get the report content
            var content = this.reportItem.content.content;

            // create the window string
            var windowString = "<html>" + "<head>" + "<link rel='stylesheet' href='../wise5/lib/bootstrap/css/bootstrap.min.css'>" + "<link rel='stylesheet' href='../wise5/themes/default/style/monitor.css'>" + "<link rel='stylesheet' href='../wise5/themes/default/style/angular-material.css'>" + "<link rel='stylesheet' href='../wise5/lib/summernote/dist/summernote.css'>" + "<script>window.addEventListener('load', function() { window.print(); window.close(); });</script>" + "</html>" + "<body style='background-color: #ffffff;'>" + "<div class='md-padding'>" + content + "</div>" + "</body>" + "</html>";

            // open a new window
            var w = window.open('', '');

            // write the report content to the new window and close
            w.document.write(windowString);
            w.document.close();
        }
    }]);

    return NotebookItemReportController;
}();

NotebookItemReportController.$inject = ["$injector", '$mdBottomSheet', "$rootScope", "$scope", "$filter", "ConfigService", "NotebookService", "ProjectService", "StudentAssetService", "StudentDataService"];

exports.default = NotebookItemReportController;
//# sourceMappingURL=notebookItemReportController.js.map