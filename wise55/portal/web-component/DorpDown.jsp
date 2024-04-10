<script>	
	class DropDown extends HTMLElement{
        static style=`
             * {
                font-family: "Noto Sans TC", sans-serif !important;
            }
        /* 容器樣式 */
            .dropdown {
            position: relative;
            display: inline-block;
            }

            /* 按鈕樣式 */
            .dropbtn {
            background-color: #BBE2EC;

            padding: 16px;
            
            border: none;
            cursor: pointer;
            color: #404040;
            font-size: 20px;
            line-height: 1.25;
            }

            /* 預設隱藏下拉內容，並設定顯示時的樣式 */
            .dropdown-content {
            display: none;
            position: absolute;
            background-color: #f9f9f9;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 999;
            }

            /* 下拉選項樣式 */
            .dropdown-content a {
            color: black;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            }

            /* 鼠標懸停時顯示下拉選單內容 */
            .dropdown:hover .dropdown-content {
            display: block;
            }

            /* 鼠標懸停於選項時的背景色變化 */
            .dropdown-content a:hover {
            background-color: #f1f1f1
            }

            /* 按鈕懸停樣式 */
            .dropbtn:hover, .dropbtn:focus {
            background-color: #f9f9f9;
            }
        `
		constructor(){
			super();

			this.attachShadow({mode: 'open'});
            this.render();	
            this.styling();		
		}
        styling(){
            this.stylesheet=document.createElement('style');
            this.shadowRoot.appendChild(this.stylesheet);
            this.stylesheet.textContent = this.constructor.style; 
        }
        render(){
            this.dropdown=document.createElement('div');
            this.shadowRoot.appendChild(this.dropdown);
            this.dropdown.className = "dropdown";

            this.dropbtn=document.createElement('button');
            this.dropdown.appendChild(this.dropbtn);
            this.dropbtn.className = "dropbtn";
            this.dropbtn.textContent = "<spring:message code='index.menu.select3' />";

            this.dropdownContent=document.createElement('div');
            this.dropdown.appendChild(this.dropdownContent);
            this.dropdownContent.className = "dropdown-content";

            
            this.a1=document.createElement('a');
            this.dropdownContent.appendChild(this.a1);
            this.a1.href = "${contextPath}/pages/wise-advantage.html";
            this.a1.textContent = "<spring:message code='index.menu.subselect1' />";

            this.a2=document.createElement('a');
            this.dropdownContent.appendChild(this.a2);
            this.a2.href = "${contextPath}/pages/features.html";
            this.a2.textContent = "<spring:message code='index.menu.subselect2' />";

            this.a3=document.createElement('a');
            this.dropdownContent.appendChild(this.a3);
            this.a3.href = "${contextPath}/contact/contactwise.html";
            this.a3.textContent = "<spring:message code='index.menu.subselect3' />";

            

            
        }

	} 
	customElements.define('drop-down', DropDown);
</script>