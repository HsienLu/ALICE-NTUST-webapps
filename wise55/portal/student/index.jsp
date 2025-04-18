<%@ include file="../include.jsp"%>

<!DOCTYPE html>
<html dir="${textDirection}">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="chrome=1" />
<%@ include file="../favicon.jsp"%>
<title><spring:message code="student.title" /></title>

<link href="${contextPath}/<spring:theme code="jquerystylesheet"/>" media="screen" rel="stylesheet"  type="text/css" />
<link href="${contextPath}/<spring:theme code="globalstyles"/>" media="screen" rel="stylesheet"  type="text/css" />
<link href="${contextPath}/<spring:theme code="studenthomepagestylesheet" />" media="screen" rel="stylesheet" type="text/css" />
<link href="${contextPath}/<spring:theme code="superfishstylesheet"/>" rel="stylesheet" type="text/css" >

<script src="${contextPath}/<spring:theme code="jquerysource"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="jqueryuisource"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="jquerycookiesource"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="browserdetectsource"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="checkcompatibilitysource"/>" type="text/javascript"></script>
<script src="${contextPath}/<spring:theme code="superfishsource"/>" type="text/javascript"></script>

<script type="text/javascript">
// only alert user about browser comptibility issue once.
if ($.cookie("hasBeenAlertedBrowserCompatibility") != "true") {
	alertBrowserCompatibility();
}
$.cookie("hasBeenAlertedBrowserCompatibility","true");

$.cookie("pLT","<%= request.getParameter("pLT") %>", {path:"/"});

$(document).ready(function() {
	// create add project dialog
	$("#addprojectLink").bind("click", function() {
		var addProjectDialogHtml = '<div style="display:none; overflow-y:hidden;" id="addProjectDialog">'+
		'<iframe id="addProjectFrame" width="100%" height="99%" frameborder="0" allowTransparency="false"> </iframe>'+
		'</div>';
		if ($("#addProjectDialog").length == 0) {
			$("#page").append(addProjectDialogHtml);
		}
		$("#addProjectDialog").dialog({
			position:["center","center"],
			modal:true,
			resizable:false,
			width:600,
			height:425,
			title: '<spring:message code="student.addproject.title" htmlEscape="false" />',
			buttons: {
				Cancel: function(){ $(this).dialog('destroy'); }
			}
		});
		$("#addProjectDialog > #addProjectFrame").attr('src','${contextPath}/student/addproject');
	});

	// create change password dialog
	$("#changePasswordLink").bind("click", function() {
		var changePasswordDialogHtml = '<div style="display:none; overflow-y:hidden;" id="changePasswordDialog">'+
		'<iframe id="changePasswordFrame" src="${contextPath}/student/changestudentpassword.html" width="100%" height="99%" allowTransparency="false"> </iframe>'+
		'</div>';
		if ($("#changePasswordDialog").length == 0) {
			$("#page").append(changePasswordDialogHtml);
		}
		$("#changePasswordDialog").dialog({
			modal:true,
			resizable:false,
			width:600,
			height:350,
			title: 'Change Password',
			buttons: {
				'Close': function(){ $(this).dialog('destroy'); }
			}
		});

	});

	// create update userinfo dialog
	$("#updateStudentAccountLink").bind("click", function() {
		var updateStudentAccountDialogHtml = '<div style="display:none; overflow-y:hidden;" id="updateStudentAccountDialog">'+
		'<iframe id="updateStudentAccountFrame" width="100%" height="99%" frameborder="0" allowTransparency="false"> </iframe>'+
		'</div>';
		if ($("#updateStudentAccountDialog").length == 0) {
			$("#page").append(updateStudentAccountDialogHtml);
		}
		$("#updateStudentAccountDialog").dialog({
			position:["center","center"],
			modal:true,
			resizable:false,
			width:600,
			height:425,
			title: '<spring:message code="student.updateaccount.title" htmlEscape="false" />',
			buttons: {
				Cancel: function(){ $(this).dialog('destroy'); }
			}
		});
		$("#updateStudentAccountDialog > #updateStudentAccountFrame").attr("src", "${contextPath}/student/updatestudentaccount.html");

	});

	// setup announcement link click handlers
	$('.viewAnnouncements').on('click',function(){
		var runIds = $(this).attr('id').replace('viewAnnouncements_','');
		showAnnouncements(runIds);
	});

	/* Shows announcements dialog
	** @param runIds String of Ids (comma separated) of runs to show announcements for
	** @param title String for title of dialog window
	** @param onlyNew Boolean whether to show all announcements or only new ones
	*/
	function showAnnouncements(runIds,title,onlyNew){
		var thisTitle = "<spring:message code="student.index.messages_title"/>";
		if(title){
			thisTitle = title;
		}
		var newOnly = 'false';
		if(onlyNew){
			newOnly = onlyNew;
		}
		var previousLogin = $.cookie("pLT");
		var path = "${contextPath}/student/viewannouncements.html?runId=" + runIds + "&pLT=" + previousLogin + "&newOnly=" + newOnly;
		var div = $('#announcementsDialog').html('<iframe id="announceIfrm" width="100%" height="100%"></iframe>');
		div.dialog({
			modal: true,
			width: '800',
			height: '500',
			title: thisTitle,
			position: 'center',
			close: function(){ $(this).html(''); },
			buttons: {
				Close: function(){
					$(this).dialog('close');
				}
			}
		});
		$("#announcementsDialog > #announceIfrm").attr('src',path);
	};

	// make tabs for current/archived runs
    $("#tabSystem").tabs();

	// check for new teacher announcements and display
	var newAnnouncements = "<c:out value="${newAnnouncements}" />";

	if(newAnnouncements > 0){
		var title = "<spring:message code="student.index.messages_new"/>";
		var announcementRunIds = "<c:out value="${announcementRunIds}" />";
		showAnnouncements(announcementRunIds,title,'true');
	}

});
</script>

