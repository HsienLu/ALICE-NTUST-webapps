<%@ include file="../include.jsp"%>

<!DOCTYPE html>
<html dir="${textDirection}">
<head>
<META http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="chrome=1"/>
<%@ include file="../favicon.jsp"%>
<title><spring:message code="pages.features.title" /></title>

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
			<h4 style="padding-top:0.25rem;
			margin-block:1.5rem; 
			font-size: 2rem;
			line-height: 1.5;color: #404040;
			font-weight: bold !important;
			text-align: left;"><spring:message code="index.news.title1"/></h4>

			<news-item picSrc="${contentPath}/<spring:theme code="news-pic-1"/>"></news-item>

			<news-item picSrc="${contentPath}/<spring:theme code="news-pic-2"/>"></news-item>

			<news-item picSrc="${contentPath}/<spring:theme code="news-pic-3"/>"></news-item>
		</div>
	</div>
	<%@ include file="../footer.jsp"%>
</div>
<%@ include file="../web-component/NewContentCard.jsp"%>
</body>
</html>
