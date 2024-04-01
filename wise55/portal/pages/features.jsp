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
			<h4-title-text titleText='<spring:message code="index.feature.title"/>' ></h4-title-text>

			<page-content-card 
			picSrc='${contextPath}/<spring:theme code="wise-features-pic1" />' 
			titleText='<spring:message code="index.advantage.subtitle1"/>'
			contentText="<spring:message code='index.advantage.content1'/>"
			flexDirection="row-reverse"
			></page-content-card>
			<page-content-card 
			picSrc='${contextPath}/<spring:theme code="wise-features-pic2" />' 
			titleText='<spring:message code="index.advantage.subtitle2"/>'
			contentText="<spring:message code='index.advantage.content2'/>"
			flexDirection="row"
			></page-content-card>
			<page-content-card 
			picSrc='${contextPath}/<spring:theme code="wise-features-pic3" />' 
			titleText='<spring:message code="index.advantage.subtitle3"/>'
			contentText="<spring:message code='index.advantage.content3'/>"
			flexDirection="row-reverse"
			></page-content-card>
			<page-content-card 
			picSrc='${contextPath}/<spring:theme code="wise-features-pic4" />' 
			titleText='<spring:message code="index.advantage.subtitle4"/>'
			contentText="<spring:message code='index.advantage.content4'/>"
			flexDirection="row"
			></page-content-card>
			<page-content-card 
			picSrc='${contextPath}/<spring:theme code="wise-features-pic5" />' 
			titleText='<spring:message code="index.advantage.subtitle4"/>'
			contentText="<spring:message code='index.advantage.content4'/>"
			flexDirection="row-reverse"
			></page-content-card>
			<page-content-card 
			picSrc='${contextPath}/<spring:theme code="wise-features-pic6" />' 
			titleText='<spring:message code="index.advantage.subtitle4"/>'
			contentText="<spring:message code='index.advantage.content4'/>"
			flexDirection="row"
			></page-content-card>
			<page-content-card 
			picSrc='${contextPath}/<spring:theme code="wise-features-pic7" />' 
			titleText='<spring:message code="index.advantage.subtitle4"/>'
			contentText="<spring:message code='index.advantage.content4'/>"
			flexDirection="row-reverse"
			></page-content-card>
			<h4-title-text titleText='<spring:message code="wisethanks.title"/>' ></h4-title-text>
			<h4 style="
				padding-top:0.25rem;
			    margin-block:1.5rem; 
			    font-size: 1.75rem;
			    line-height: 1.5;color: blue;
			    font-weight: 400 !important;
			    text-align: left;"><spring:message code="wisethanks.content"/></h4>
		</div>
		<div style="clear: both;"></div>
	</div>   <!-- End of page -->

	<%@ include file="../footer.jsp"%>
</div>
<%@ include file="../web-component/H4TitleText.jsp"%>
<%@ include file="../web-component/PagesContentCard.jsp"%>
</body>
</html>
