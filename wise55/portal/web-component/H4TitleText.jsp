<script>
    class H4TitleText extends HTMLElement{
        static stylesheet=`
            * {
                font-family: "Noto Sans TC", sans-serif !important;
            }
            h4{
                padding-top:0.25rem;
			    margin-block:1.5rem; 
			    font-size: 2rem;
			    line-height: 1.5;color: #404040;
			    font-weight: bold !important;
			    text-align: left;
            }
        `;

        constructor(){
            super();
            this.attachShadow({mode:'open'});
            this.render();
            this.styling();
        }
        render(){
            this.text=document.createElement('h4');
            this.shadowRoot.appendChild(this.text);
            this.text.textContent=this.getAttribute('titleText');
        }
        styling(){
            this.stylesheet=document.createElement('style');
            this.stylesheet.textContent=this.constructor.stylesheet;
            this.shadowRoot.appendChild(this.stylesheet);
        }

    }
    window.customElements.define('h4-title-text',H4TitleText);
</script>