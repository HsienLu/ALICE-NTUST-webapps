<script>
    class CurseCard extends HTMLElement{
        static styles=`
    
            h4{
                color:#404040;
                font-size: 1.5rem;
                margin: 0 auto;
                text-align: center;
                padding:0.5rem;
                background-color:#FFF6E9;
            }
    
            img{
                display: block;
                margin: 0 auto;
                width: 80%;
                padding:0.5rem;
            }
            a div{
                
                background-color:#BBE2EC;
            }
            .box{
                margin: 0 auto;
                width: 80%;
            }
        `;
        constructor(){
            super();
            this.render();
            this.styling();
            
        }
        render(){
            this.attachShadow({mode: 'open'});
    
            this.box=document.createElement('div');
            this.shadowRoot.appendChild(this.box);
            this.box.className = "box";
            this.attach=document.createElement('a');
            this.box.appendChild(this.attach);
            
    
            this.picBox=document.createElement('div');
            this.attach.appendChild(this.picBox);
    
            this.pic=document.createElement('img');
            this.picBox.appendChild(this.pic);
            this.pic.src=this.getAttribute('picSrc');
    
            this.titleText=document.createElement('h4');
            this.titleText.textContent=this.getAttribute('titleText');
            this.attach.appendChild(this.titleText);
    
            
    
        }
        styling(){
            
            this.stylesheet=document.createElement('style');
            this.stylesheet.textContent=this.constructor.styles;
            this.shadowRoot.appendChild(this.stylesheet);
        }
    }
    window.customElements.define('curse-card',CurseCard);
</script>