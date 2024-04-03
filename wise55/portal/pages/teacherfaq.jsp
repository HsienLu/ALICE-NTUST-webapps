<%@ include file="../include.jsp"%>

<!DOCTYPE html>
<html dir="${textDirection}">
<head>
<meta name=Title content="<spring:message code="pages.teacherfaq.wise4TeacherInformationSheet" />">
<meta name=Keywords content="">
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<%@ include file="../favicon.jsp"%>
<title><spring:message code="pages.teacherfaq.wise4TeacherInformationSheet" /></title>

<link href="${contextPath}/<spring:theme code="globalstyles"/>" media="screen" rel="stylesheet"  type="text/css" />
<link href="${contextPath}/<spring:theme code="superfishstylesheet"/>" rel="stylesheet" type="text/css" >
<c:if test="${textDirection == 'rtl' }">
    <link href="${contextPath}/<spring:theme code="rtlstylesheet"/>" rel="stylesheet" type="text/css" >
</c:if>

<script src="${contextPath}/<spring:theme code="jquerysource"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="superfishsource"/>" type="text/javascript"></script>
<%@page pageEncoding="UTF-8" %>
<style type="text/css">
#tableOfContents {
  width: fit-content;
  background: #D9D9D9;
  padding: 1rem;
  margin-bottom: 1rem;
}

#tableOfContents > ul {
   padding-left: 1rem;
   color:#404040;
   list-style: disc;
}
#tableOfContents > ul > li {
	color:#404040;
	padding-top: 0.25rem;
}

#tableOfContents > ul > li> a {
	color:#404040;
}


#tableOfContentsHeader {
	font-size: 1.25rem;
	font-weight:bold;
	margin-bottom: 0.5rem;
}
.sectionHead {
	font-size: 1.25rem;
	font-weight:bold;
	margin-top: 1rem;
	color: blue;
}

.sectionContent > .question {
	color:#404040;
	font-weight: 900;

}
.sectionContent > .answer *{
	color:#404040;
	font-weight: 400;

}

