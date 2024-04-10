<script>
class NewItem extends HTMLElement{
    static style=`
    * {
                font-family: "Noto Sans TC", sans-serif !important;
            }
        .box{
            padding: 0.5rem;
        }
        .text{
            margin-block:0.5rem;
            font-size: 1.5rem !important;
            text-align: center;
            color:black
        }
        .pic{
            width: 100%;
            display: block;
            margin: 0 auto;
        }
    `;
    constructor(){
        super();
        this.attachShadow({mode:'open'});
        this.render();
        this.styling();
    }
    createElementWithAttributes(type, attributes) {
        const element = document.createElement(type);
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        return element;
    }

    render(){
        this.box = this.createElementWithAttributes('div', {class: 'box'});
        this.shadowRoot.appendChild(this.box);
        
        this.pic = this.createElementWithAttributes('img', {src: this.getAttribute('picSrc'),
        class:"pic"});
        this.box.appendChild(this.pic);

        this.text = this.createElementWithAttributes('h5', {class:'text'});
        this.text.textContent = this.getAttribute('titleText');
        this.box.appendChild(this.text);
    }
    styling(){
        this.stylesheet=document.createElement('style');
        this.stylesheet.textContent=this.constructor.style;
        this.shadowRoot.appendChild(this.stylesheet);
    }

}
window.customElements.define('new-item',NewItem);
</script>