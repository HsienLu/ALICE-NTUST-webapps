
/*       getQueryString54 = function () {
            var reg = new RegExp("\/run\/([0-9]+)#");
            if (r = window.location.href.match(reg)) return unescape(r[1]); return null;
        };
	
        function showname54(link) {
            var _fullname = "";
            var team = document.getElementsByClassName("account-menu__info__team ng-scope");
            if (team.length > 0) {
                _fullname = team[0].getAttribute("translate-value-id");
            }
            link += "?loginID=" + _fullname + "&runId=" + getQueryString54();
            window.open(link);
        }
*/	
        getQueryString = function () {
            var reg = new RegExp("\/run\/([0-9]+)#");
            if (r = window.location.href.match(reg)) return unescape(r[1]); return null;
        };
        getNodeString = function () {
            var reg = new RegExp("\/vle\/([0-9.\-A-Za-z]+)");
            if (r = window.location.href.match(reg)) return unescape(r[1]); return null;
        };	
        function showname(link) {
            var _fullname = "";
            var team = document.getElementsByClassName("md-list-item-text")[document.getElementsByClassName("md-list-item-text").length-1].getElementsByClassName("ng-binding ng-scope");

            if (team.length > 0) {
                var reg = new RegExp("(.+)<!--");
                var r = team[0].innerHTML.match(reg);
                if(r){if(r.length>1){_fullname = r[1];}}
            }
            link += "?userID=6&userRole=1&channel=3&loginID=" + _fullname + "&runId=" + getQueryString()+ "&userName="+ _fullname+ "&nodeId=" + getNodeString();
            console.log(link);
            return link;
        }
/* 		
        function tostep(node) {
            //var link="http://140.122.146.120/cwise/student/run/";
            var link="";
            var reg = new RegExp("(.+\/node)");
            if (r = window.location.href.match(reg)){
                link= r[1];}
            //link += getQueryString()+"#/vle/node"+node;
            link+=node;
            location.href=link;
        }
		
        window.onload = function () {
        }
*/            
		document.getElementById("myframe").src = showname("http://cwiselab.gise.ntnu.edu.tw/chat/api/talkstep1.php");