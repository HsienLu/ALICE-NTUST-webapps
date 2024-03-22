<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>

  <script src="./tw341.js"></script>
  <style type="text/tailwindcss">
    @layer utilities {
      .content-auto {
        content-visibility: auto;
      }
    }
  </style>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            clifford: '#CCC',
          }
        }
      }
    }
  </script>
</head>

<body>
  <div class="lg:content-auto">

    <h1 class=" font-bold underline text-clifford">hello</h1>
  </div>
  <div class="panelHead" style="height: 200px;width: 500px;">
    <span>
      <spring:message code="index.whatIsWise" />
    </span>
  </div>
  <div class="showcase">
    <div id="about">
      <div class="panelHead"><span style="position:absolute;top:62px">
          <spring:message code="index.whatIsWise" />
        </span></div>
      <h4 style="margin-right:1rem;padding-top:0.25rem">
        <spring:message code="index.curse.title" />
      </h4>

    </div>

  </div>
  <my-button></my-button>
  <script>
    //建立按鈕組件
    class MyButton extends HTMLElement {
      static style = `                    .btn{
                        display:inline-block;
                        color:white;
                        background-color:#333333;
                        padding:10px;
                    }`;
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        //套用組件內部的樣式
        this.styling();
        //設計<my-button>的畫面
        this.render();
      }

      styling() {
        this.stylesheet = document.createElement('style');
        this.stylesheet.textContent = this.constructor.style;
        this.shadowRoot.appendChild(this.stylesheet);
      }
      render() {
        this.btn = document.createElement('div');
        this.btn.className = 'btn';
        this.btn.textContent = 'Click me';
        this.shadowRoot.appendChild(this.btn);
      }
    }
    //組件外部
    window.customElements.define('my-button', MyButton);
  </script>
</body>

</html>