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

	<div style="margin-top:1rem;" id="page">

		<div id="pageContent">
			<div class="contentPanel">

				<div class="panelHeader"><spring:message code="pages.features.title" /></div>

				<div class="panelContent">
					<div class="featuresShowcase left">
						<img style="width:350px;height:auto;" src="${contextPath}/<spring:theme code="wise_vle"/>" alt="<spring:message code="pages.features.vle" />" />
						<div class="featureContent">
							<div class="featureContentHeader"><spring:message code="pages.features.vle" /></div>
							<p><spring:message code="pages.features.vle_content_p1" /></p>
						</div>
						<div style="clear:both;"></div>
					</div>

					<div class="featuresShowcase right">
						<img style="width:400px;height:auto;" src="${contextPath}/<spring:theme code="vle_prompts"/>" alt="<spring:message code="pages.features.readWrite" />" />
						<div class="featureContent">
							<div class="featureContentHeader"><spring:message code="pages.features.projectsAndTools" /></div>
							<p><spring:message code="pages.features.readWrite" /></p>
						</div>
						<div style="clear:both;"></div>
					</div>

					<div class="featuresShowcase left">
						<img style="width:400px;height:auto;" src="${contextPath}/<spring:theme code="vle_argumentation"/>" alt="<spring:message code="pages.features.argumentation" />" />
						<div class="featureContent">
							<div class="featureContentHeader"><spring:message code="pages.features.argumentation" /></div>
							<p><spring:message code="pages.features.argumentation_IM_content" /></p>

						</div>
						<div style="clear:both;"></div>
					</div>
					<div class="featuresShowcase right">
						<img style="width:400px;height:auto;" src="${contextPath}/<spring:theme code="vle_activities"/>" alt="<spring:message code="pages.features.activityTemplates" />" />
						<div class="featureContent">
							<div class="featureContentHeader"><spring:message code="pages.features.simulations" /></div>
							<p><spring:message code="pages.features.activityTemplates1" /></p>
							<p><spring:message code="pages.features.activityTemplates2" /></p>

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
