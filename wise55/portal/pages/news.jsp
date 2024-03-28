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
		</div>
	</div>

	<news-item></news-item>

	<%@ include file="../footer.jsp"%>
</div>
</body>
<script>
	class NewsItem extends HTMLElement {
		static stylesheet=`
		div{
		width: 100px;
		height: 100px;
		border: 1px solid black;
		}
		`;
		constructor(){
			super();
			this.attachShadow({mode: 'open'});
			this.render();
			this.styling();
		}
		render(){
			this.box=document.createElement('div');
			
			this.setAttribute('class','box');
			this.shadowRoot.appendChild(this.box);
		}
		styling(){
			this.stylesheet=document.createElement('style');
			this.stylesheet.textContent=this.constructor.stylesheet
			this.shadowRoot.appendChild(this.stylesheet);
		}
	}
	customElements.define('news-item', NewsItem);
</script>
</html>
