'use strict';

class ProjectInfoController {

    constructor($filter,
                $mdDialog,
                $rootScope,
                $state,
                $stateParams,
                $scope,
                $timeout,
                ConfigService,
                ProjectService,
                UtilService) {

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
        this.message = '確認中';           
        // process metadata
        this.metadata = this.ProjectService.getProjectMetadata();
        this.metadataAuthoring = this.ConfigService.getConfigParam("projectMetadataSettings");
        this.processMetadataAuthoring();

    };

    processMetadataAuthoring() {

        let metadataAuthoring = this.metadataAuthoring;

        if (metadataAuthoring != null) {

            let fields = metadataAuthoring.fields;

            for (let f = 0; f < fields.length; f++) {
                let field = fields[f];

                if (field != null) {
                    let metadataField = this.metadata[field.key];

                    if (field.type == 'checkbox') {
                        field.choicesMapping = {};
                        if (metadataField != null) {
                            let choices = field.choices;

                            if (choices != null) {
                                for (let c = 0; c < choices.length; c++) {
                                    let choice = choices[c];

                                    if (choice != null) {
                                        // check if user has checked this metadata field
                                        let userCheckedThisMetadataField = false;
                                        for (let metadataFieldChoiceIndex = 0; metadataFieldChoiceIndex < metadataField.length; metadataFieldChoiceIndex++) {
                                            let metadataFieldChoice = metadataField[metadataFieldChoiceIndex];
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
                    } else if (field.type == 'radio') {

                    }
                }
            }
        }
    };


    // returns the choice text that is appropriate for user's locale
    getMetadataChoiceText(choice) {
        let choiceText = choice;

        // see if there is choice text in this user's locale
        let userLocale = this.ConfigService.getLocale();  // user's locale
        let i18nMapping = this.metadataAuthoring.i18n; // texts in other languages
        let i18nMappingContainingChoiceTextArray = Object.values(i18nMapping).filter(function (onei18nMapping) {
            return Object.values(onei18nMapping).indexOf(choice) != -1;
        });
        if (i18nMappingContainingChoiceTextArray != null && i18nMappingContainingChoiceTextArray.length > 0) {
            let i18nMappingContainingChoiceText = i18nMappingContainingChoiceTextArray[0]; // shouldn't be more than one, but if so, use the first one we find
            if (i18nMappingContainingChoiceText[userLocale] != null) {
                choiceText = i18nMappingContainingChoiceText[userLocale];
            }
        }
        return choiceText;
    };

    metadataChoiceIsChecked(metadataField, choice) {
        return this.getMetadataChoiceText(this.metadata[metadataField.key]) == this.getMetadataChoiceText(choice);
    };

    metadataCheckboxClicked(metadataField, choice) {

        let checkedChoices = [];

        let choices = metadataField.choices;
        for (let c = 0; c < choices.length; c++) {
            let choice = choices[c];

            let checked = metadataField.choicesMapping[choice];

            if (checked) {
                checkedChoices.push(this.getMetadataChoiceText(choice));
            }
        }

        this.metadata[metadataField.key] = checkedChoices;

        this.save();
    };

    metadataRadioClicked(metadataField, choice) {
        this.metadata[metadataField.key] = this.getMetadataChoiceText(choice);

        this.save();
    };

    save() {
        this.ProjectService.saveProject(); // save the project
    }
    // 額外加的 by HsienLu
    createOpenTag(projectId) {
        /* get the value entered by the user */
        var projectId= this.ConfigService.config.projectId
        var val = "library";
        function clearTagMessage(){
            $('.tagMessage').html('');
        };
        function tagMessage(msg, projectId){
            $('#createTagMsgDiv_' + projectId).html(msg);
            setTimeout(function(){clearTagMessage();},8000);
        };
        function tagPostFailure(){
            tagMessage('Error contacting server, unable to fulfill request.', this.projectId);
        };
        function createTagSuccess(data, textStatus, request){
            /* if the request is not successful, notify user with given status if
             * not 200 and with server error message if it is in the response */
            if(request.status != 200){
                tagMessage(textStatus, this.projectId);
                return;
            }
            
            if(data.indexOf('The server has encountered an error.') != -1){
                tagMessage('The server has encountered an error while attempting to create the tag.', this.projectId);
                return;
            }
            
            /* check to see if this is a duplicate and notify user */
            if(data==('duplicate')){
                tagMessage('A tag with that name already exists for this project, aborting operation', this.projectId);
                return;
            }
            
            /* check to see if the user was authorized to create that tag and notify user */
            if(data==('not-authorized')){
                tagMessage('You are not authorized to create a tag with that name, aborting operation', this.projectId);
                return;
            }
            
            /* get the value entered by the user */
            var val = $('#createTagInput_' + this.projectId).val();
            var id = data;
            
            /* add this to the existing tags list */
            $('#existingTagsDiv_' + this.projectId).append('<table id="tagTable_' + this.projectId + '_' + id + '"><tbody><tr><td><input id="tagEdit_' + 
                    this.projectId + '_' + id + '" type="text" value="' + val + '" onchange="tagChanged($(this).attr(\'id\'))"/></td><td><input id="removeTag_' + this.projectId + '_' + 
                    id + '" type="button" value="remove" onclick="removeTag($(this).attr(\'id\'))"/></td></tr></tbody></table>');
            
            /* add the newly created tag to the tag name map */
            tagNameMap[id] = val;
            
            /* clear the tags input so user can create another */
            $('#createTagInput_' + this.projectId).val('');
            
            /* notify user that request was successful */
            tagMessage('The tag <span class="tag">' + val + '</span> was successfully added to the project!', this.projectId);
        };

        /* make a request to the server to add a tag */
        console.log('command=createTag&projectId=' + projectId + '&tag=' + val)
        $.ajax({type:'POST', url:'http://140.118.164.6/admin/project/tagger.html', dataType:'text', data:'command=createTag&projectId=' + projectId + '&tag=' + val, error:tagPostFailure, success:alert('課程已經公開'), context:{projectId:projectId}});


    };
    
    callTest(){
        this.message="公開"
        console.log(this.message )
    }
}




ProjectInfoController.$inject = [
    '$filter',
    '$mdDialog',
    '$rootScope',
    '$state',
    '$stateParams',
    '$scope',
    '$timeout',
    'ConfigService',
    'ProjectService',
    'UtilService'
];

export default ProjectInfoController;
