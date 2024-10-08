'use strict';

// E2E test for Open Response component in preview mode
describe('WISE5 Multiple Choice Component', function () {

    var hasClass = function hasClass(element, cls) {
        return element.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };

    var saveButton = element(by.xpath('//button[@translate="save"]'));
    var saveMessage = element(by.xpath('//span[@ng-show="nodeController.saveMessage.text"]'));
    var submitButton = element(by.xpath('//button[@translate="SUBMIT"]'));
    var submitMessage = element(by.xpath('//span[@ng-show="multipleChoiceController.saveMessage.text"]'));
    var radioGroup = element(by.model('multipleChoiceController.studentChoices'));
    var spongeBobChoice = element(by.xpath('//md-radio-button[@aria-label="Spongebob"]'));
    var patrickChoice = element(by.xpath('//md-radio-button[@aria-label="Patrick"]'));
    var squidwardChoice = element(by.xpath('//md-radio-button[@aria-label="Squidward"]'));

    it('should load the vle and go to node5', function () {
        browser.get('http://localhost:8080/wise/project/demo#/vle/node5');
        var nodeDropDownMenu = element(by.model("stepToolsCtrl.toNodeId"));
        browser.wait(nodeDropDownMenu.isPresent(), 5000); // give it at most 5 seconds to load.
        expect(browser.getTitle()).toEqual('WISE');
        expect(nodeDropDownMenu.getText()).toBe('1.5: Multiple Choice Step Single Answer');

        // check that the elements are on the page
        var nodeContent = element(by.cssContainingText('.node-content', 'Who lives in a pineapple under the sea?'));
        expect(nodeContent.isPresent()).toBeTruthy();
        expect(radioGroup.isPresent()).toBeTruthy();
        expect(spongeBobChoice.isPresent()).toBeTruthy();
        expect(spongeBobChoice.getAttribute('aria-checked')).toBe("false");
        expect(patrickChoice.isPresent()).toBeTruthy();
        expect(patrickChoice.getAttribute('aria-checked')).toBe("false");
        expect(squidwardChoice.isPresent()).toBeTruthy();
        expect(squidwardChoice.getAttribute('aria-checked')).toBe("false");

        // save and submit buttons should be displayed but disabled
        expect(saveButton.isPresent()).toBeTruthy();
        expect(hasClass(saveButton, "disabled"));
        expect(submitButton.isPresent()).toBeTruthy();
        expect(hasClass(submitButton, "disabled"));
        expect(saveMessage.getText()).toBe(""); // there should be nothing in the save message
    });

    it('should allow students to choose a choice and save', function () {
        spongeBobChoice.click();
        expect(spongeBobChoice.getAttribute('aria-checked')).toBe("true");
        expect(patrickChoice.getAttribute('aria-checked')).toBe("false");
        expect(squidwardChoice.getAttribute('aria-checked')).toBe("false");

        // save and submit buttons should now be enabled
        expect(!hasClass(saveButton, "disabled"));
        expect(!hasClass(submitButton, "disabled"));

        // click on save button
        saveButton.click();
        expect(saveMessage.getText()).toContain("Saved"); // save message should show the last saved time

        // save buttons should be displayed but disabled, but the submit button should still be enabled.
        expect(hasClass(saveButton, "disabled"));
        expect(!hasClass(submitButton, "disabled"));

        // choose another choice
        patrickChoice.click();
        expect(spongeBobChoice.getAttribute('aria-checked')).toBe("false");
        expect(patrickChoice.getAttribute('aria-checked')).toBe("true");
        expect(squidwardChoice.getAttribute('aria-checked')).toBe("false");

        // save and submit buttons should now be enabled
        expect(!hasClass(saveButton, "disabled"));
        expect(!hasClass(submitButton, "disabled"));

        // click on submit button
        submitButton.click();
        expect(submitMessage.getText()).toContain("Submitted"); // save message should show the last submitted time

        // save buttons and submit buttons should both be disabled.
        expect(!hasClass(saveButton, "disabled"));
        expect(!hasClass(submitButton, "disabled"));

        // you should be able to choose another choice
        squidwardChoice.click();
        expect(spongeBobChoice.getAttribute('aria-checked')).toBe("false");
        expect(patrickChoice.getAttribute('aria-checked')).toBe("false");
        expect(squidwardChoice.getAttribute('aria-checked')).toBe("true");
    });

    var nextButton = element(by.xpath('//button[@aria-label="Next Item"]'));
    var leonardoChoice = element(by.xpath('//md-checkbox[@aria-label="Leonardo"]'));
    var donatelloChoice = element(by.xpath('//md-checkbox[@aria-label="Donatello"]'));
    var michelangeloChoice = element(by.xpath('//md-checkbox[@aria-label="Michelangelo"]'));
    var raphaelChoice = element(by.xpath('//md-checkbox[@aria-label="Raphael"]'));
    var squirtleChoice = element(by.xpath('//md-checkbox[@aria-label="Squirtle"]'));

    it('should show multiple choice multiple answer component on node6', function () {
        nextButton.click();
        var nodeDropDownMenu = element(by.model("stepToolsCtrl.toNodeId"));
        browser.wait(nodeDropDownMenu.isPresent(), 5000); // give it at most 5 seconds to load.
        expect(browser.getTitle()).toEqual('WISE');
        expect(nodeDropDownMenu.getText()).toBe('1.6: Multiple Choice Step Multiple Answer');

        // check that the elements are on the page
        var nodeContent = element(by.cssContainingText('.node-content', 'Which of these are Ninja Turtles?'));
        expect(nodeContent.isPresent()).toBeTruthy();
        expect(leonardoChoice.isPresent()).toBeTruthy();
        expect(leonardoChoice.getAttribute('aria-checked')).toBe("false");
        expect(donatelloChoice.isPresent()).toBeTruthy();
        expect(donatelloChoice.getAttribute('aria-checked')).toBe("false");
        expect(michelangeloChoice.isPresent()).toBeTruthy();
        expect(michelangeloChoice.getAttribute('aria-checked')).toBe("false");
        expect(raphaelChoice.isPresent()).toBeTruthy();
        expect(raphaelChoice.getAttribute('aria-checked')).toBe("false");
        expect(squirtleChoice.isPresent()).toBeTruthy();
        expect(squirtleChoice.getAttribute('aria-checked')).toBe("false");

        // save and submit buttons should be displayed but disabled
        expect(saveButton.isPresent()).toBeTruthy();
        expect(hasClass(saveButton, "disabled"));
        expect(submitButton.isPresent()).toBeTruthy();
        expect(hasClass(submitButton, "disabled"));
        expect(saveMessage.getText()).toBe(""); // there should be nothing in the save message
    });

    it('should allow students to choose several choices and save', function () {
        leonardoChoice.click();
        expect(leonardoChoice.getAttribute('aria-checked')).toBe("true");
        expect(donatelloChoice.getAttribute('aria-checked')).toBe("false");
        expect(michelangeloChoice.getAttribute('aria-checked')).toBe("false");
        expect(raphaelChoice.getAttribute('aria-checked')).toBe("false");
        expect(squirtleChoice.getAttribute('aria-checked')).toBe("false");

        // save and submit buttons should now be enabled
        expect(!hasClass(saveButton, "disabled"));
        expect(!hasClass(submitButton, "disabled"));

        // click on save button
        saveButton.click();
        expect(saveMessage.getText()).toContain("Saved"); // save message should show the last saved time

        // save buttons should be displayed but disabled, but the submit button should still be enabled.
        expect(hasClass(saveButton, "disabled"));
        expect(!hasClass(submitButton, "disabled"));

        // choose another choice
        squirtleChoice.click();
        expect(leonardoChoice.getAttribute('aria-checked')).toBe("true");
        expect(donatelloChoice.getAttribute('aria-checked')).toBe("false");
        expect(michelangeloChoice.getAttribute('aria-checked')).toBe("false");
        expect(raphaelChoice.getAttribute('aria-checked')).toBe("false");
        expect(squirtleChoice.getAttribute('aria-checked')).toBe("true");

        // save and submit buttons should now be enabled
        expect(!hasClass(saveButton, "disabled"));
        expect(!hasClass(submitButton, "disabled"));

        // click on submit button
        submitButton.click();
        expect(submitMessage.getText()).toContain("Submitted"); // save message should show the last submitted time

        // save buttons and submit buttons should both be disabled.
        expect(!hasClass(saveButton, "disabled"));
        expect(!hasClass(submitButton, "disabled"));

        // you should be able to choose another choice
        michelangeloChoice.click();
        expect(leonardoChoice.getAttribute('aria-checked')).toBe("true");
        expect(donatelloChoice.getAttribute('aria-checked')).toBe("false");
        expect(michelangeloChoice.getAttribute('aria-checked')).toBe("true");
        expect(raphaelChoice.getAttribute('aria-checked')).toBe("false");
        expect(squirtleChoice.getAttribute('aria-checked')).toBe("true");
    });

    var previousButton = element(by.xpath('//button[@aria-label="Previous Item"]'));

    it('should show previously-chosen multiple choice answer', function () {
        // go back to the previous mc single choice step
        previousButton.click();
        var nodeDropDownMenu = element(by.model("stepToolsCtrl.toNodeId"));
        browser.wait(nodeDropDownMenu.isPresent(), 5000); // give it at most 5 seconds to load.
        expect(browser.getTitle()).toEqual('WISE');
        expect(nodeDropDownMenu.getText()).toBe('1.5: Multiple Choice Step Single Answer');

        // check that choices have persisted
        expect(spongeBobChoice.getAttribute('aria-checked')).toBe("false");
        expect(patrickChoice.getAttribute('aria-checked')).toBe("false");
        expect(squidwardChoice.getAttribute('aria-checked')).toBe("true");

        // go back to the previous mc multiple choice step
        nextButton.click();
        browser.wait(nodeDropDownMenu.isPresent(), 5000); // give it at most 5 seconds to load.
        expect(browser.getTitle()).toEqual('WISE');
        expect(nodeDropDownMenu.getText()).toBe('1.6: Multiple Choice Step Multiple Answer');

        // check that choices have persisted
        expect(leonardoChoice.getAttribute('aria-checked')).toBe("true");
        expect(donatelloChoice.getAttribute('aria-checked')).toBe("false");
        expect(michelangeloChoice.getAttribute('aria-checked')).toBe("true");
        expect(raphaelChoice.getAttribute('aria-checked')).toBe("false");
        expect(squirtleChoice.getAttribute('aria-checked')).toBe("true");
    });
});
//# sourceMappingURL=multipleChoice.spec.js.map