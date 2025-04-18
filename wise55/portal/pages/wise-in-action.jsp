<%@ include file="../include.jsp"%>

<!DOCTYPE html>
<html dir="${textDirection}">
<head>
<META http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="chrome=1"/>
<%@ include file="../favicon.jsp"%>
<title><spring:message code="pages.wise-in-action.wiseInAction" /></title>

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

	<div style="margin-top:1rem;" id="page">

		<div id="pageContent">
			<div class="contentPanel">

				<div class="panelHeader"><spring:message code="pages.wise-in-action.theWISEExperience" /></div>

				<div class="panelContent">
					<div class="featuresShowcase right">
						<img src="${contextPath}/<spring:theme code="teacher_profile"/>" alt="<spring:message code="pages.wise-in-action.teacherProfileAlt" />" />
						<div class="featureContentHeader"><spring:message code="pages.wise-in-action.teacherProfile" /></div>
						<div class="featureContent">
							<p><spring:message code="pages.wise-in-action.teacherProfileQuoteParagraph1" /></p>
							<p><spring:message code="pages.wise-in-action.teacherProfileQuoteParagraph2" /></p>
							<p><spring:message code="pages.wise-in-action.teacherProfileQuoteParagraph3" /></p>
							<p><spring:message code="pages.wise-in-action.teacherProfileQuoteParagraph4" /></p>
						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="featuresShowcase left">
						<img src="${contextPath}/<spring:theme code="inquiry_curricula"/>" alt="<spring:message code="pages.wise-in-action.inquiryCurriculaAlt" />" />
						<div class="featureContent">
							<div class="featureContentHeader"><spring:message code="pages.wise-in-action.inquiryCurricula" /></div>
							<p><a href="${contextPath}/projectlibrary"><spring:message code="pages.wise-in-action.wiseUnits" /></a> <spring:message code="pages.wise-in-action.inquiryCurriculaParagraph" /></p>
						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="featuresShowcase right">
						<img src="${contextPath}/<spring:theme code="teacher_role"/>" alt="<spring:message code="pages.wise-in-action.theTeachersRoleAlt" />" />
						<div class="featureContentHeader"><spring:message code="pages.wise-in-action.theTeachersRole" /></div>
						<div class="featureContent">
							<p><spring:message code="pages.wise-in-action.theTeachersRoleParagraph" /> <a href="${contextPath}/pages/teacher-tools.html"><spring:message code="pages.wise-in-action.classroomBasedAneOnlineTools" /></a> <spring:message code="pages.wise-in-action.classroomBasedAneOnlineTools.1" /></p>
						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="featuresShowcase left">
						<img src="${contextPath}/<spring:theme code="partnership_design"/>" alt="<spring:message code="pages.wise-in-action.partnershipDesignAlt" />" />
						<div class="featureContent">
							<div class="featureContentHeader" id="partnershipDesign"><spring:message code="pages.wise-in-action.partnershipDesign" /></div>
							<p><spring:message code="pages.wise-in-action.partnershipDesignParagraphPart1" /> <a href="${contextPath}/pages/research-tech.html#ki"><spring:message code="pages.wise-in-action.inquiryBasedDesignPrinciples" /></a> <spring:message code="pages.wise-in-action.partnershipDesignParagraphPart2" /></p>
						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="featuresShowcase right">
						<img src="${contextPath}/<spring:theme code="assessments"/>" alt="<spring:message code="pages.wise-in-action.standardsAlignedAssessmentsAlt" />" />
						<div class="featureContentHeader"><spring:message code="pages.wise-in-action.standardsAlignedAssessments" /></div>
						<div class="featureContent">
							<p><spring:message code="pages.wise-in-action.standardsAlignedAssessmentsParagraph" /><!-- (<a href="http://www.tandfonline.com/doi/abs/10.1080/10627190801968224" target="_blank"><spring:message code="pages.wise-in-action.liuLeeHoftstetterLinn" /></a>; <a href="http://www.sciencemag.org/content/313/5790/1049.full.pdf" target="_blank"><spring:message code="pages.wise-in-action.linnEtAl" /></a>)--></p>
						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="featuresShowcase left">
						<img src="${contextPath}/<spring:theme code="administrators"/>" alt="<spring:message code="pages.wise-in-action.administrationPartnershipsAlt" />" />
						<div class="featureContent">
							<div class="featureContentHeader"><spring:message code="pages.wise-in-action.administrationPartnerships" /></div>
							<p><spring:message code="pages.wise-in-action.administrationPartnershipsParagraph1" /></p>
							<p><spring:message code="pages.wise-in-action.administrationPartnershipsParagraph2Part1" /> <a href="${contextPath}/contact/contactwise.html"><spring:message code="pages.wise-in-action.contactUs" /></a> <spring:message code="pages.wise-in-action.administrationPartnershipsParagraph2Part2" /></p>
						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="featuresShowcase">
						<div class="featureContentHeader"><spring:message code="pages.wise-in-action.alternativeLearningContexts" /></div>
						<div class="featureContent">
							<p><spring:message code="pages.wise-in-action.alternativeLearningContextsParagraph" /></p>
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
