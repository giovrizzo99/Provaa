(function () {
    let template = document.createElement("template");
    template.innerHTML = `
      <style>
      .name {
          font-family: Arial, sans-serif;
          color: green;
      }
      iframe {
          width: 100%;
          height: 500px;
          border: none;
      }
      </style>
      <h1 id="title" class="name">Statement</h1>
      <div>
          <iframe id="base64"></iframe>
      </div>
    `;

    class TestWidget extends HTMLElement {
        constructor() {
            super();
            let shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(template.content.cloneNode(true));
            this._props = {};
        }

        async connectedCallback() {
            this.initMain();
        }

        async fetchBase64Pdf(url) {
            try {
                let response = await fetch(url);
                let text = await response.text();
                this.setAttribute("base64", text.trim());
            } catch (error) {
                console.error("Error fetching Base64 PDF:", error);
            }
        }

        initMain() {
            let rawGithubUrl = "https://raw.githubusercontent.com/giovrizzo99/Provaa/refs/heads/main1/PROVA_base64.txt";
            this.fetchBase64Pdf(rawGithubUrl);
            let base64 = this._props.base64 || this.getAttribute("base64");
            if (base64) {
                this.updatePdf(base64);
            }
        }

        updatePdf(base64) {
            let iframe = this.shadowRoot.querySelector("#base64");
            iframe.src = "data:application/pdf;base64," + base64;
        }

        static get observedAttributes() {
            return ["base64"];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === "base64" && newValue) {
                this._props.base64 = newValue;
                this.updatePdf(newValue);
            }
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            this._props = { ...this._props, ...changedProperties };
        }

        onCustomWidgetAfterUpdate() {
            this.initMain();
        }
    }

    customElements.define("com-gr-sap-test-base64", TestWidget);
})();
