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
<%@page pageEncoding='UTF-8'  %>
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
			text-align: left;">
				<spring:message code="index.news.title1"/>
			</h4>

			<news-item 
				titleText="課程徵稿"
				textPar="我們的平台正在進行課程徵稿！如果你願意分享你的課程，不論是數學、自然還是任何專業領域，我們都歡迎你來創建課程。這是一個自由設計教學內容和方式的機會，讓你能夠直接與學生互動，傳遞知識。加入我們，一起打造多元學習環境。"
				picSrc='${contentPath}/<spring:theme code="news-pic-1"/>'></news-item> 
			<news-item 
				titleText="樹林高中演講活動"
				textPar="近日，我們受邀於樹林高中舉辦了一場關於CHATGPT在教學中應用的講座。說明了CHATGPT的基礎知識、操作方法及其在教育領域的實際應用案例。我們分享了如何利用CHATGPT來創造互動式學習環境、提高教學效率和質量。"
				picSrc='${contentPath}/<spring:theme code="news-pic-2"/>'></news-item> 
			<news-item 
				titleText="德明科技大學演講活動"
				textPar="近日，我們受邀於德明科技大學，分享了我們開發的氣候變遷桌遊如何在教學中發揮作用。這款桌遊希望透過互動式學習，讓學生更深刻地理解氣候變遷的嚴重性及其對地球的影響。我們討論了如何將遊戲融入課程中，以及它如何成為啟發學生思考和討論的工具。"
				picSrc='${contentPath}/<spring:theme code="news-pic-3"/>'></news-item> 


		</div>
	</div>
	<%@ include file="../footer.jsp"%>
</div>
<%@ include file="../web-component/NewContentCard.jsp"%>
</body>
</html>
