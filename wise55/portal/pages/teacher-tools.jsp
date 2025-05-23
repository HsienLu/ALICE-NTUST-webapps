<%@ include file="../include.jsp"%>

<!DOCTYPE html>
<html dir="${textDirection}">
<head>
<META http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="chrome=1"/>
<%@ include file="../favicon.jsp"%>
<title><spring:message code="pages.teacher-tools.wiseLearningEnvironment" /></title>

<link href="${contextPath}/<spring:theme code="globalstyles"/>" rel="stylesheet" type="text/css" />
<link href="${contextPath}/<spring:theme code="homepagestylesheet"/>" rel="stylesheet" type="text/css" />
<link href="${contextPath}/<spring:theme code="superfishstylesheet"/>" rel="stylesheet" type="text/css" >
<c:if test="${textDirection == 'rtl' }">
    <link href="${contextPath}/<spring:theme code="rtlstylesheet"/>" rel="stylesheet" type="text/css" >
</c:if>

<script src="${contextPath}/<spring:theme code="jquerysource"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="superfishsource"/>" type="text/javascript"></script>

</head>
<body>
<div id="pageWrapper">

	<%@ include file="../headermain.jsp"%>

	<div id="page" style="margin-top:2rem;">

		<div id="pageContent">
			<div class="contentPanel">

				<div class="panelHeader">
					<spring:message code="pages.teacher-tools.teachingWithWISE" />
				</div>

				<div class="panelContent">
					<div class="featuresShowcase right">

						<div class="featureContent">
							<div class="featureContentHeader"><spring:message code="pages.teacher-tools.wiseTeacherTools" /></div>
							<p><spring:message code="pages.teacher-tools.wiseTeacherToolsParagraph1" /></p>
							
						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="featureContentHeader"><spring:message code="pages.teacher-tools.highlightedFeatures" /></div>
					<div class="featuresShowcase left">
						<img src="${contextPath}/<spring:theme code="teacher_manage"/>" alt="<spring:message code="pages.teacher-tools.managementAlt" />" />
						<div class="featureContent">
							<p class="featureHeader"><spring:message code="pages.teacher-tools.managingPacingEngagingStudents" /></p>
							<ul>
								<p><span style="font-weight:bold;"><spring:message code="pages.teacher-tools.progressMonitor" /></span> <spring:message code="pages.teacher-tools.progressMonitorText" /></p>
								<p><span style="font-weight:bold;"><spring:message code="pages.teacher-tools.stepCompletionDisplay" /></span> <spring:message code="pages.teacher-tools.stepCompletionDisplayText" /></p>
								<p><span style="font-weight:bold;"><spring:message code="pages.teacher-tools.pauseScreens" /></span> <spring:message code="pages.teacher-tools.pauseScreensText" /></p>
							</ul>
						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="featuresShowcase right">
						<img src="${contextPath}/<spring:theme code="teacher_grading"/>" alt="<spring:message code="pages.teacher-tools.gradingAndFeedbackAlt" />" />
						<div class="featureContent">
							<p class="featureHeader"><spring:message code="pages.teacher-tools.gradingAndFeedback" /></p>
							<ul>
								<p><span style="font-weight:bold;"><spring:message code="pages.teacher-tools.gradeStudentWorkProvideFeedback" /></span> <spring:message code="pages.teacher-tools.gradeStudentWorkProvideFeedbackText" /></p>
								<p><span style="font-weight:bold;"><spring:message code="pages.teacher-tools.preMadeComments" /></span> <spring:message code="pages.teacher-tools.preMadeCommentsText" /></p>
								<p><span style="font-weight:bold;"><spring:message code="pages.teacher-tools.autoscoringAssessments" /></span> <spring:message code="pages.teacher-tools.autoscoringAssessmentsText" /></p>
							</ul>
						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="featuresShowcase left">
						<img src="${contextPath}/<spring:theme code="teacher_customization"/>" alt="<spring:message code="pages.teacher-tools.customizationAlt" />" />
						<div class="featureContent">
							<p class="featureHeader"><spring:message code="pages.teacher-tools.customizingCurricula" /></p>
							<ul>
								<p><span style="font-weight:bold;"><spring:message code="pages.teacher-tools.wiseAuthoringTool" /></span> <spring:message code="pages.teacher-tools.wiseAuthoringToolText" /></p>
								<p><span style="font-weight:bold;"><spring:message code="pages.teacher-tools.sharingProjects" /></span> <spring:message code="pages.teacher-tools.sharingProjectsText" /></p>
							</ul>
						</div>
						<div style="clear:both;"></div>
					</div>

				</div>
			</div>

		</div>
		<div style="clear: both;"></div>
	</div>   <!-- End of page -->

	<%@ include file="../footer.jsp"%>
</div>
</body>
</html>
