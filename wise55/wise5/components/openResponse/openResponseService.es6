import NodeService from '../../services/nodeService';

class OpenResponseService extends NodeService {
    constructor($filter,
                StudentDataService,
                UtilService) {
        super();
        this.$filter = $filter;
        this.StudentDataService = StudentDataService;
        this.UtilService = UtilService;

        this.$translate = this.$filter('translate');
    }

    /**
     * Create a OpenResponse component object
     * @returns a new OpenResponse component object
     */
    createComponent() {
        var component = {};
        component.id = this.UtilService.generateKey();
        component.type = 'OpenResponse';
        component.prompt = this.$translate('ENTER_PROMPT_HERE');
        component.showSaveButton = false;
        component.showSubmitButton = false;
        component.starterSentence = null;
        component.isStudentAttachmentEnabled = false;
        return component;
    }

    /**
     * Copies a OpenResponse component object
     * @returns a copied OpenResponse component object
     */
    copyComponent(componentToCopy) {
        var component = this.createComponent();
        component.prompt = componentToCopy.prompt;
        component.showSaveButton = componentToCopy.showSaveButton;
        component.showSubmitButton = componentToCopy.showSubmitButton;
        component.starterSentence = componentToCopy.starterSentence;
        component.isStudentAttachmentEnabled = componentToCopy.isStudentAttachmentEnabled;
        return component;
    }
    /**
     * Populate a component state with the data from another component state
     * @param componentStateFromOtherComponent the component state to obtain the data from
     * @return a new component state that contains the student data from the other
     * component state
     */
    populateComponentState(componentStateFromOtherComponent) {
        var componentState = null;

        if (componentStateFromOtherComponent != null) {

            // create an empty component state
            componentState = this.StudentDataService.createComponentState();

            // get the component type of the other component state
            var otherComponentType = componentStateFromOtherComponent.componentType;

            if (otherComponentType === 'OpenResponse') {
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
    };

    /**
     * Check if the component was completed
     * @param component the component object
     * @param componentStates the component states for the specific component
     * @param componentEvents the events for the specific component
     * @param nodeEvents the events for the parent node of the component
     * @param node parent node of the component
     * @returns whether the component was completed
     */
    isCompleted(component, componentStates, componentEvents, nodeEvents, node) {
        let result = false;

        if (componentStates && componentStates.length) {
            let submitRequired = node.showSubmitButton || (component.showSubmitButton && !node.showSaveButton);

            if (submitRequired) {
                // completion requires a submission, so check for isSubmit in any component states
                for (let i = 0, l = componentStates.length; i < l; i++) {
                    let state = componentStates[i];
                    if (state.isSubmit && state.studentData) {
                        // component state is a submission
                        if (state.studentData.response) {
                            // there is a response so the component is completed
                            result = true;
                            break;
                        }
                    }
                }
            } else {
                // get the last component state
                let l = componentStates.length - 1;
                let componentState = componentStates[l];

                let studentData = componentState.studentData;

                if (studentData != null) {
                    if (studentData.response) {
                        // there is a response so the component is completed
                        result = true;
                    }
                }
            }
        }

        if (component.completionCriteria != null) {
            /*
             * there is a special completion criteria authored in this component
             * so we will evaluate the completion criteria to see if the student
             * has completed this component
             */
            result = this.StudentDataService.isCompletionCriteriaSatisfied(component.completionCriteria);
        }

        return result;
    };

    /**
     * Check if we need to display the annotation to the student
     * @param componentContent the component content
     * @param annotation the annotation
     * @returns whether we need to display the annotation to the student
     */
    displayAnnotation(componentContent, annotation) {

        var result = true;

        if (componentContent != null && annotation != null) {

            if (annotation.type == 'score') {

            } else if (annotation.type == 'comment') {

            } else if (annotation.type == 'autoScore') {
                // this is an auto graded score annotation

                if (componentContent.cRater != null && !componentContent.cRater.showScore) {
                    // we do not want to show the CRater score
                    result = false;
                } else if (componentContent.showAutoScore === false) {
                    // do not show the auto score to the student
                    result = false;
                }
            } else if (annotation.type == 'autoComment') {
                // this is an auto graded comment annotation

                if (componentContent.cRater != null && !componentContent.cRater.showFeedback) {
                    // we do not want to show the CRater comment
                    result = false;
                } else if (componentContent.showAutoFeedback === false) {
                    // do not show the auto comment to the student
                    result = false;
                }
            }

            if (annotation.displayToStudent === false) {
                // do not display the annotation to the studentr
                result = false;
            }
        }

        return result;
    }

    /**
     * Whether this component generates student work
     * @param component (optional) the component object. if the component object
     * is not provided, we will use the default value of whether the
     * component type usually has work.
     * @return whether this component generates student work
     */
    componentHasWork(component) {
        return true;
    }

    /**
     * Get the human readable student data string
     * @param componentState the component state
     * @return a human readable student data string
     */
    getStudentDataString(componentState) {

        var studentDataString = "";

        if (componentState != null) {
            var studentData = componentState.studentData;

            if (studentData != null) {
                // get the response the student typed
                studentDataString = studentData.response;
            }
        }

        return studentDataString;
    }

    /**
     * Whether this component uses a save button
     * @return whether this component uses a save button
     */
    componentUsesSaveButton() {
        return true;
    }

    /**
     * Whether this component uses a submit button
     * @return whether this component uses a submit button
     */
    componentUsesSubmitButton() {
        return true;
    }
}

OpenResponseService.$inject = [
    '$filter',
    'StudentDataService',
    'UtilService'
];

export default OpenResponseService;
