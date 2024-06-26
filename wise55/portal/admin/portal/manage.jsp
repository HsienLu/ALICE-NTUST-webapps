<%@ include file="../../include.jsp"%>

<!DOCTYPE html>
<html dir="${textDirection}">
<head>
	<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<script type="text/javascript" src="${contextPath}/<spring:theme code="jquerysource" />"></script>
	<link rel="shortcut icon" href="${contextPath}/<spring:theme code="favicon"/>" />

	<script type="text/javascript">
        $(document).ready(function() {
            var portalId = $("#portalId").html();
            // pretty-print the JSON settings
            $("#projectMetadataSettings").val(JSON.stringify(JSON.parse($("#projectMetadataSettings").val()), null, 4));
            $("#defaultSurveyTemplate").val(JSON.stringify(JSON.parse($("#defaultSurveyTemplate").val()), null, 4));

            $("select").bind("change",
                function() {
                    var attrVal = this.id;
                    $(this).find(":selected").each(function() {
                        $.ajax(
                            {
                                type:'POST',
                                url:'manage',
                                data:'attr='+attrVal+'&portalId=' + portalId + '&val=' + $(this).val(),
                                error:function(){alert('Error: please talk to wise administrator, which might be you. If this is the case, please talk to yourself.');},
                                success:function(){}
                            });
                    });
                });
            $("#revertToDefaultProjectMetadataSettings").on("click", function() {
                if (confirm("You will lose any changes to your project metadata settings. Continue?")) {
                    var defaultProjectMetadataSettings = ${defaultProjectMetadataSettings};
                    $("#projectMetadataSettings").val(JSON.stringify(defaultProjectMetadataSettings, null, 4));
				}
			});
            $("#saveProjectMetadataSettingsButton").on("click", function() {
                var projectMetadataSettingsStr = $("#projectMetadataSettings").val();
                // un-pretty-print before we save
                try {
                    projectMetadataSettingsStr = JSON.stringify(JSON.parse(projectMetadataSettingsStr));
                    $.ajax(
                        {
                            type: 'POST',
                            url: 'manage',
                            data: 'attr=projectMetadataSettings&portalId=' + portalId + '&val=' + projectMetadataSettingsStr,
                            error: function () {
                                alert('Error: please talk to wise administrator, which might be you. If this is the case, please talk to yourself.');
                            },
                            success: function () {
                                alert('Save Successful!');
                            }
                        });
                } catch (exception) {
                    alert("Error saving project metadata settings. Make sure that the JSON is valid and try again.");
                }
            });
            $("#revertToDefaultSurveyTemplate").on("click", function() {
                if (confirm("You will lose any changes to your survey template. Continue?")) {
                    var defaultSurveyTemplate = {"save_time":null,"items":[{"id":"recommendProjectToOtherTeachers","type":"radio","prompt":"How likely would you recommend this project to other teachers?","choices":[{"id":"5","text":"Extremely likely"},{"id":"4","text":"Very likely"},{"id":"3","text":"Moderately likely"},{"id":"2","text":"Slightly likely"},{"id":"1","text":"Not at all likely"}],"answer":null},{"id":"runProjectAgain","type":"radio","prompt":"How likely would you run this project again?","choices":[{"id":"5","text":"Extremely likely"},{"id":"4","text":"Very likely"},{"id":"3","text":"Moderately likely"},{"id":"2","text":"Slightly likely"},{"id":"1","text":"Not at all likely"}],"answer":null},{"id":"useWISEAgain","type":"radio","prompt":"How likely would you use WISE again in your classroom?","choices":[{"id":"5","text":"Extremely likely"},{"id":"4","text":"Very likely"},{"id":"3","text":"Moderately likely"},{"id":"2","text":"Slightly likely"},{"id":"1","text":"Not at all likely"}],"answer":null},{"id":"adviceForOtherTeachers","type":"textarea","prompt":"Please share any advice for other teachers about this project or about WISE in general.","answer":null},{"id":"technicalProblems","type":"textarea","prompt":"Please write about any technical problems that you had while running this project.","answer":null},{"id":"generalFeedback","type":"textarea","prompt":"Please provide any other feedback to WISE staff.","answer":null}]};
                    $("#defaultSurveyTemplate").val(JSON.stringify(defaultSurveyTemplate, null, 4));
				}
            });
            $("#saveSurveyTemplateButton").on("click", function() {
                var defaultSurveyTemplateStr = $("#defaultSurveyTemplate").val();
                // un-pretty-print before we save
				try {
                    defaultSurveyTemplateStr = JSON.stringify(JSON.parse(defaultSurveyTemplateStr));
                    $.ajax(
                        {
                            type: 'POST',
                            url: 'manage',
                            data: 'attr=runSurveyTemplate&portalId=' + portalId + '&val=' + defaultSurveyTemplateStr,
                            error: function () {
                                alert('Error: please talk to wise administrator, which might be you. If this is the case, please talk to yourself.');
                            },
                            success: function () {
                                alert('Save Successful!');
                            }
                        });
                } catch (exception) {
				    alert("Error saving survey template. Make sure that the JSON is valid and try again.");
				}
            });
        });
	</script>
</head>
<body>
<span id="portalId" style="display:none">${portal.id}</span>
<h5 style="color:#0000CC;"><a href="${contextPath}/admin"><spring:message code="returnToMainAdminPage" /></a></h5>
<br/>
name: ${portal.portalName} | address: ${portal.address} | send_email_on_exception: ${portal.sendMailOnException}
<br/>
Is Login Allowed:
<select id="isLoginAllowed">
	<c:choose>
		<c:when test="${portal.loginAllowed}">
			<option value="true" selected="selected">YES</option>
			<option value="false">NO</option>
		</c:when>
		<c:otherwise>
			<option value="true">YES</option>
			<option value="false" selected="selected">NO</option>
		</c:otherwise>
	</c:choose>
</select>

<br/>
Send WISE statistics to WISE5.org (for research purpose only, no personal data will be sent. Please consider enabling this as it will help improve WISE!)
<select id="isSendStatisticsToHub">
	<c:choose>
		<c:when test="${portal.sendStatisticsToHub}">
			<option value="true" selected="selected">YES</option>
			<option value="false">NO</option>
		</c:when>
		<c:otherwise>
			<option value="true">YES</option>
			<option value="false" selected="selected">NO</option>
		</c:otherwise>
	</c:choose>
</select>
<br/><br/>
Project Metadata Settings (must be a valid JSON object) | <button id="revertToDefaultProjectMetadataSettings">Revert to Default</button><br/>
<textarea id="projectMetadataSettings" rows="20" cols="100">${portal.projectMetadataSettings}</textarea><br/>
<input id="saveProjectMetadataSettingsButton" type="button" value="Save" />
<br/><br/>
Run Survey Template (must be a valid JSON object) | <button id="revertToDefaultSurveyTemplate">Revert to Default</button><br/>
<textarea id="defaultSurveyTemplate" rows="20" cols="100">${portal.runSurveyTemplate}</textarea><br/>
<input id="saveSurveyTemplateButton" type="button" value="Save" />
<br/><br/>
<h5 style="color:#0000CC;"><a href="${contextPath}/admin"><spring:message code="returnToMainAdminPage" /></a></h5>
</body>
</html>