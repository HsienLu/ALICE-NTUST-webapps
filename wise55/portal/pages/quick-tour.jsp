<%@ include file="../include.jsp" %>
	<%@ page contentType="text/html; charset=utf-8" %>

		<!DOCTYPE html>
		<html dir="${textDirection}">

		<head>
			<!--<META http-equiv="Content-Type" content="text/html; charset=big5"> -->
			<meta http-equiv="X-UA-Compatible" content="chrome=1" />
			<%@ include file="../favicon.jsp" %>
				<title>CWISE教師的操作說明</title>

				<link href="${contextPath}/<spring:theme code=" globalstyles" />" rel="stylesheet" type="text/css" />
				<link href="${contextPath}/<spring:theme code=" homepagestylesheet" />" rel="stylesheet" type="text/css"
				/>
				<link href="${contextPath}/<spring:theme code=" superfishstylesheet" />" rel="stylesheet"
				type="text/css" >
				<c:if test="${textDirection == 'rtl' }">
					<link href="${contextPath}/<spring:theme code=" rtlstylesheet" />" rel="stylesheet" type="text/css"
					>
				</c:if>

				<style type="text/css">
					.rbutton {
						font-size: 30px;
						height: 25px;
						width: 25px;
						line-height: 25px;
						background-color: #666;
						border-radius: 100%;
						display: inline-block;
						color: #fff;
						text-align: center;
						margin-left: 10px;
						cursor: pointer;
					}

					.rbutton_s {
						font-size: 20px;
						height: 20px;
						width: 20px;
						line-height: 20px;
						background-color: #666;
						border-radius: 100%;
						display: inline-block;
						color: #fff;
						text-align: center;
						margin-left: 10px;
						cursor: pointer;
					}

					h1 {
						text-align: center;
					}

					h1.faq {
						margin-top: 20px;
					}

					h2 {
						margin-top: 15px;
					}

					h3 {
						margin-top: 10px;
					}

					h2,
					h3 {
						font-weight: bold;
						display: inline-block;
					}

					h3.non-register {
						font-size: 16px;
						text-indent: 15px;
						margin-top: 0px;
						margin-bottom: 0px;
					}

					/* ul {
		list-style-type: none;
	} */

					#pageContent hr {
						display: block;
						unicode-bidi: isolate;
						margin-block-start: 0.5em;
						margin-block-end: 0.5em;
						margin-inline-start: auto;
						margin-inline-end: auto;
						margin: 5px 0;
						overflow: hidden;
						border-style: inset;
						border-width: 1px;
					}

					#pageContent li {
						margin: 10px 0;
					}

					#pageContent p {
						font-size: 16px;
					}

					#student_manage p,
					#project_manage p,
					#score_manage p,
					#class_manage p,
					#tech_manage p {
						margin: 5px 0;
					}

					.teach {
						border-radius: 2%;
						width: 600px;
					}
				</style>

				<script src="${contextPath}/<spring:theme code=" jquerysource" />" type="text/javascript"></script>
				<script src="${contextPath}/<spring:theme code=" superfishsource" />" type="text/javascript"></script>
		</head>

		<body>
			<spring:htmlEscape defaultHtmlEscape="false">
				<spring:escapeBody htmlEscape="false">
					<div id="pageWrapper">

						<%@ include file="../headermain.jsp" %>

							<div id="page">

								<div id="pageContent">
									<div class="contentPanel">

										<div class="panelHeader">CWISE教師操作說明</div>

										<div class="panelContent">
											<h1>CWISE 快速導覽</h1>

											<!-- section1 -->
											<h2>技術需求</h2><span id="require" class="rbutton">+</span>
											<hr />
											<ol class="textcontent">
												<li>1.連接網際網路</li>
												<li>2.請更新瀏覽器，建議使用
													<a href="http://www.mozilla.org/firefox/" target="_blank">
														<img src="/portal/themes/default/images/quicktour/ico-firefox.png"
															width="20" height="20" /> Firefox
													</a>
													或
													<a href="http://google.com/chrome/" target="_blank">
														<img src="/portal/themes/default/images/quicktour/ico-chrome.png"
															width="20" height="20" /> Chrome
													</a>
												</li>
												<li>3.更新瀏覽器中Adobe Flash的播放器套件:
													<a href="http://get.adobe.com/flashplayer"
														target="_blank">http://get.adobe.com/flashplayer</a>
												</li>
												<li>4.更新瀏覽器中Java的套件:
													<a href="http://java.sun.com/getjava/download.html"
														target="_blank">http://java.sun.com/getjava/download.html</a>
												</li>
												<li>5.點選下列連結來執行您的電腦與CWISE5的相容性測試:
													<a href="http://cwise.gise.ntnu.edu.tw/pages/check.html"
														target="_blank">CWISE 系統確認</a>
												</li>
											</ol>

											<!-- section2 -->
											<h2>註冊教師帳號</h2><span id="register" class="rbutton">+</span>
											<hr />
											<ol class="textcontent">
												<li>選擇「註冊CWISE帳號」 <a href="http://cwise.gise.ntnu.edu.tw/join"
														target="_blank">註冊</a></li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG01.jpg" />
												<li>選擇「建立教師帳號」</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG02.jpg" />
												<li>填寫帳號申請表格(務必寫下/記住您的密碼)</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG03.jpg" />
												<li>請注意:在CWISE5中，CWISE教師帳號名稱的姓氏與名字間沒有空格(例如：KathySmith)</li>
											</ol>

											<!-- section3 -->
											<h2>執行CWISE專題課程</h2><span id="execuse" class="rbutton">+</span>
											<hr />
											<ol class="textcontent">
												<li>使用您的新帳號登入CWISE5</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG04.jpg" />
												<li>瀏覽「CWISE專題庫」</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG05.jpg" />
												<li>您可對任何有興趣的專題選擇「預覽」或「實施課程」</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG06.jpg" />
												<li>在選擇「實施課程」之後，點選「下一步」</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG07.jpg" />
												<li>將現有的班級課程歸檔(非必要)，點選「下一步」</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG08.jpg" />
												<li>選擇將要進行課程的班級，點選「下一步」</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG09.jpg" />
												<li>「設定班級課程」：一般班級在進行專題時，我們建議您讓學生兩人一組</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG10.jpg" />
												<li>我們強烈的建議您讓學生進行這個專題之前，預覽專題並且瀏覽教學重點，結束後點選「完成」</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG11.jpg" />
												<li>您新的班級課程已經建立，並顯示在「評分與課程管理」中</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG12.jpg" />
												<li>請注意：這個專題的「課程授權碼」會在確認頁面顯示。請寫下這組代碼，當學生要開始操作這個專題時，您將需要提供這組代碼給他們。(您可隨時在「評分與課程管理」裡，檢視您所有的課程授權代碼)
												</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG13.jpg" />

											</ol>

											<!-- section4 -->
											<h2>設定學生帳號</h2>
											<hr />
											<h3 class="non-register">尚未註冊(擁有)學生帳號</h3><span id="no_accunt"
												class="rbutton_s">+</span>
											<ol class="textcontent">
												<li>請點選「註冊CWISE帳號」並選擇「學生帳號」</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG14.jpg" />
												<li>請填寫帳號申請表格，輸入您剛建立的課程授權代碼，然後點選「建立帳號」</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG15.jpg" />
												<li>使用學生身分登入後，您將看到的是CWISE5學生首頁。</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG16.jpg" />
												<li>完成課程設定。點選「執行專題課程」，您可從學生的角度探索專題。</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG17.jpg" />
											</ol>
											<h3 class="non-register">已註冊(擁有)學生帳號</h3><span id="have_accunt"
												class="rbutton_s">+</span>
											<ol class="textcontent">
												<li>登入學生帳號後，於學生首頁左方點選「新增專題」</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG18.jpg" />
												<li>輸入您剛建立的課程授權代碼與班級選取，然後點選「新增課程」</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG19.jpg" />
												<li>完成課程設定。點選「執行專題課程」，您可從學生的角度探索專題。</li>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/REG17.jpg" />
											</ol>

											<!-- FAQ section -->
											<h1 class="faq">CWISE教師常見問題(FAQ)</h1>

											<!-- FAQ section1 -->
											<h2>學生管理</h2><span id="student_manage" class="rbutton">+</span>
											<hr />
											<ol class="textcontent student_manage">
												<h3>我該幫我的學生註冊，還是讓他們自己註冊呢？</h3>
												<p>CWISE讓學生註冊更加直觀簡單 --
													提供課程授權碼給您的學生，他們可以在10分鐘內直接在首頁上註冊完畢。您也可以預先為您的學生註冊，並提供帳號名稱和密碼給他們進行第一次的專題課程。
												</p>
												<ul>
													<li>學生註冊過一組帳號後，就不需再建其他帳號了。</li>
													<li>有些教師會預先準備好學生帳號，並提供預設密碼以減少學生登入時遇到問題。註:學生稍後可以修改他們的密碼。</li>
												</ul>
												<h3>如果學生忘記他們的帳號名稱或密碼，我該怎麼辦？</h3>
												<ul>
													<li>第一、我們建議學生在他們初次註冊時，寫下他們的帳號名稱或密碼。</li>
													<li>第二、鼓勵學生自己解決問題。告訴他們去首頁，點選「忘記帳號名稱/密碼?」連結，再點選「學生」按鈕。若學生能回答他們的安全性問題（註冊時建立)，他們可以重新設定他們的密碼。若學生有課程授權碼的話，應該就能找到與專題課程相關的帳號名稱。
													</li>
													<img class="teach"
														src="/portal/themes/default/images/quicktour/FAQ01.jpg" />
													<li>第三、若學生不能解決問題，您可直接查看他們的帳號，為他們更改密碼。在教師首頁中點選學生欄中某個班級的某個課程，點選「管理學生帳號」連結，觀看學生的帳號名稱後，點選「變更密碼」，為學生設定一組新的密碼。
													</li>
													<img class="teach"
														src="/portal/themes/default/images/quicktour/FAQ02.jpg" />
													<img class="teach"
														src="/portal/themes/default/images/quicktour/FAQ03.jpg" />
												</ul>
												<h3>我如何在專題課程開始執行後，變更學生的小組？</h3>
												<ul>
													<li>使用您的教師帳號名稱/密碼登入</li>
													<li>在目前的課程列表中找出課程</li>
													<li>在特定班級中的某一課程中點選「管理學生帳號」連結，您將可以進行班級學生帳號管理。</li>
													<li>拖拉學生的名字再放開，學生會由前一個小組移動到另一個小組，關閉視窗前請確認您已儲存變更。</li>
													<li>註 1: 若您將學生A移到一個已建的小組，學生A將失去他原本所有的作業，並將接續目前這個小組的作業。</li>
													<li>註 2:若您將學生A移到一個新的小組(空)，學生A目前的作業將轉移到這個新建的小組中繼續。</li>
													<li>註
														3:若您將學生A移到一個新的小組(空)，學生A目前的作業將轉移到這個新建的小組中繼續。若您再將學生B移到這個小組，學生B將失去他所有的作業，而將接續目前這個小組的作業(同時也是學生A的作業)。
													</li>
												</ul>
												<h3>我如何修改學生的密碼?-請學生手動更改密碼</h3>
												<ul>
													<li>學生須以原先的帳號密碼登入，再點選變更密碼按鈕，建立新的密碼。</li>
												</ul>
												<h3>我如何修改學生的密碼?-直接更改學生的密碼</h3>
												<ul>
													<li>使用您的教師帳號/密碼登入</li>
													<li>在教師首頁中點選某個課程的某個班級，點選「管理學生帳號」連結，您將連結到這個班級的管理學生帳號頁面。</li>
													<li>點選一位學生帳號的變更密碼連結，為此學生變更密碼。</li>
													<li>或點選「變更所有密碼」的連結，可批次變更當時課程中所有學生的密碼(新的密碼適用於所有學生)。</li>
												</ul>
												<h3>我忘了我的課程授權碼，如何讓學生在我新的課程班級中建立他們的帳號?</h3>
												<ul>
													<li>使用您的教師帳號/密碼登入。</li>
													<li>查看螢幕右方目前正在進行的專題課程。</li>
													<li>每一個專題課程都會產生一組特定的課程授權碼，學生需此代碼來註冊您的專題。</li>
													<img class="teach"
														src="/portal/themes/default/images/quicktour/FAQ04.jpg" />
												</ul>
											</ol>

											<!-- FAQ section2 -->
											<h2>專題管理</h2><span id="project_manage" class="rbutton">+</span>
											<hr />
											<ol class="textcontent project_manage">
												<h3>何時可以設定實施我的專題課程?</h3>
												<p>您必須在學生註冊之前先開始實施課程，以產生課程授權碼，學生需要您提供此課程授權碼來註冊您的專題課程。</p>

												<h3>實施專題課程要多久?</h3>
												<p>實施專題課程全程為3到10天，請見專題詳細資訊頁面，請注意有些CWISE專題的全程時間
													(預估完成專題的時間)可能會不同，相對於電腦時間(預估在電腦上進行的時間，有些專題可能會包含數天的紙筆測驗)。
												</p>
												<h3>我可以縮短實施專題課程時間為1~2天嗎?</h3>
												<p>建議您不要縮短專題活動時間，因為每個專題都經過精心設計，引導學生進入探究過程，縮短教程將導致學生有較不滿意的學習經驗。</p>
												<h3>如何檢視並為學生的作業評分？</h3>
												<ul>
													<li>請用您的教師帳號名稱/密碼登入</li>
													<li>查看螢幕右方目前正在實施的課程</li>
													<li>在某個課程中點選以步驟評分或小組評分，隨後螢幕將顯示目前所有學生的作業(以顏色標示新的或修改過的作業)，您可寫下評語，學生將在我的作業面板中看到評語，您並可對學生作業評分。
													</li>
													<img class="teach"
														src="/portal/themes/default/images/quicktour/FAQ11.jpg" />
													<!-- <img class="teach" src="/portal/themes/default/images/quicktour/FAQ12.jpg" /> -->
													<p>按照步驟評分</p>
													<img class="teach"
														src="/portal/themes/default/images/quicktour/FAQ13.jpg" />
													<img class="teach"
														src="/portal/themes/default/images/quicktour/FAQ13-1.jpg" /><!-- 
							<p>按照小組評分</p> -->
												</ul>
												<h3>學生如何看到我的評語及他們的作業分數?</h3>
												<ul>
													<li>請學生用他們的帳號密碼登入</li>
													<li>請學生對您的課程點選「執行專題課程」</li>
													<li>當專題載入完成，請學生點選螢幕上方的按鈕「我的作業」</li>
													<li>我的作業螢幕中顯示他們目前分數的摘要，列出他們所有的作業(文字、繪圖、表格…等)，每個作業項目的教師評語/分數。</li>
													<img class="teach"
														src="/portal/themes/default/images/quicktour/FAQ14.jpg" />
													<img class="teach"
														src="/portal/themes/default/images/quicktour/FAQ15.jpg" />
													<img class="teach"
														src="/portal/themes/default/images/quicktour/FAQ16.jpg" />
												</ul>

												<h3>我到哪裡可以找到CWISE專題的課程計畫及標準?</h3>
												<p>在CWISE首頁中點選「管理」按鈕，並點選瀏覽CWISE專題。點選特定專題的藍色標題，再點選「專題重點及內容標準」連結，可檢視專題課程的計畫內容。(註：若教師有附上課程計畫內容才會出現連結）
												</p>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/FAQ17.jpg" />
												<img class="teach"
													src="/portal/themes/default/images/quicktour/FAQ18.jpg" />
												<h3>如何在我的課程中使用CWISE專題?</h3>
												<p>一般來說，學生將受益於一些涵蓋專題主題的前置教學，取決於教師決定是否能幫助學生學習。許多教師將CWISE專題作為課程的統整活動、有些教師整合到課程中教學、有些教師選擇使用CWISE專題作為課程介紹的活動單元，或課程總結的活動單元。
												</p>

												<h3>若我的電腦上機時間用完，但專題課程尚未完成的話該怎麼辦？</h3>
												<p>CWISE是一個線上學習平台，因此學生可以使用學校或家裡的電腦登入，這表示學生可以依據每個老師的規定，在家裡或公用電腦上完成專題課程。
												</p>

												<h3>我忘了我的課程授權碼，如何讓我新的學生建立他們的帳號?</h3>
												<p>登入教師帳號後瀏覽您的實施課程清單，即可查看課程授權碼。這是您設定課程實施後產生的資訊，記住：您必須先設定實施課程，才能讓您的學生註冊帳號並加入這個課程。
												</p>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/FAQ04.jpg" />

												<h3>學生電腦螢幕左邊的導覽列經常會消失，為什麼會發生這種情形？該如何回復？</h3>
												<p>當學生執行專題課程，頁面上方有一個「全螢幕」按鈕，點選之後專題頁面區會占滿螢幕，導覽列則隱藏，學生可用綠色箭頭操作滑鼠，再次點選按鈕「顯示清單」，導覽列將再次回復。
												</p>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/FAQ19.jpg" />
												<img class="teach"
													src="/portal/themes/default/images/quicktour/FAQ20.jpg" />
											</ol>

											<!-- FAQ section3 -->
											<h2>評量學生作業</h2><span id="score_manage" class="rbutton">+</span>
											<hr />
											<ol class="textcontent score_manage">
												<h3>我可以在哪裡找到我學生的作業?</h3>
												<ul>
													<li>使用您的帳號密碼登入教師儀表板</li>
													<li>在右方表格中選擇專題課程中的評分＆工具。</li>
													<img class="teach"
														src="/portal/themes/default/images/quicktour/FAQ11.jpg" />
													<!-- <img class="teach" src="/portal/themes/default/images/quicktour/FAQ12.jpg" /> -->
													<p>按照步驟評分</p>
													<img class="teach"
														src="/portal/themes/default/images/quicktour/FAQ13.jpg" />
													<img class="teach"
														src="/portal/themes/default/images/quicktour/FAQ13-1.jpg" />
												</ul>

												<h3>我該在學生的答案中看些什麼?</h3>
												<p>以下連結提供有絲分裂與細胞突起專題中評分步驟的評分量表範例，評分量表是基於TELS
													中心研究學生如何整合複雜科學概念的知識，我們希望能提供您一些如何設計您的專題步驟及筆記的評分量表構想。</p>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/SampleRubric.png" /><br />
												<h3>我如何鼓勵學生檢視我寫的成績與評語?</h3>
												<p>許多教師發現在專題課程的第一天最後，為頭一、兩個步驟評分的效果比較好。因為下節課一開始，學生會分享課程的答案，並評論作業。接下來當他們登入後，將自動連結到他們的作業，在專題課程開始前，先觀看您的評分及評語。
												</p>
												<h3>我如何找時間為所有學生的作業評分?</h3>
												<p>我們建議您先瀏覽整個專題，並選擇一些步驟，示範您認為學生較難理解的一些複雜概念。您可至評分連結修改每個問題的評分標準。例如：您可設定專題中大部分步驟的分數只有1-2分，但少數步驟的分數卻有20分，然後告訴您的學生必須完成所有問題，並在關鍵問題上多下點功夫。我們發現對每一個步驟嚴謹評分是相當費時的。
												</p>
											</ol>

											<!-- FAQ section4 -->
											<h2>教室即時監測</h2><span id="class_manage" class="rbutton">+</span>
											<hr />
											<ol class="textcontent class_manage">
												<h3>什麼是教室即時監測?</h3>
												<p>教室即時監測可讓您即時觀看學生的進度，教師可以看到學生做到哪個步驟?這位學生在那個步驟做了多久?以及專題的完成度，這些資料都會隨著學生進行專題而即時更新。
												</p>
												<img class="teach"
													src="/portal/themes/default/images/quicktour/FAQ21.jpg" />
												<img class="teach"
													src="/portal/themes/default/images/quicktour/FAQ22.jpg" /> <br />

												<h3>使用教室即時監測的技術需求？</h3>
												<p>教師及學生必須更新電腦的瀏覽器，瀏覽器建議使用Firefox 或Chrome。</p>

												<h3>如何啟動/關閉教室即時監測功能?</h3>
												<p>從「編輯課程設定」的提示視窗中，可隨時「啟動/關閉」課程的教室即時監測功能。</p>
												<h3>教室即時監測功能適用於平板電腦(如:iPad)嗎?</h3>
												<p>可以。</p>
												<h3>我可以使用教室即時監測功能暫停學生進行嗎?</h3>
												<p>可以。</p>

											</ol>
											<!-- FAQ section5 -->
											<h2>技術性問題</h2><span id="tech_manage" class="rbutton">+</span>
											<hr />
											<ol class="textcontent tech_manage">
												<h3>我的網頁瀏覽器無法讀取CWISE的網頁該怎麼辦？</h3>
												<p>請確認您使用的是Firefox網頁瀏覽器，並安裝Javascript，CWISE5目前不完全相容於Internet
													Explorer，請點選選以下的連結，測試您電腦與CWISE5與的相容性：<a
														href="http://cwise.gise.ntnu.edu.tw/pages/check.html"
														target="_blank">相容性測試</a></p>
												<p>如果您看到瀏覽器停止，可能需要清除暫存區資料，請按照此頁的指示： <a
														href="http://www.wikihow.com/Clear-Your-Browser's-Cache"
														target="">如何清除暫存區資料</a></p>

												<h3>我需要多少台電腦運作CWISE平台？</h3>
												<p>我們強烈建議每兩個學生一台電腦，我們從研究中發現學生兩人一組是最有效率的。</p>

												<h3>登入時遇到問題該怎麼辦？</h3>
												<ul>
													<li>若您不記得帳號名稱或密碼，請點選忘記帳號名稱或密碼的連結，並依照指示進行。請注意，您的帳號名稱不可使用空白鍵（不同於CWISE2）。
													</li>
													<li>你可能需要關閉任何可能阻止您瀏覽CWISE的防火牆軟體。</li>
												</ul>
												<h3>請問我可以在CWISE5版本中執行我的CWISE2.0專題嗎？</h3>
												<ul>
													<li>如果您目前在執行CWISE2.0的專題，您需要使用舊版的環境。 (<a
															herf="http://wise2.berkeley.edu"
															target="_blank">http://wise2.berkeley.edu</a>)</li>
													<li><a href="http://cwise.gise.ntnu.edu.tw/contact/contactwise.html"
															target="_blank">您也可以聯繫我們，要求將你的CWISE2專題轉換成5版本。</a></li>
													<li>我們希望提供工具，讓使用者自行將CWISE2專題轉換成CWISE5格式。</li>
												</ul>

											</ol>
											<!-- <p>CWISE教師常見問題，請參考這裡 <a href="http://cwise.gise.ntnu.edu.tw/pages/teacherfaq.html" target="_blank">教師FAQ</a></p> -->

											<h2>其它幫助</h2>
											<hr />
											<p>若您有其它的疑問或是使用CWISE5的問題，您可在CWISE5首頁或教師首頁的「支援」選單裡，點選「<a
													href="http://cwise.gise.ntnu.edu.tw/contact/contactwise.html"
													target="_blank">聯絡CWISE</a>」連結，並記得將問題寫得愈詳細愈好，您將更快獲得解答。</p>

										</div>

									</div>
									<div style="clear: both;"></div>
								</div> <!-- End of page -->

								<%@ include file="../footer.jsp" %>
							</div>

							<script type="text/javascript">
								(function ($) {

									$.fn.hoverpulse = function (options) {
										// in 1.3+ we can fix mistakes with the ready state
										if (this.length == 0) {
											if (!$.isReady && this.selector) {
												var s = this.selector, c = this.context;
												$(function () {
													$(s, c).hoverpulse(options);
												});
											}
											return this;
										}

										var opts = $.extend({}, $.fn.hoverpulse.defaults, options);

										// parent must be relatively positioned
										/* this.parent().css({ position: 'relative' }); */
										// pulsing element must be absolutely positioned
										/* this.css({ position: 'absolute', top: 0, left: 0 }); */

										this.each(function () {
											var $this = $(this);
											var w = $this.width(), h = $this.height();
											$this.data('hoverpulse.size', { w: parseInt(w), h: parseInt(h) });
										});

										// bind hover event for behavior
										return this.hover(
											// hover over
											function () {
												var $this = $(this);
												$this.parent().css('z-index', opts.zIndexActive);

												var size = $this.data('hoverpulse.size');
												var w = size.w, h = size.h;
												var w2 = size.w * opts.ratio, h2 = size.h * opts.ratio;
												$this.stop().animate({
													top: ('-' + h2 + 'px'),
													left: ('-' + w2 + 'px'),
													height: (h2) + 'px',
													width: (w2) + 'px'
												}, opts.speed);
											},
											// hover out
											function () {
												var $this = $(this);
												var size = $this.data('hoverpulse.size');
												var w = size.w, h = size.h;

												$this.stop().animate({
													top: 0,
													left: 0,
													height: (h + 'px'),
													width: (w + 'px')
												}, opts.speed, function () {
													$this.parent().css('z-index', opts.zIndexNormal);
												});
											}
										);
									};

									$.fn.hoverpulse.defaults = {
										/* size: 20, */
										ratio: 2,
										speed: 200,
										zIndexActive: 100,
										zIndexNormal: 1
									};

								})(jQuery);

								// When the DOM is loaded
								$(document).ready(function () {
									$("#require, #register, #execuse, #no_accunt, #have_accunt, #student_manage, #project_manage, #score_manage, #class_manage, #tech_manage").click(function () {
										location.href = '#' + this.id;
										$(this).nextAll("ol:first").slideToggle("slow");
									});
								});
								// When all other things are loaded
								$(window).on("load", function () {
									$('#pageContent img').hoverpulse({
										/* size: 200,  // 圖片縮放大小 */
										ratio: 1.6,  // 圖片縮放比例
										speed: 400 // 圖片變換大小的速度 
									});
									$("#pageContent .textcontent").css({ 'display': 'none' });
								});
							</script>

				</spring:escapeBody>
			</spring:htmlEscape>
		</body>

		</html>