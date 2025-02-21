<%@ include file="include.jsp"%>

<!DOCTYPE html>
<html dir="${textDirection}">
<head>
<%@ include file="favicon.jsp"%>
<title><spring:message code="teacher.management.library.title" /></title>

<link href="${contextPath}/<spring:theme code="globalstyles"/>" media="screen" rel="stylesheet"  type="text/css" />
<link href="${contextPath}/<spring:theme code="stylesheet"/>" media="screen" rel="stylesheet"  type="text/css" />
<link href="${contextPath}/<spring:theme code="jquerystylesheet"/>" media="screen" rel="stylesheet" type="text/css" />
<link href="${contextPath}/<spring:theme code="teacherhomepagestylesheet"/>" media="screen" rel="stylesheet" type="text/css" />
<link href="${contextPath}/<spring:theme code="teacherrunstylesheet"/>" media="screen" rel="stylesheet"  type="text/css" />
<link href="${contextPath}/<spring:theme code="jquerydatatables.css"/>" media="screen" rel="stylesheet"  type="text/css" />
<link href="${contextPath}/<spring:theme code="facetedfilter.css"/>" media="screen" rel="stylesheet"  type="text/css" />
<link href="${contextPath}/<spring:theme code="tiptip.css"/>" media="screen" rel="stylesheet" type="text/css" />
<link href="${contextPath}/<spring:theme code="superfishstylesheet"/>" rel="stylesheet" type="text/css" >

<script src="${contextPath}/<spring:theme code="jquerysource"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="jqueryuisource"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="superfishsource"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="generalsource"/>" type="text/javascript"></script>

</head>
<body>
<%@ include file="headermain.jsp"%>
<div id="pageWrapper">
	<div id="page" style="margin-top:2rem;">
		<div id="pageContent">
			<!-- <div class="contentPanel"> 取消contentPanel的class樣式-->
			<div class="">
				<div class="panelHeader" style="border-bottom: 1px solid #000;color: #404040;margin-bottom: 1rem;">
					
					<spring:message code="teacher.management.library.title" />
				</div>
				<div class="panelContent">
					<%@ include file="/portal/teacher/management/projectlibrarydisplay.jsp"%>
				</div>
			</div>
		</div>
		<div style="clear: both;"></div>
	</div>   <!-- End of page -->
	<%@ include file="footer.jsp"%>
</div>

</body>
</html>