</head>
<body>
<div id="pageWrapper">

	<%@ include file="../headermain.jsp"%>

	<div id="page">

		<div id="pageContent">


			<%@page import="java.util.*" %>

			<div class="sidebar sidebarLeft">
				<div class="sidePanel">
					<div class="panelHeader"><spring:message code="student.index.welcome"/></div>
					<div class="panelContent">
						<div class="sideContent">
							<c:set var="current_date" value="<%= new java.util.Date() %>" />
							<c:choose>
						        <c:when test="${(current_date.hours>=3) && (current_date.hours<12)}" >
						            <spring:message code="student.index.goodMorning"/>
						        </c:when>
						        <c:when test="${(current_date.hours>=12) && (current_date.hours<18)}" >
									<spring:message code="student.index.goodAfternoon"/>
						        </c:when>
						        <c:otherwise>
									<spring:message code="student.index.goodEvening"/>
						        </c:otherwise>
						    </c:choose>
						</div>
					</div>
				</div>
				<div class="sidePanel">
					<div class="panelHeader"><spring:message code="student.index.accountOptions" /></div>
					<div class="panelContent">

						<div id="optionButtons" class="sideContent">
							<ul>
								<li>
									<a id="addprojectLink" class="wisebutton altbutton"><spring:message code="student.addproject.title" /></a>
								</li>
								<li>
									<a id="changePasswordLink" class="wisebutton altbutton-small"><spring:message code="changePassword" /></a>
								</li>
								<li>
									<a class="wisebutton altbutton-small" href="${contextPath}/logout" id="studentsignout"><spring:message code="signOut" /></a>
								</li>
							</ul>
						</div>
						<div class="sideContent">
							<table id="list2">
								<tr>
									<td style="width:90px;"><spring:message code="student.index.lastVisit"/></td>
									<td>
									<c:choose>
										<c:when test="${lastLoginTime == null}">
											<spring:message code="student.index.firstVisit"/>
										</c:when>
										<c:otherwise>
											<fmt:formatDate value="${lastLoginTime}"
												type="both" dateStyle="short" timeStyle="short" />
										</c:otherwise>
									</c:choose>

									</td>
								</tr>
								<tr>
									<td><spring:message code="student.index.thisVisit"/></td>
									<c:choose>
										<c:when test="${user.userDetails.lastLoginTime == null}">
											<c:set var="thisLogin" value="${current_date}" />
										</c:when>
										<c:otherwise>
											<c:set var="thisLogin" value="${user.userDetails.lastLoginTime}" />
										</c:otherwise>
									</c:choose>
									<td><fmt:formatDate value="${thisLogin}" type="both" dateStyle="short" timeStyle="short" /></td>
								<tr>
									<td class="listTitle2"><spring:message code="student.index.totalVisits"/></td>
									<td id="numberOfLogins">${user.userDetails.numberOfLogins}</td>
								</tr>
								<tr>
									<td class="listTitle2"><spring:message code="student.index.language"/></td>
									<c:choose>
									<c:when test="${user.userDetails.language == null}">
										<td id="language"><spring:message code="default"/> (<a id="updateStudentAccountLink"><spring:message code="change" /></a>)</td>
									</c:when>
									<c:otherwise>
										<td id="language"><spring:message code="language.${user.userDetails.language}"/> (<a style=""id="updateStudentAccountLink"><spring:message code="change" /></a>)</td>
									</c:otherwise>
									</c:choose>
								</tr>
							</table>
						</div>

						<div class="sideContent">

							<div style="text-align:center; margin-top:5px"><img src="${contextPath}/<spring:theme code="wise4_logo_new_sm"/>" alt="WISE" /></div>

							<spring:htmlEscape defaultHtmlEscape="false">
            				<spring:escapeBody htmlEscape="false">
								<div class="displayAsEnglish"><spring:message code="legalCopyright"/></div>
							</spring:escapeBody>
							</spring:htmlEscape>

						</div>
					</div>
				</div>
			</div>

		<div class="contentPanel contentRight">
			<div class="panelHeader"><spring:message code="student.index.projectMenu"/></div>
			<div class="panelContent">
				<div id="tabSystem" class="panelTabs">
			   		<ul style='height:1.9em;'>   <!-- HT says: I don't know why but if I don't set height, the ul's height is much larger than it should be. -->
			        	<li><a href="#currentRuns"><spring:message code="student.index.currentProjectRuns"/></a></li>
			        	<li><a href="#archivedRuns"><spring:message code="student.index.archivedProjectRuns"/></a></li>
			    	</ul>
					<div id="currentRuns">
						<c:choose>
						<c:when test="${fn:length(current_run_list) > 0}" >

						<c:forEach var="studentRunInfo"  items="${current_run_list}">

							<table class="runTable" >

								<tr class="projectMainRow">
									<td class="rowLabel"><spring:message code="title"/></td>
									<td>
										<div class="studentTitleText">${studentRunInfo.run.name}</div>
									</td>
									<td rowspan="5" style="width:30%; padding:2px;">
										<ul class="studentActionList">

											<c:choose>
												<c:when test="${studentRunInfo.workgroup == null}">
													<li class="startProject"><a href='${contextPath}/student/startproject?runId=${studentRunInfo.run.id}' class="wisebutton" id='${studentRunInfo.run.id}' ><spring:message code="student.index.runProject"/></a></li>
												</c:when>
												<c:otherwise>
													<c:choose>
														<c:when test="${fn:length(studentRunInfo.workgroup.members) == 1}">
															<li class="startProject"><a href="${contextPath}/student/startproject?runId=${studentRunInfo.run.id}"
																id='${studentRunInfo.run.id}' class="wisebutton"><spring:message code="student.index.runProject"/></a></li>
														</c:when>
														<c:otherwise>
															<li class="startProject"><a href='${contextPath}/student/teamsignin.html?runId=${studentRunInfo.run.id}'
																id='${studentRunInfo.run.id}' class="wisebutton"><spring:message code="student.index.runProject"/></a></li>
														</c:otherwise>
													</c:choose>
												</c:otherwise>
											</c:choose>
											<li class="announcements"><a id="viewAnnouncements_${studentRunInfo.run.id}" class="viewAnnouncements"><spring:message code="student.index.viewAnnouncements"/></a></li>
											<li><a href="${contextPath}/contact/contactwise.html?projectId=${studentRunInfo.run.project.id}&runId=${studentRunInfo.run.id}"><spring:message code="student.index.reportProblem"/></a></li>
										</ul>
								 	</td>
								</tr>
								<tr>
									<td class="rowLabel"><spring:message code="student.index.accessCode"/></td>
									<td>${studentRunInfo.run.runcode}</td>
							  	</tr>
								<tr>
									<td class="rowLabel"><spring:message code="teacher_cap"/></td>
									<td>
										<c:choose>
										<c:when test="${studentRunInfo.run.owner != null}" >
											${studentRunInfo.run.owner.userDetails.displayname}
										</c:when>
										<c:otherwise>
											<spring:message code="student.index.teamNotEstablishedYet"/>
										</c:otherwise>
							      		</c:choose>
									</td>
									</tr>
								<tr>
									<td class="rowLabel"><spring:message code="run_period"/></td>
									<td >${studentRunInfo.group.name} <span id="periodMessage"><spring:message code="student.index.changePeriodHelpMessage"/></span></td>

							  	</tr>
								<tr>
									<td class="rowLabel"><spring:message code="team_cap"/></td>
									<td>
										<c:choose>
										<c:when test="${studentRunInfo.workgroup != null}" >
											<c:forEach var="member" varStatus="membersStatus" items="${studentRunInfo.workgroup.members}">
											${member.userDetails.username}
									 		   <c:if test="${membersStatus.last=='false'}">
						     					&
						    				</c:if>
											</c:forEach>
										</c:when>
										<c:otherwise>
											<div class="teamNotRegisteredMessage"><spring:message code="student.index.getStartedMessage"/></div>
										</c:otherwise>
							      		</c:choose>
									</td>
								</tr>
							</table>
						</c:forEach>
						</c:when>
						<c:otherwise>
							<spring:message code="student.index.addProjectMessage"/>
						</c:otherwise>
						</c:choose>
					</div>  <!--  closes <div id='currentRuns'> -->
					<div id="archivedRuns">
						<p class="info"><spring:message code="student.index.archivedRunMessage"/></p>

						<c:choose>
						<c:when test="${fn:length(ended_run_list) > 0}" >
						<c:forEach var="studentRunInfo"  items="${ended_run_list}">
							<table class="runTable" >

								<tr class="projectMainRow">
									<td class="rowLabel"><spring:message code="title"/></td>
									<td class="studentCurrentTitleCell">
										<div class="studentTitleText">${studentRunInfo.run.name}</div></td>
									<td rowspan="5" style="width:27%; padding:2px;">
									  	<ul class="studentActionList">
											<li class="startProject">
												<a href="${contextPath}/student/startproject?runId=${studentRunInfo.run.id}" class="wisebutton"><spring:message code="review"/></a>
											</li>
										</ul>
								 	</td>
								</tr>
								<tr>
									<td class="rowLabel"><spring:message code="teacher_cap"/></td>
									<td>
										<c:choose>
										<c:when test="${studentRunInfo.run.owner != null}" >
											${studentRunInfo.run.owner.userDetails.displayname}
										</c:when>
										<c:otherwise>
											<spring:message code="student.index.teamNotEstablishedYet"/>
										</c:otherwise>
							      		</c:choose>
									</td>
									</tr>
								<tr>
									<td class="rowLabel"><spring:message code="run_period"/></td>
									<td>${studentRunInfo.group.name}</td>

							  	</tr>
								<tr>
									<td class="rowLabel"><spring:message code="team_cap"/></td>
									<td>
										<c:choose>
										<c:when test="${studentRunInfo.workgroup != null}" >
											<c:forEach var="member" varStatus="membersStatus" items="${studentRunInfo.workgroup.members}">
											${member.userDetails.username}
									 		   <c:if test="${membersStatus.last=='false'}">
						     					&
						    				</c:if>
											</c:forEach>
										</c:when>
										<c:otherwise>
											<spring:message code="student.index.teamNotEstablishedYet"/>
										</c:otherwise>
							      		</c:choose>
									</td>
								</tr>
								<tr>
									<td class="rowLabel"><spring:message code="student.index.runArchivedOn"/></td>
									<td><fmt:formatDate value="${studentRunInfo.run.endtime}" type="date" dateStyle="medium" /></td>
								</tr>
							</table>
						</c:forEach>
						</c:when>
						<c:otherwise>
								<spring:message code="student.index.noArchivedProjects"/>
						</c:otherwise>
						</c:choose>
					</div>
				</div>
			</div>
		</div>
		</div>
		<div style="clear: both;"></div>
	</div>   <!-- End of page -->

	<%@ include file="../footer.jsp" %>
</div>

<div id="announcementsDialog" class="dialog" style="display:none; overflow:hidden;"></div>
</body>
</html>
