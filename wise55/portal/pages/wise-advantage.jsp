<%@ include file="../include.jsp"%>

<!DOCTYPE html>
<html dir="${textDirection}">
<head>
<META http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="chrome=1"/>
<%@ include file="../favicon.jsp"%>
<title><spring:message code="wiseTitle" /></title>

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
			<h4-title-text titleText='<spring:message code="index.advantage.title"/>' ></h4-title-text>

			<page-content-card 
			picSrc='${contextPath}/<spring:theme code="wise-advantage-pic1" />' 
			titleText='<spring:message code="index.advantage.subtitle1"/>'
			contentText="<spring:message code='index.advantage.content1'/>"
			flexDirection="row"
			></page-content-card>
			<page-content-card 
			picSrc='${contextPath}/<spring:theme code="wise-advantage-pic2" />' 
			titleText='<spring:message code="index.advantage.subtitle2"/>'
			contentText="<spring:message code='index.advantage.content2'/>"
			flexDirection="row-reverse"
			></page-content-card>
			<page-content-card 
			picSrc='${contextPath}/<spring:theme code="wise-advantage-pic3" />' 
			titleText='<spring:message code="index.advantage.subtitle3"/>'
			contentText="<spring:message code='index.advantage.content3'/>"
			flexDirection="row"
			></page-content-card>
			<page-content-card 
			picSrc='${contextPath}/<spring:theme code="wise-advantage-pic4" />' 
			titleText='<spring:message code="index.advantage.subtitle4"/>'
			contentText="<spring:message code='index.advantage.content4'/>"
			flexDirection="row-reverse"
			></page-content-card>
		</div>
		<div style="clear: both;"></div>
	</div>   <!-- End of page -->

	<%@ include file="../footer.jsp"%>
</div>
<%@ include file="../web-component/H4TitleText.jsp"%>
<%@ include file="../web-component/PagesContentCard.jsp"%>
</body>
</html>
