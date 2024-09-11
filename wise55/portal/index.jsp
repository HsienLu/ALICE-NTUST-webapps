<%@ include file="include.jsp"%>
<!DOCTYPE html>
<html dir="${textDirection}">
<head>
<META http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="chrome=1"/>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%@ include file="favicon.jsp"%>
<title><spring:message code="wiseTitle" /></title>
<link href="${contextPath}/<spring:theme code="globalstyles"/>" rel="stylesheet" type="text/css" />
<link href="${contextPath}/<spring:theme code="homepagestylesheet"/>" rel="stylesheet" type="text/css" />
<link href="${contextPath}/<spring:theme code="jqueryjscrollpane.css"/>" rel="stylesheet" type="text/css" />
<link href="${contextPath}/<spring:theme code="jquerystylesheet"/>" rel="stylesheet" type="text/css" />
<link href="${contextPath}/<spring:theme code="nivoslider.css"/>" rel="stylesheet" type="text/css" />
<link href="${contextPath}/<spring:theme code="nivoslider-wise.css"/>" rel="stylesheet" type="text/css" />
<link href="${contextPath}/<spring:theme code="tinycarousel.css"/>" rel="stylesheet" type="text/css" />
<link href="${contextPath}/<spring:theme code="superfishstylesheet"/>" rel="stylesheet" type="text/css" >
<link href="${contextPath}/<spring:theme code="notice"/>" rel="stylesheet" type="text/css" >
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css">
<c:if test="${textDirection == 'rtl' }">
    <style>
    #about {
    position: absolute;
    left: 0px;
}

#news {
    position: relative;
    right: none;
}
</style>

</c:if>

<script src="${contextPath}/<spring:theme code="jquerysource"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="jquerymigrate.js"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="jqueryuisource"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="jquerymousewheel.js"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="jqueryjscrollpane.js"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="nivoslider.js"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="easyaccordion.js"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="tinycarousel.js"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="superfishsource"/>" type="text/javascript"></script>
<link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
<meta name="google-site-verification" content="lTYOR_6mIkD0EqfKePXJoCgCLGOiiZJvfLej5F_t_JI" />
</head>
<body>
	<%@ include file="headermain.jsp"%>
<div id="pageWrapper">
	<div class="notice" style="margin-top: -1rem;">
	</div>
	<div id="page">
		<div class="slider-wrapper theme-wise">
		<div class="ribbon"></div>
			<div id="showcaseSlider">
			    <img src="${contextPath}/<spring:theme code="index-herosection-slider1-aboutAlice"/>" alt="<spring:message code="index.whatIsWise" />" />
			    <img src="${contextPath}/<spring:theme code="index-herosection-slider2-actiontodo"/>" alt="<spring:message code="index.curriculumBased" />" />
			    <img src="${contextPath}/<spring:theme code="index-herosection-slider3-actionclass"/>" alt="<spring:message code="index.inquiryProjects" />" />
			    <img src="${contextPath}/<spring:theme code="index-herosection-slider4-studentattent"/>" alt="<spring:message code="index.studentEngagement" />" />
			</div>
		</div>
		<div id="pageContent">
			<div class="showcase">
				<div id="about">
				</div>
			</div>
			<div class="showcase">
				<div id="showcurse">
					<div class="title-text">
						<h4 style="padding-top:0.25rem;margin:0 auto;font-size: 2rem;"><spring:message code="index.curse.title"/></h4>
					</div>	
					<div class="card-group">
						<new-item titleText="'菸'沒綠洲" picSrc="${contextPath}/<spring:theme code="new-item-pic1-v2"/>" ></new-item>
						<new-item titleText="看不見的汙染" picSrc="${contextPath}/<spring:theme code="new-item-pic2-v2"/>" ></new-item>
						<new-item titleText="工作坊資訊" picSrc="${contextPath}/<spring:theme code="new-item-pic3-v2"/>" ></new-item>
						<new-item titleText="徵稿資訊" picSrc="${contextPath}/<spring:theme code="new-item-pic4-v2"/>" ></new-item>
					</div>
				</div>
			</div>
			<div class="showcase">
				<div class="title-text">
					<h4 
					style="padding-top:0.25rem;margin:0 auto;font-size: 2rem;line-height: 1.5;color: #404040;
    				font-weight: bold !important;text-align: center;"><spring:message code="index.curse.ALICE"/>
					</h4>
				</div>
				<div class="curse-introduction">
					<curse-introduction data-aos="fade-right"
					data-aos-easing="linear"
    				data-aos-duration="700" flexDirection="row" textTitle="學生課程" textContent="<spring:message code="index.curse.ALICE.student.text"/>" picSrc="${contextPath}/<spring:theme code="index-advantage-pic1"/>" ></curse-introduction>
					<curse-introduction data-aos="fade-left"      data-aos-easing="linear"
    				data-aos-duration="700" flexDirection="reverse-row"  textTitle="教師課程" textContent="<spring:message code="index.curse.ALICE.student.text"/>" picSrc="${contextPath}/<spring:theme code="index-teachingtool-pic3"/>" ></curse-introduction>
				</div>
			</div>
			<div class="showcase">
				<div class="title-text">
					<h4 
					style="padding-top:0.25rem;margin:0 auto;margin-bottom:1.5rem; font-size: 2rem;line-height: 1.5;color: #404040;
    				font-weight: bold !important;text-align: center;"><spring:message code="index.curse.category"/>
					</h4>
				</div>
				<div class="curse-category">
					<curse-card data-aos="zoom-in" titleText="實地考察" picSrc="${contextPath}/<spring:theme code='curse-category-pic1'/>"></curse-card>
					<curse-card data-aos="zoom-in" titleText="模擬實驗" picSrc="${contextPath}/<spring:theme code='curse-category-pic2'/>"></curse-card>
					<curse-card data-aos="zoom-in" titleText="社會議題" picSrc="${contextPath}/<spring:theme code='curse-category-pic3'/>"></curse-card>
					<curse-card data-aos="zoom-in" titleText="氣候變遷" picSrc="${contextPath}/<spring:theme code='curse-category-pic4'/>"></curse-card>
				</div>
				<a  href="${contextPath}/projectlibrary"
					style="display: block; padding-top:0.25rem;margin:0 auto;margin-block:1.5rem; font-size: 2rem;line-height: 1.5;color: #40A2E3;
					text-decoration: underline;
    				font-weight: bold !important;text-align: center;"><spring:message code="index.browseCurricula"/>
					</a>
			</div>
	</div>
	<%@ include file="footer.jsp"%>