</style>
</head>
<body>
<spring:htmlEscape defaultHtmlEscape="false">
<spring:escapeBody htmlEscape="false">
<div id="pageWrapper">

	<%@ include file="../headermain.jsp"%>

	<div id="page">

		<div id="pageContent" >
			<h4-title-text titleText="ALICE 教師常見問題"></h4-title-text>
			<div class="panelContent" style="padding: 0 !important;">
				<div id="tableOfContents">
					<h5 id="tableOfContentsHeader"><spring:message code="tableOfContents" /></h5>
					<ul >
						<li  ><a href="#studentManagement"><spring:message code="pages.teacherfaq.studentManagement" /></a></li>
						<li><a href="#projectManagement"><spring:message code="pages.teacherfaq.projectManagement" /></a></li>
						<li><a href="#assessmentOfStudentWork"><spring:message code="pages.teacherfaq.assessmentOfStudentWork" /></a></li>
						<li><a href="#technicalQuestions"><spring:message code="pages.teacherfaq.technicalQuestions" /></a></li>
					</ul>
				</div>

				<div class="sectionHead" id="studentManagement"><spring:message code="pages.teacherfaq.studentManagement" /></div>
				<div class="sectionContent">
					<div class="question"><spring:message code="pages.teacherfaq.shouldIRegisterStudentsQuestion" /></div>
					<div class="answer">
						<p><spring:message code="pages.teacherfaq.shouldIRegisterStudentsAnswerPart1" /></p>
						<ul>
						    <li><spring:message code="pages.teacherfaq.shouldIRegisterStudentsAnswerPart2" /></li>
    						<li><spring:message code="pages.teacherfaq.shouldIRegisterStudentsAnswerPart3" /></li>
						</ul>
					</div>

					<div class="question"><spring:message code="pages.teacherfaq.studentForgotUsernameOrPasswordQuestion" /></div>
					<div class="answer">
						<ul>
						    <li><spring:message code="pages.teacherfaq.studentForgotUsernameOrPasswordAnswerPart1" /></li>
						    <li><spring:message code="pages.teacherfaq.studentForgotUsernameOrPasswordAnswerPart2" /></li>
						    <li><spring:message code="pages.teacherfaq.studentForgotUsernameOrPasswordAnswerPart3" /></li>
						</ul>
					</div>

					<div class="question"><spring:message code="pages.teacherfaq.howChangeStudentPasswordQuestion" /></div>
					<div class="answer">
					<ul>
					    <li><spring:message code="pages.teacherfaq.howChangeStudentPasswordAnswerPart1" /></li>
					    <li><spring:message code="pages.teacherfaq.howChangeStudentPasswordAnswerPart2" />
					          <ul>
					            <li><spring:message code="pages.teacherfaq.howChangeStudentPasswordAnswerPart3" /></li>
					            <li><spring:message code="pages.teacherfaq.howChangeStudentPasswordAnswerPart4" /></li>
					            <li><spring:message code="pages.teacherfaq.howChangeStudentPasswordAnswerPart5" /></li>
					            <li><spring:message code="pages.teacherfaq.howChangeStudentPasswordAnswerPart6" /></li>
					          </ul>
					    </li>
					</ul>
					</div>

					<div class="question"><spring:message code="pages.teacherfaq.iDoNotRememberAccessCodeQuestion" /></div>
					<div class="answer">
					<ul>
					    <li><spring:message code="pages.teacherfaq.iDoNotRememberAccessCodeAnswerPart1" /></li>
					    <li><spring:message code="pages.teacherfaq.iDoNotRememberAccessCodeAnswerPart2" /></li>
					    <li><spring:message code="pages.teacherfaq.iDoNotRememberAccessCodeAnswerPart3" /></li>
					</ul>
					</div>
				</div>

				<div class="sectionHead" id="projectManagement"><spring:message code="pages.teacherfaq.projectManagement" /></div>
				<div class="sectionContent">
					<div class="question"><spring:message code="pages.teacherfaq.whenShouldISetUpRunQuestion" /></div>
					<div class="answer">
						<spring:message code="pages.teacherfaq.whenShouldISetUpRunAnswer" />
					</div>

					<div class="question"><spring:message code="pages.teacherfaq.howReviewAndGradeWorkQuestion" /></div>
					<div class="answer">
						<ul>
						    <li><spring:message code="pages.teacherfaq.howReviewAndGradeWorkAnswerPart1" /></li>
						    <li><spring:message code="pages.teacherfaq.howReviewAndGradeWorkAnswerPart2" /></li>
						    <li><spring:message code="pages.teacherfaq.howReviewAndGradeWorkAnswerPart3" /></li>
						</ul>
					</div>

					<div class="question"><spring:message code="pages.teacherfaq.howStudentsSeeMyCommentsAndScoresQuestion" /></div>
					<div class="answer">
						<ul>
						    <li><spring:message code="pages.teacherfaq.howStudentsSeeMyCommentsAndScoresAnswerPart1" /></li>
						    <li><spring:message code="pages.teacherfaq.howStudentsSeeMyCommentsAndScoresAnswerPart2" /></li>
						    <li><spring:message code="pages.teacherfaq.howStudentsSeeMyCommentsAndScoresAnswerPart3" /></li>
						    <li><spring:message code="pages.teacherfaq.howStudentsSeeMyCommentsAndScoresAnswerPart4" /></li>
						</ul>
					</div>

					<div class="question"><spring:message code="pages.teacherfaq.whereFindLessonPlansAndStandardsQuestion" /></div>
					<div class="answer">
						<ul>
							<li>
								<spring:message code="pages.teacherfaq.whereFindLessonPlansAndStandardsAnswer" />
							</li>
						</ul>
					</div>

					<div class="question"><spring:message code="pages.teacherfaq.howFitProjectIntoMyCurriculumQuestion" /></div>
					<div class="answer">
						<ul>
							<li>
								<spring:message code="pages.teacherfaq.howFitProjectIntoMyCurriculumAnswer" />
							</li>
						</ul>
					</div>

					<div class="question"><spring:message code="pages.teacherfaq.whatIfRunOutOfLabTimeQuestion" /></div>
					<div class="answer">
						<ul>
							<li>
								<spring:message code="pages.teacherfaq.whatIfRunOutOfLabTimeAnswer" />
							</li>
						</ul>
					</div>

					<div class="question"><spring:message code="pages.teacherfaq.iDoNotRememberTeacherAccessCodeQuestion" /></div>
					<div class="answer">
						<ul>
							<li>
								<spring:message code="pages.teacherfaq.iDoNotRememberTeacherAccessCodeAnswer" />
							</li>
						</ul>
					</div>
				</div>

				<div class="sectionHead" id="assessmentOfStudentWork"><spring:message code="pages.teacherfaq.assessmentOfStudentWork" /></div>
				<div class="sectionContent">
					<div class="question"><spring:message code="pages.teacherfaq.whereFindStudentWorkQuestion" /></div>
					<div class="answer">
						<ul>
						    <li><spring:message code="pages.teacherfaq.whereFindStudentWorkAnswerPart1" /></li>
						    <li><spring:message code="pages.teacherfaq.whereFindStudentWorkAnswerPart2" /></li>
						</ul>
					</div>

					<div class="question"><spring:message code="pages.teacherfaq.howFindTimeToGradeAllStudentWorkQuestion" /></div>
					<div class="answer">
						<ul>
							<li>
								<spring:message code="pages.teacherfaq.howFindTimeToGradeAllStudentWorkAnswer" />
							</li>
						</ul>
					</div>

				</div>

				<div class="sectionHead" id="technicalQuestions"><spring:message code="pages.teacherfaq.technicalQuestions" /></div>
				<div class="sectionContent">
					<div class="question"><spring:message code="pages.teacherfaq.websiteWontLoadQuestion" /></div>
					<div class="answer">
						<ul>
							<li>
								<spring:message code="pages.teacherfaq.websiteWontLoadAnswerPart1" />
							</li>
						</ul>
						<ul>
							<li>
								<spring:message code="pages.teacherfaq.websiteWontLoadAnswerPart2" />
							</li>
						</ul>
					</div>

					<div class="question"><spring:message code="pages.teacherfaq.howManyComputersDoINeedQuestion" /></div>
					<div class="answer">
						<ul>
							<li>
								<spring:message code="pages.teacherfaq.howManyComputersDoINeedAnswer" />
							</li>
						</ul>
					</div>

					<div class="question"><spring:message code="pages.teacherfaq.whatIfTroubleLoggingInQuestion" /></div>
					<div class="answer">
						<ul>
						    <li><spring:message code="pages.teacherfaq.whatIfTroubleLoggingInAnswerPart1" /></li>
						    <li><spring:message code="pages.teacherfaq.whatIfTroubleLoggingInAnswerPart2" /></li>
						</ul>
					</div>

					<div class="question"><spring:message code="pages.teacherfaq.whoContactWhenHaveProblemQuestion" /></div>
					<div class="answer">
						<ul>
							<li>
								<spring:message code="pages.teacherfaq.whoContactWhenHaveProblemAnswer" />
							</li>
						</ul>
					</div>

				</div>

				</div>  <!--  end of panelContent -->
			

		</div>

		<div style="clear: both;"></div>
	</div>   <!-- End of page-->

	<%@ include file="../footer.jsp"%>
</div>
</spring:escapeBody>
</spring:htmlEscape>
	<%@ include file="../web-component/H4TitleText.jsp"%>
</body>
</html>
