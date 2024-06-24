let headerIframe = document.getElementById("headerIframe");
let salom = document.querySelector(".salom");
headerIframe.addEventListener("load", function (e) {
  let headerDocument = headerIframe.contentDocument;

  let selectElements = headerDocument.querySelectorAll(".selection");
  let bottom = headerDocument.querySelector(".bottom");
  let middleText = headerDocument.querySelector(".middle-text");

  let gamburger = headerDocument.querySelector(".gamburger");
  let select = headerDocument.querySelector(".select-page");
  selectElements.forEach((selectElement) => {
    selectElement.addEventListener("change", function () {
      let selectedValue = this.value;
      document.getElementById("showPage").src = selectedValue;
    });
  });
  middleText.addEventListener("click", function () {
    document.getElementById("showPage").src =
      "/page/markaz_tarixi/muassasa_yangiliklari.html";
  });
  gamburger.addEventListener("click", function () {
    headerIframe.classList.toggle("active-header");
    bottom.classList.toggle("active-bottom");
    select.classList.toggle("active-select");
  });
});
