
<script>
    class CurseIntroduction extends HTMLElement{
    
            static style=`
            div{
                color: black;
                width: 100%;
            }
            h5{
                color:#404040;
                font-size: 1.5rem;
                margin: 0 auto;
                text-align: center;
            }
            .box{
                display:flex;

                margin-top:1rem
            }
            .text-box{
                padding-right: 1rem;
            }
            p{
                font-family: "Trebuchet MS", "Lucida Grande", "Lucida San Unicode", "Gill Sans", Helvetica, Arial;
                font-size: 1.25rem;
            }
            img{
                
            }
            `
        constructor(){
            super();
            this.attachShadow({mode: 'open'});
            this.render();
            this.styling();
            this.styleFlexDir();
        }
        styleFlexDir(){
            
            if(this.getAttribute('flexDirection') == 'reverse-row'){
                this.box.style.flexDirection = 'row-reverse';
            }
        }
        render(){
    
            this.box = document.createElement('div');
            this.shadowRoot.appendChild(this.box);
            this.box.className = "box";
            
    
            this.textbox = document.createElement('div');
            this.textbox.className = "text-box";
            this.box.appendChild(this.textbox);
    
            this.textTitle = document.createElement('h5');
            this.textTitle.textContent = this.getAttribute('textTitle');
            this.textbox.appendChild(this.textTitle);
    
    
            this.text = document.createElement('p');
            this.text.textContent = this.getAttribute('textContent');
            this.textbox.appendChild(this.text);
    
            this.pic = document.createElement('img');
            this.pic.src = this.getAttribute('picSrc');
            this.box.appendChild(this.pic);
    
    
    
        }
        styling(){
            this.stylesheet = document.createElement('style');
            this.stylesheet.textContent = this.constructor.style;
            this.shadowRoot.appendChild(this.stylesheet);
    
        }
    
    }
    window.customElements.define('curse-introduction',CurseIntroduction);
</script>
    