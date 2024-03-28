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
</body>
<script>
	class NewsItem extends HTMLElement {
		static stylesheet=`
			img{
				min-width:319px;
			}
			.box{
				display: flex;
				margin-bottom:2rem;
			}
			.textbox{
				margin-left: 3.5rem;
			}
			h4{
				font-size:3rem;
				color:#0C3CE8;
				margin-top:0;
				margin-bottom:1rem;
			}
			p {
				color:#787878;
				font-size:1.5rem;
			}
			a{
				color:#40A2E3;
				font-size:1.5rem;
				display:block;
				text-align:right;
			}
		`;
		constructor(){
			super();
			this.attachShadow({mode: 'open'});
			this.render();
			this.styling();
		}
		render(){
			this.box=this.createElementwithClass('div','box');
			this.shadowRoot.appendChild(this.box);

			this.pic=this.createElementwithClass('img','pic');
			this.pic.setAttribute('src',this.getAttribute('picSrc'));
			this.box.appendChild(this.pic);

			this.textbox=this.createElementwithClass('div','textbox');
			this.textbox.setAttribute('class','textbox');
			this.box.appendChild(this.textbox);

			this.titleText=this.createElementwithClass('h4','titleText');
			this.titleText.textContent='Title';
			this.textbox.appendChild(this.titleText);

			this.textPar=this.createElementwithClass('p','textPar');
			this.textPar.textContent='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate feugiat vel laoreet suspendisse. Id fusce vestibulum felis, vitae, consectetur faucibus quis elit cras. Urna gravida adipiscing dignissim pretium eget non. Tortor, in id arcu pulvinar.';
			this.textbox.appendChild(this.textPar);

			this.moreLink=this.createElementwithClass('a','moreLink');
			this.moreLink.setAttribute('href','#');
			this.moreLink.textContent='<spring:message code="index.news.moreLink"/>';
			this.textbox.appendChild(this.moreLink);



		}
		createElementwithClass(type,className){
			const element=document.createElement(type);
			element.setAttribute('class',className);
			return element;
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
