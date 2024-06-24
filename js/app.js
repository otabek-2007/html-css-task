document.addEventListener("DOMContentLoaded", function () {
  let headerIframe = document.getElementById("headerIframe");

  headerIframe.addEventListener("load", function () {
    let headerDocument =
      headerIframe.contentDocument || headerIframe.contentWindow.document;
    let selectElements = headerDocument.querySelectorAll(".selection");

    selectElements.forEach((selectElement) => {
      selectElement.addEventListener("change", function () {
        let selectedValue = this.value;
        document.getElementById("showPage").src = selectedValue;
      });
    });
  });
});
