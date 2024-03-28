
<div id="header" style="background: #BBE2EC;">
	<div class="banner" style=>
		<div class="logoHeader">
			<a id="name" class="" href="${contextPath}/" title="<spring:message code="wiseHomepage" />">
				<img class="header-logo" style="width: 500px;display: block;" src="${contextPath}/<spring:theme code="logo"/>" alt="">
			</a>
		</div>
		<div class="seclectMenu ">
				<a href="http://140.122.146.33:778/projectlibrary" style="color: #404040;font-size: 20px;line-height: 1.25"><spring:message code="index.menu.select1" /></a>
				<a href="http://140.122.146.33:778/pages/news.html" style="color: #404040;font-size: 20px;line-height: 1.25"><spring:message code="index.menu.select2" /></a>

				<drop-down></drop-down>
				
		</div>
		<sec:authorize access="!hasAnyRole('ROLE_USER')">
			<script type="text/javascript">
				function validateLoginForm() {
					var username = document.getElementById("username").value;
					var password = document.getElementById("password").value;
					if (username == null || username == "" || password == null || password == "") {
						window.location = "login?failed=true";
						return false;
					}
					return true;
				}
			</script>
			<div id="userInfoBlock" style="display: flex; flex-direction: column; justify-content: center;">
				<form id="home" method="post"
					action="${contextPath}/j_acegi_security_check"
					onsubmit="return validateLoginForm()" autocomplete="off"
					style="display: flex;">

					<div id="signinForm" >
						<div>
							<label for="username"> <spring:message code="usernameLabel" /></label>
							<input class="dataBoxStyle" type="text" name="username" id="username" size="18" maxlength="60" />
						</div>
						<div>
							<label for="password"><spring:message code="passwordLabel" /></label>
							<input class="dataBoxStyle" type="password" name="password" id="password" size="18" maxlength="30" />
						</div>
					</div>

					<div style="display: flex; flex-direction: column; justify-content: center; margin-left: 1rem;" >						
						<div id="submitSignIn" style="padding-bottom: 0.25rem;">
							<input type="submit" id="signInButton" name="signInButton" class="wisebutton smallbutton" value="<spring:message code="signIn"/>"></input>
						</div>
						<div id="accountMenu" class="guest">
							<a id="createAccountButton" href="${contextPath}/join" class="wisebutton" title="<spring:message code="accountmenu.createAccountTitle"/>">
								<spring:message code="accountmenu.createAccount" />
							</a>
						</div>
					</div>
				</form>

			</div>

			<!-- <div id="forgotLogin">
				<a href="${contextPath}/forgotaccount/selectaccounttype"><spring:message code="accountmenu.forgot" /></a>
			</div> -->
		</sec:authorize>

		<sec:authorize access="hasRole('ROLE_USER')">
			<div id="userInfoBlock" class="userInfo userInfo-login-teacher">
                <!-- <a id="signOut" class="wisebutton minibutton" href="${contextPath}/logout" title="<spring:message code="signOutTitle"/>"><spring:message code="signOut" /></a> -->
				<!-- ****** -->
				<div id="userName">
					<c:set var="firstName">
						<sec:authentication property="principal.firstname" htmlEscape="false" />
					</c:set>
					<c:set var="lastName">
						<sec:authentication property="principal.lastname" htmlEscape="false" />
					</c:set>
					<span><spring:message code="accountmenu.welcome" arguments="${firstName},${lastName}" /></span>
				</div>
				<sec:authorize access="!hasAnyRole('ROLE_STUDENT')">
					<div>
						<a href="${contextPath}/teacher/management/updatemyaccount.html"><spring:message code="accountmenu.myAccount" /></a>
					</div>
				</sec:authorize>
				<sec:authorize access="hasRole('ROLE_ADMINISTRATOR')">
					<a id="adminTools" class="wisebutton smallbutton-wide" href="${contextPath}/admin"><spring:message code="accountmenu.admin" /></a>
				</sec:authorize>
				<sec:authorize access="hasRole('ROLE_RESEARCHER')">
					<a id="researchTools" class="wisebutton smallbutton-wide" href="${contextPath}/admin">
						<spring:message code="accountmenu.research" />
					</a>
				</sec:authorize>
				<sec:authorize access="hasRole('ROLE_STUDENT')">
					
					<div class="student-login-btn">

						<a id="signOut" class="wisebutton minibutton" style="margin-bottom: 0.5rem;" href="${contextPath}/logout" title="<spring:message code="signOutTitle"/>"><spring:message code="signOut" /></a>
						<a id="researchTools" class="wisebutton minibutton" href="${contextPath}/student">
							<spring:message code="accountmenu.student" />
						</a>
					</div>

				</sec:authorize>
			</div>

			<sec:authorize access="!hasAnyRole('ROLE_STUDENT')">
				<div id="accountMenu" class="accountMenuTeacher">
					<a class="wisebutton minibutton accountMenuTeacherBtn" href="${contextPath}/teacher"><spring:message code="accountmenu.teacherHome" /></a>
					<a id="signOut" class="wisebutton minibutton" href="${contextPath}/logout" title="<spring:message code="signOutTitle"/>"><spring:message code="signOut" /></a>
					<!-- <ul class="sf-menu ">
							<li class="level1 menu1"><a><spring:message code="accountmenu.help" /></a>
								<ul>
									<li><a href="${contextPath}/pages/gettingstarted.html"><spring:message code="accountmenu.quickstart" /></a></li>
									<li><a href="${contextPath}/pages/teacherfaq.html"><spring:message code="accountmenu.faq" /></a></li>
									<c:if test="${discourseSSOLoginURL != null}">
										<li><a target=_blank href="${discourseSSOLoginURL}"><spring:message code="wiseTeacherCommunity" /></a></li>
									</c:if>
									<li><a href="${contextPath}/contact/contactwise.html"><spring:message code="accountmenu.contact" /></a></li>
								</ul>
							</li>
							<li class="level1 menu2"><a><spring:message code="accountmenu.management" /></a>
								<ul>
									<li><a href="${contextPath}/teacher/management/library.html"><spring:message code="accountmenu.library" /></a></li>
									<li><a href="${contextPath}/teacher/management/classroomruns.html"><spring:message code="accountmenu.runs" /></a></li>
									<li><a href="${contextPath}/author/authorproject.html"><spring:message code="accountmenu.authoring" /></a></li>
									<li><a href="${contextPath}/author"><spring:message code="accountmenu.authoring2" /></a></li>
								</ul>
							</li>
							<li class="level1 menu3 new-level1-menu3"><a class="wisebutton minibutton" href="${contextPath}/teacher"><spring:message code="accountmenu.teacherHome" /></a></li>
					</ul> -->
				</div>
			</sec:authorize>
			<sec:authorize access="hasRole('ROLE_STUDENT')">
				<div id="accountMenu" class="guest">				
					<ul class="welcome-menu">					
						<li><spring:message code="accountmenu.welcomeNewToWise" /></li>					
					</ul>
					<!-- <a id="createAccountButton" href="${contextPath}/join" class="wisebutton signup" title="<spring:message code="accountmenu.createAccountTitle"/>">
						<spring:message code="accountmenu.createAccount" />
					</a> -->
				</div>
			</sec:authorize>
		</sec:authorize>

		<script type="text/javascript">
			// initialise menu, set last login time
			$(function() {
				$('ul.sf-menu').superfish({});
			});
		</script>
	</div>
</div>

<%@ include file="./web-component/DorpDown.jsp"%>