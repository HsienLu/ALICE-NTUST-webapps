<script>
    class PageContentCard extends HTMLElement{
        constructor(){
            super();
            this.attachShadow({mode:'open'});
            this.render();
            this.styling();
        }
        static style=`
        img{
            max-width:300px;
        }
        h4{
            color:blue;
            font-size:1.75rem;
            margin-top:0;
            margin-bottom:1rem;
        }
        p{
            font-size:1.5rem;
            color:#787878;
            line-height:2;

        }
        .card{
            display:flex;
            gap:5rem;
            margin-bottom:2rem;
        }
  
        `
        render(){
            this.card=document.createElement('div');
            this.card.className='card';
            this.shadowRoot.appendChild(this.card);

            this.imgBox=document.createElement('div');
            this.imgBox.className='img-box';
            this.card.appendChild(this.imgBox);

            this.pic=document.createElement('img');
            this.pic.src=this.getAttribute('picSrc');
            this.imgBox.appendChild(this.pic);

            this.textBox=document.createElement('div');
            this.textBox.className='text-box';
            this.card.appendChild(this.textBox);

            this.titleText=document.createElement('h4');
            this.titleText.textContent=this.getAttribute('titleText');
            this.textBox.appendChild(this.titleText);

            this.contentText=document.createElement('p');
            this.contentText.textContent=this.getAttribute('contentText');
            this.textBox.appendChild(this.contentText);

        }
        styling(){
            this.stylesheet=document.createElement('style');
            this.shadowRoot.appendChild(this.stylesheet);
            this.stylesheet.textContent=this.constructor.style

            this.card.style.flexDirection=this.getAttribute('flexDirection');
        }

    }
    customElements.define('page-content-card',PageContentCard);
</script>