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

    // process metadata
    this.metadata = this.ProjectService.getProjectMetadata();
    this.metadataAuthoring = this.ConfigService.getConfigParam("projectMetadataSettings");
    this.processMetadataAuthoring();
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
    // 額外加的 by HsienLu
  }, {
    key: "createOpenTag",
    value: function createOpenTag(projectId) {
      /* get the value entered by the user */
      var projectId = this.ConfigService.config.projectId;
      var val = "library";
      function clearTagMessage() {
        $('.tagMessage').html('');
      }
      ;
      function tagMessage(msg, projectId) {
        $('#createTagMsgDiv_' + projectId).html(msg);
        setTimeout(function () {
          clearTagMessage();
        }, 8000);
      }
      ;
      function tagPostFailure() {
        tagMessage('Error contacting server, unable to fulfill request.', this.projectId);
      }
      ;
      function createTagSuccess(data, textStatus, request) {
        /* if the request is not successful, notify user with given status if
         * not 200 and with server error message if it is in the response */
        if (request.status != 200) {
          tagMessage(textStatus, this.projectId);
          return;
        }
        if (data.indexOf('The server has encountered an error.') != -1) {
          tagMessage('The server has encountered an error while attempting to create the tag.', this.projectId);
          return;
        }

        /* check to see if this is a duplicate and notify user */
        if (data == 'duplicate') {
          tagMessage('A tag with that name already exists for this project, aborting operation', this.projectId);
          return;
        }

        /* check to see if the user was authorized to create that tag and notify user */
        if (data == 'not-authorized') {
          tagMessage('You are not authorized to create a tag with that name, aborting operation', this.projectId);
          return;
        }

        /* get the value entered by the user */
        var val = $('#createTagInput_' + this.projectId).val();
        var id = data;

        /* add this to the existing tags list */
        $('#existingTagsDiv_' + this.projectId).append('<table id="tagTable_' + this.projectId + '_' + id + '"><tbody><tr><td><input id="tagEdit_' + this.projectId + '_' + id + '" type="text" value="' + val + '" onchange="tagChanged($(this).attr(\'id\'))"/></td><td><input id="removeTag_' + this.projectId + '_' + id + '" type="button" value="remove" onclick="removeTag($(this).attr(\'id\'))"/></td></tr></tbody></table>');

        /* add the newly created tag to the tag name map */
        tagNameMap[id] = val;

        /* clear the tags input so user can create another */
        $('#createTagInput_' + this.projectId).val('');

        /* notify user that request was successful */
        tagMessage('The tag <span class="tag">' + val + '</span> was successfully added to the project!', this.projectId);
      }
      ;

      /* make a request to the server to add a tag */
      console.log('command=createTag&projectId=' + projectId + '&tag=' + val);
      $.ajax({
        type: 'POST',
        url: 'http://140.118.164.6/admin/project/tagger.html',
        dataType: 'text',
        data: 'command=createTag&projectId=' + projectId + '&tag=' + val,
        error: tagPostFailure,
        success: alert('課程已經公開'),
        context: {
          projectId: projectId
        }
      });
    }
  }]);
}();
ProjectInfoController.$inject = ['$filter', '$mdDialog', '$rootScope', '$state', '$stateParams', '$scope', '$timeout', 'ConfigService', 'ProjectService', 'UtilService'];
var _default = exports["default"] = ProjectInfoController;
