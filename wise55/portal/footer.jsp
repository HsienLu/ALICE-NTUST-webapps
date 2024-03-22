<div id="footer">
	<div class="banner">
	 	<div id="contentFooter">
			<div class="footer-left">
				<div id="footerLinks">
					<div id="wiseLinks">
						<ul>
						   <li class="first"><a href="${contextPath}/pages/gettingstarted.html"><spring:message code="footer.gettingStarted" /></a></li>
						   <li><a href="${contextPath}/pages/teacherfaq.html"><spring:message code="footer.faq" /></a></li>
						   <li><a href="${contextPath}/pages/terms.html"><spring:message code="footer.termsOfUse" /></a></li>
					   </ul>
					</div>
				</div>
			    <div id="footerText">
				   <p><spring:message code="footer.nsfSupport" /></p>
			    </div>
			</div>
			<div class="footer-mid">
				<div class="logo-group">
					<a href=""><img src="<spring:theme code='footer-contanct-logo-line-1' />" alt=""></a>
					<a href=""><img src="<spring:theme code='footer-contanct-logo-line-2' />" alt=""></a>
					<a href=""><img src="<spring:theme code='footer-contanct-logo-line-3' />" alt=""></a>
					<a href=""><img src="<spring:theme code='footer-contanct-logo-line-4' />" alt=""></a>
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
