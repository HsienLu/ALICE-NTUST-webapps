<%@ include file="../include.jsp"%>

<!DOCTYPE html>
<html dir="${textDirection}">
<head>
<META http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="chrome=1"/>
<%@ include file="../favicon.jsp"%>
<title><spring:message code="pages.wise-advantage.theWISEAdvantage" /></title>

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

	<div id="page">

		<div id="pageContent">
			<div class="contentPanel" style="margin-top:1rem;">

				<div class="panelHeader">
				<spring:message code="pages.wise-advantage.top10ReasonsForUsingWISE" />

				</div>

				<div class="panelContent">
					<div class="featuresShowcase right">
						<img src="${contextPath}/<spring:theme code="library"/>" alt="<spring:message code="pages.wise-advantage.inquiryLearningAlt" />" />
						<div class="featureContentHeader"><spring:message code="pages.wise-advantage.1inquiryBasedLearning" /></div>
						<div class="featureContent">
							<p><spring:message code="pages.wise-advantage.inquiryLearningParagraphPart1" /> 
						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="featuresShowcase left">
						<img src="${contextPath}/<spring:theme code="standards_science"/>" alt="<spring:message code="pages.wise-advantage.wiseLibraryAlt" />" />
						<div class="featureContent">
							<div class="featureContentHeader"><spring:message code="pages.wise-advantage.2growingLibrary" /></div>
							<p><spring:message code="pages.wise-advantage.growingLibraryParagraphPart1" /></p>
						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="featuresShowcase right">
						<img src="${contextPath}/<spring:theme code="teacher_tools"/>" alt="<spring:message code="pages.wise-advantage.standardsBasedScienceAlt" />" />
						<div class="featureContentHeader"><spring:message code="pages.wise-advantage.3standardsBasedScience" /></div>
						<div class="featureContent">
							<p><spring:message code="pages.wise-advantage.standardsBasedScienceParagraph" /></p>
						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="featuresShowcase left">
						<img style="width:400px;height:auto" src="${contextPath}/<spring:theme code="learning-tool-interface"/>" alt="<spring:message code="pages.wise-advantage.teacherToolsAlt" />" />
						<div class="featureContent">
							<div class="featureContentHeader"><spring:message code="pages.wise-advantage.4comprehensiveInstructionalSupport" /></div>
							<p><spring:message code="pages.wise-advantage.comprehensiveInstructionalSupportParagraphPart1" /></p>
						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="featuresShowcase right">
						<img src="${contextPath}/<spring:theme code="diverse_learners"/>" alt="<spring:message code="pages.wise-advantage.researchAndPracticeAlt" />" />
						<div class="featureContentHeader"><spring:message code="pages.wise-advantage.5basedOnResearch" /></div>
						<div class="featureContent">
							<p><spring:message code="pages.wise-advantage.basedOnResearchParagraphPart1" /></p>
						</div>
						<div style="clear:both;"></div>
					</div>
						<div style="clear:both;"></div>
					</div>							
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
