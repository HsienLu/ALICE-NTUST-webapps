<div id="footer">
	<div class="banner">
	 	<div id="contentFooter">
			<div class="footer-left">
				<div class="box1">

					<div id="footerLinks">
						<div id="wiseLinks">
							<ul>
							   <li class="first"><a href="${contextPath}/Getting-Started/"><spring:message code="footer.gettingStarted" /></a></li>
							   <li><a href="${contextPath}/pages/teacherfaq.html"><spring:message code="footer.faq" /></a></li>
							   <li><a href="${contextPath}/pages/terms.html"><spring:message code="footer.termsOfUse" /></a></li>
						   </ul>
						</div>
					</div>
					<div id="footerText">
					   <p><spring:message code="footer.nsfSupport" /></p>
					</div>
				</div>
				<div class="box2">
					<div class="logo-group">
						<a href=""><img src="${contextPath}/<spring:theme code='footer-contanct-logo-line-1' />" alt=""></a>
						<a href="https://www.youtube.com/channel/UCLTLbvuu5vAIatC7YcM9DGg"><img src="${contextPath}/<spring:theme code='footer-contanct-logo-line-2' />" alt=""></a>
						<a href=""><img src="${contextPath}/<spring:theme code='footer-contanct-logo-line-3' />" alt=""></a>
						<a href="mailto:digi.climatechange.edu@gmail.com"><img src="${contextPath}/<spring:theme code='footer-contanct-logo-line-4' />" alt=""></a>
					</div>
				</div>
			</div>

	 		<div class="footer-right">
	 			<div id="footerLogos">
					<img src="${contextPath}/<spring:theme code="everc_logo"/>" alt="edu" />
					<img src="${contextPath}/<spring:theme code="ntust_logo"/>" alt="ntust" />
					<img src="${contextPath}/<spring:theme code="edu_logo"/>" alt="ntnu" />
					<img src="${contextPath}/<spring:theme code="ntnu_logo"/>" alt="everc" />
				</div>

				<div style="clear:both; padding:0;"></div>
				<%@ include file="analytics.jsp" %>
	 		</div>
		</div>
	<!-- End of contentFooter -->
	</div> 	<!-- End of banner -->
</div>	<!-- End of footer -->
