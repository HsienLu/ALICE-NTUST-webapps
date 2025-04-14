<%@ include file="include.jsp"%>

<!DOCTYPE html>
<html dir="${textDirection}">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<%@ include file="favicon.jsp"%>
<title><spring:message code="signup.title" /></title>

<link href="${contextPath}/<spring:theme code="globalstyles"/>" media="screen" rel="stylesheet"  type="text/css" />

</head>
<body style="background-color: #FFF6E9;">
<div id="pageWrapper">
	<div id="page">
		<div id="pageContent" style="min-height:400px;">
			<a id="name" href="${contextPath}/" title="<spring:message code="wiseHomepage"/>">			<div id="headerSmall" href="${contextPath}/">

			</div></a>

			<div class="infoContent">
				<div class="panelHeader"><spring:message code="signup.header"/></div>
				<div class="infoContentBox">
					<h4><spring:message code="signup.accountType"/></h4>
					<div><a href="${contextPath}/teacher/join" class="wisebutton" title="<spring:message code="signup.teacher"/>"><spring:message code="signup.teacher"/></a></div>
					<div><a href="${contextPath}/student/join" class="wisebutton" title="<spring:message code="signup.student"/>"><spring:message code="signup.student"/></a></div>
					<div style="margin-top:1em; color: blue;"><spring:message code="signup.whichAccount" /></div>
					<div class="instructions"><spring:message code="signup.studentDescription" /></div>
					<div class="instructions"><spring:message code="signup.teacherDescription" /></div>
				</div>
				<a style="color: black; font-weight: 800;" href="${contextPath}/" title="<spring:message code="wiseHomepage"/>"><spring:message code="returnHome"/></a>
			</div>
		</div>
	</div>
</div>
<%@ include file="analytics.jsp" %>
</body>
</html>