</div>
<div id="projectDetailDialog" style="overflow:hidden;" class="dialog"></div>
<%@ include file="./web-component/NewItem.jsp"%>

<%@ include file="./web-component/ALICECurse.jsp"%>

<%@ include file="./web-component/CurseCard.jsp"%>


<script type="text/javascript">
	$(document).ready(function(){

		//focus cursor into the First Name field on page ready
		if($('#username').length){
			$('#username').focus();
		}

		$('#newsContent').jScrollPane();

		// Set up view project details click action for each project id link
		$('#projectShowcase').on('click','a.projectDetail',function(){
			var title = $(this).attr('title');
			var projectId = $(this).attr('id').replace('projectDetail_','');
			var path = "${contextPath}/projectInfo?projectId=" + projectId;
			var div = $('#projectDetailDialog').html('<iframe id="projectIfrm" width="100%" height="100%"></iframe>');
			div.dialog({
				width: '800',
				height: '400',
				title: title,
				modal:true,
				close: function(){ $(this).html(''); },
				buttons: {
					Close: function(){
						$(this).dialog('close');
					}
				}
			});
			$("#projectDetailDialog > #projectIfrm").attr('src',path);
		});

		setTimeout("loadProjectThumbnails()",500);
	});

	$(window).load(function() {

		// initiate showcase slider
		$('#showcaseSlider').nivoSlider({
			effect:'sliceDownRight',
			animSpeed:500,
			pauseTime:10000,
			prevText: '>',
	        nextText: '<',
	        directionNav: false,
	        beforeChange: function(){
	        	$('#about .panelHead span').fadeOut('slow');
	        },
	        afterChange: function(){
	        	var active = $('#showcaseSlider').data('nivo:vars').currentSlide;
	        	$('#about .panelHead span').text($('#showcaseSlider > img').eq(active).attr('alt'));
	        	$('#about .panelHead span').fadeIn('fast');
	        }
		});

		// set random opening slide for project showcase
		var numSlides = $('#projectShowcase dt').length;
		var start = Math.floor(Math.random()*numSlides);

		// initiate project showcase accordion
		$('#project-showcase').easyAccordion({
		   autoStart: false,
		   slideNum: false,
		   startSlide: start
		});

		$('.tinycarousel').tinycarousel({ axis: 'y', pager: true, duration:500 });
	});

	// load thumbnails for each project by looking for curriculum_folder/assets/project_thumb.png (makes a ajax GET request)
	
	// If found (returns 200 status), it will replace the default image with the fetched image.
	// If not found (returns 400 status), it will do nothing, and the default image will be used.

	function loadProjectThumbnails() {
		$(".projectThumb").each(
			function() {
				var thumbUrl = $(this).attr("thumbUrl");

				try {
                    if (window.location.protocol == "https:" && thumbUrl.substr(0,5) == "http:") {
                        thumbUrl = "https:" + thumbUrl.substr(5);
                    }
                } catch (exception) {
                       // do nothing
                }
				// check if thumbUrl exists
				$.ajax({
					url:thumbUrl,
					context:this,
					statusCode: {
						200:function() {
				  		    // found, use it
							$(this).html("<img src='"+thumbUrl+"' alt='thumb'></img>");
						},
						404:function() {
						    // not found, leave alone
						}
					}
				});
			});
	};
</script>
<script src="https://unpkg.com/aos@next/dist/aos.js"></script>
<script>
    AOS.init();
</script>
</body>
</html>
