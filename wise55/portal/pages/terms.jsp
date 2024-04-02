<%@ include file="../include.jsp"%>

<!DOCTYPE html>
<html dir="${textDirection}">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta http-equiv="X-UA-Compatible" content="chrome=1" />
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
<%@page pageEncoding='UTF-8'  %>
<%@ include file="../favicon.jsp"%>
<title><spring:message code="pages.gettingstarted.title" /></title>

<link href="${contextPath}/<spring:theme code="globalstyles"/>" media="screen" rel="stylesheet"  type="text/css" />
<link href="${contextPath}/<spring:theme code="superfishstylesheet"/>" rel="stylesheet" type="text/css" >
<c:if test="${textDirection == 'rtl' }">
    <link href="${contextPath}/<spring:theme code="rtlstylesheet"/>" rel="stylesheet" type="text/css" >
</c:if>

<script src="${contextPath}/<spring:theme code="jquerysource"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code='superfishsource'/>" type="text/javascript"></script>
</head>
<body>
<spring:htmlEscape defaultHtmlEscape="false">
<spring:escapeBody htmlEscape="false">
<div id="pageWrapper">

	<%@ include file="../headermain.jsp"%>

	<div id="page">

		<div id="pageContent">
            <h4-title-text titleText="<spring:message code='ALICE.terms.title'/>"></h4-title-text>
            <h5 style="
            color: blue; 
            font-size: 1.5rem;
            font-weight: 600;
            "
            ><spring:message code='ALICE.terms.subtitle'/></h5>

<%
    for(int i=1; i<11; i++){
%>
        <c:set var="code" value='<%= "ALICE.terms.content" + i %>' />
        <p style="
        font-size: 1rem;
        color:#404040;
        margin-block:1rem;
        "><spring:message code="${code}"/></p>
<%
    }
%>
            
		</div>
		<div style="clear: both;"></div>
	</div>   <!-- End of page-->
    <%@ include file="../web-component/H4TitleText.jsp"%> 
	<%@ include file="../footer.jsp"%>
</div>
</spring:escapeBody>
</spring:htmlEscape>
</body>
</html>
