'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ProjectInfoController = /*#__PURE__*/function () {
  function ProjectInfoController($filter, $mdDialog, $rootScope, $state, $stateParams, $scope, $timeout, ConfigService, ProjectService, UtilService) {
    _classCallCheck(this, ProjectInfoController);
    this.$filter = $filter;
    this.$mdDialog = $mdDialog;
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.ConfigService = ConfigService;
    this.ProjectService = ProjectService;
    this.UtilService = UtilService;
    this.$translate = this.$filter('translate');
    this.message = '確認中'; //新加的
    this.timer = null; //新加的         
    this.envPath = 'http://140.118.164.6:3000'; //新家的
    // process metadata
    this.metadata = this.ProjectService.getProjectMetadata();
    this.metadataAuthoring = this.ConfigService.getConfigParam("projectMetadataSettings");
    this.processMetadataAuthoring();
    this.getWorkgroupPublicState();
  }
  return _createClass(ProjectInfoController, [{
    key: "processMetadataAuthoring",
    value: function processMetadataAuthoring() {
      var metadataAuthoring = this.metadataAuthoring;
      if (metadataAuthoring != null) {
        var fields = metadataAuthoring.fields;
        for (var f = 0; f < fields.length; f++) {
          var field = fields[f];
          if (field != null) {
            var metadataField = this.metadata[field.key];
            if (field.type == 'checkbox') {
              field.choicesMapping = {};
              if (metadataField != null) {
                var choices = field.choices;
                if (choices != null) {
                  for (var c = 0; c < choices.length; c++) {
                    var choice = choices[c];
                    if (choice != null) {
                      // check if user has checked this metadata field
                      var userCheckedThisMetadataField = false;
                      for (var metadataFieldChoiceIndex = 0; metadataFieldChoiceIndex < metadataField.length; metadataFieldChoiceIndex++) {
                        var metadataFieldChoice = metadataField[metadataFieldChoiceIndex];
                        if (metadataFieldChoice != null && metadataFieldChoice == choice) {
                          userCheckedThisMetadataField = true;
                          break;
                        }
                      }
                      if (userCheckedThisMetadataField) {
                        field.choicesMapping[choice] = true;
                      } else {
                        field.choicesMapping[choice] = false;
                      }
                    }
                  }
                }
              }
            } else if (field.type == 'radio') {}
          }
        }
      }
    }
  }, {
    key: "getMetadataChoiceText",
    value:
    // returns the choice text that is appropriate for user's locale
    function getMetadataChoiceText(choice) {
      var choiceText = choice;

      // see if there is choice text in this user's locale
      var userLocale = this.ConfigService.getLocale(); // user's locale
      var i18nMapping = this.metadataAuthoring.i18n; // texts in other languages
      var i18nMappingContainingChoiceTextArray = Object.values(i18nMapping).filter(function (onei18nMapping) {
        return Object.values(onei18nMapping).indexOf(choice) != -1;
      });
      if (i18nMappingContainingChoiceTextArray != null && i18nMappingContainingChoiceTextArray.length > 0) {
        var i18nMappingContainingChoiceText = i18nMappingContainingChoiceTextArray[0]; // shouldn't be more than one, but if so, use the first one we find
        if (i18nMappingContainingChoiceText[userLocale] != null) {
          choiceText = i18nMappingContainingChoiceText[userLocale];
        }
      }
      return choiceText;
    }
  }, {
    key: "metadataChoiceIsChecked",
    value: function metadataChoiceIsChecked(metadataField, choice) {
      return this.getMetadataChoiceText(this.metadata[metadataField.key]) == this.getMetadataChoiceText(choice);
    }
  }, {
    key: "metadataCheckboxClicked",
    value: function metadataCheckboxClicked(metadataField, choice) {
      var checkedChoices = [];
      var choices = metadataField.choices;
      for (var c = 0; c < choices.length; c++) {
        var _choice = choices[c];
        var checked = metadataField.choicesMapping[_choice];
        if (checked) {
          checkedChoices.push(this.getMetadataChoiceText(_choice));
        }
      }
      this.metadata[metadataField.key] = checkedChoices;
      this.save();
    }
  }, {
    key: "metadataRadioClicked",
    value: function metadataRadioClicked(metadataField, choice) {
      this.metadata[metadataField.key] = this.getMetadataChoiceText(choice);
      this.save();
    }
  }, {
    key: "save",
    value: function save() {
      this.ProjectService.saveProject(); // save the project
    }
  }, {
    key: "getWorkgroupPublicState",
    value: function getWorkgroupPublicState() {
      var _this = this;
      var projectId = this.ConfigService.config.projectId;
      return new Promise(function (resolve, reject) {
        fetch(_this.envPath + '/getOneWorkgroupTag', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "project_fk": projectId
          })
        }).then(function (response) {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        }).then(function (data) {
          _this.message = data.isPublic === 1 ? "公開" : "不公開";
          resolve(_this.message);
        })["catch"](function (error) {
          console.error('There has been a problem with your fetch operation:', error);
          reject(error);
        });
      });
    }
  }, {
    key: "changeWorkgroupPublicState",
    value: function changeWorkgroupPublicState() {
      var _this2 = this;
      var projectId = this.ConfigService.config.projectId;
      clearTimeout(this.timer);
      this.timer = setTimeout(function () {
        if (_this2.message === "不公開") {
          $.ajax({
            type: 'POST',
            url: _this2.envPath + '/addLibraryTag',
            data: JSON.stringify({
              "project_fk": projectId
            }),
            contentType: 'application/json',
            success: function success(data) {
              console.log(data);
              this.message = "公開";
            },
            error: function error(err) {
              console.log(err);
            }
          });
          _this2.message = "公開";
        } else {
          $.ajax({
            type: 'DELETE',
            url: _this2.envPath + '/deleteLibraryTag',
            data: JSON.stringify({
              "project_fk": projectId
            }),
            contentType: 'application/json',
            success: function success(data) {
              console.log(data);
              this.message = "不公開";
            },
            error: function error(data) {
              console.log(data);
            }
          });
          _this2.message = "不公開";
        }
        // this.message = this.message === "公開" ? "不公開" : "公開";

        console.log(_this2.message);
      }, 100); // 300毫秒的延遲時間
    }
  }]);
}();
ProjectInfoController.$inject = ['$filter', '$mdDialog', '$rootScope', '$state', '$stateParams', '$scope', '$timeout', 'ConfigService', 'ProjectService', 'UtilService'];
var _default = exports["default"] = ProjectInfoController;
