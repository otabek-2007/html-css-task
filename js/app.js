import menus from "./menus.js";

// src code controlle boladigan joyi yani showPage ni aylantiradigan joy
function loadIframe(src = null, activeMenu = null) {
  const menu = activeMenu || menus[0];
  sessionStorage.setItem("menu_bar", JSON.stringify(menu));
  let source;
  if (src) {
    sessionStorage.setItem("src", src);
    source = src;
  } else {
    source =
      sessionStorage.getItem("src") || "/page/ochiq_malumotlar/deponental.html";
  }
  document.getElementById("showPage").src = source;
}

function createBar() {
  const bar = JSON.parse(sessionStorage.getItem("menu_bar"));

  const bodyBar = document.createElement("div");
  bodyBar.className = "body-bar";

  const titleBar = document.createElement("p");
  titleBar.className = "title-bar";
  titleBar.textContent = bar.name;

  const img = document.createElement("img");
  img.className = "bar-underline";
  img.src = "/image/markaz_tarixi/line_bar.png";

  const showOption = document.createElement("div");
  showOption.className = "show-options-container";
  const showOptionChild = document.createElement("div");
  showOptionChild.className = "show-options-child";

  bar.children.forEach((e) => {
    let src = sessionStorage.getItem("src");

    if (e.children) {
      const span = document.createElement("span");
      span.textContent = e.name;
      showOption.appendChild(span);
      span.className = "has-child-span";
      e.children.forEach((childElement) => {
        const spanChild = document.createElement("span");
        const activeLine = document.createElement("span");
        activeLine.className = "active-line-span";

        if (childElement.src === src) {
          spanChild.className = "child-span-bar active-child-bar active-bar";
        } else {
          spanChild.className = "child-span-bar";
        }
        spanChild.setAttribute("src", childElement.src);
        spanChild.textContent = childElement.name;
        spanChild.appendChild(activeLine);
        span.appendChild(spanChild);
      });
    } else {
      const span = document.createElement("span");
      const activeLine = document.createElement("span");
      activeLine.className = "active-line-span";
      if (e.src === src) {
        span.className = "span-bar active-bar";
        activeLine.style.display = "flex";
      } else {
        span.className = "span-bar";
      }
      span.setAttribute("src", e.src);
      span.textContent = e.name;
      span.appendChild(activeLine);
      showOption.appendChild(span);
    }
  });

  bodyBar.appendChild(titleBar);
  bodyBar.appendChild(img);

  const options = document.createElement("div");
  options.className = "bar-options";
  options.appendChild(showOption);
  options.appendChild(showOptionChild);

  bodyBar.appendChild(options);

  const iframe = document.getElementById("showPage");
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  const mainBar = iframeDoc.querySelector(".body-main");
  mainBar.appendChild(bodyBar);

  const spans = iframeDoc.querySelectorAll(".span-bar");

  spans.forEach((span) => {
    span.addEventListener("click", function (e) {
      loadIframe(e.target.getAttribute("src"));
    });
  });
}

// json datagai itemlarni create qilib beradigan joy

function createMenuItems(menus, parentUl) {
  menus.forEach((menu) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    div.className = "li-content";

    const img = document.createElement("img");
    img.src =
      menu.children && menu.children.length > 0 ? "/image/drop_down.png" : "";
    img.className = "menu-icon";

    const span = document.createElement("span");
    const activeLineLi = document.createElement("span");
    activeLineLi.className = "active-li-line";
    span.textContent = menu.name;

    div.appendChild(span);
    div.appendChild(img);
    li.appendChild(div);
    li.appendChild(activeLineLi);
    parentUl.appendChild(li);

    li.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = li.classList.contains("li-active-menu");

      const allMenuItems = parentUl.querySelectorAll("li");
      allMenuItems.forEach((menuItem) => {
        menuItem.classList.remove("li-active-menu");
      });

      if (!isOpen) {
        li.classList.add("li-active-menu");

        if (menu.src) {
          loadIframe(menu.src, menu);
        }
      }
    });

    if (menu.children && menu.children.length > 0) {
      const popupDiv = document.createElement("div");
      popupDiv.className = "popup-li-content";
      popupDiv.style.display = "none";

      const childUl = document.createElement("ul");
      childUl.className = "child-ul-content";

      createMenuChildItems(menu.children, childUl, menu);
      popupDiv.appendChild(childUl);
      div.appendChild(popupDiv);

      div.addEventListener("click", (event) => {
        event.stopPropagation();

        const allPopups = document.querySelectorAll(".popup-li-content");
        allPopups.forEach((popup) => {
          popup.style.display = "none";
        });

        popupDiv.style.display =
          popupDiv.style.display === "block" ? "none" : "block";
      });
    }
  });
}

// json datadagi item ning child bolsa yani child -> child ni create qiladigan joy
function createMenuChildItems(menus, parentUl, parentMenu) {
  menus.forEach((menu) => {
    const li = document.createElement("li");
    li.setAttribute("src", menu.src);

    const div = document.createElement("div");
    div.className = "child-content-box";

    const img = document.createElement("img");
    const divLine = document.createElement("div");

    img.src =
      menu.children && menu.children.length > 0
        ? "/image/drop_down_right.png"
        : "";
    divLine.className = "child-menu-icon";
    img.className = "child-menu-drop";

    const span = document.createElement("span");
    span.textContent = menu.name;

    div.appendChild(span);
    div.appendChild(divLine);
    div.appendChild(img);
    li.appendChild(div);
    parentUl.appendChild(li);

    li.addEventListener("click", (event) => {
      event.stopPropagation();
      const src = event.currentTarget.getAttribute("src");
      if (src) {
        loadIframe(src, parentMenu);
        closeAllMenus();
      }
    });

    if (menu.children && menu.children.length > 0) {
      const childUl = document.createElement("ul");
      childUl.className = "child-ul-content-in";
      childUl.style.display = "none";

      createMenuChildItems(menu.children, childUl, parentMenu);
      li.appendChild(childUl);

      div.addEventListener("click", (event) => {
        event.stopPropagation();
        childUl.style.display =
          childUl.style.display === "block" ? "none" : "block";
      });
    }
  });
}

// responsivlik uchun gamburger active olishi uchun
document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.getElementById("menu-container");
  createMenuItems(menus, menuContainer);

  const gamburger = document.querySelector(".gamburger");
  const footerContainer = document.querySelector(".footer-active");
  const footerAdd = document.querySelector(".footer-add-btn");
  const middleText = document.querySelector(".middle-text");

  middleText.addEventListener("click", function () {
    let src = "/page/markaz_tarixi/muassasa_yangiliklari.html";
    let source = sessionStorage.getItem("src");
    source == src;
  });

  gamburger.addEventListener("click", (event) => {
    event.stopPropagation();
    menuContainer.classList.toggle("active");
  });

  footerAdd.addEventListener("click", (event) => {
    event.stopPropagation();
    footerContainer.classList.toggle("active");
  });

  window.addEventListener("click", (event) => {
    if (!footerContainer.contains(event.target)) {
      if (footerContainer.classList.contains("active")) {
        footerContainer.classList.remove("active");
      }
    }
    closeAllMenus();
  });

  loadIframe();
});

const responsive_widths = [800, 1200];

window.addEventListener("resize", () => {
  const width = document.body.clientWidth;
  setFlexibleHeight();
});

document.getElementById("showPage").onload = function () {
  createBar();
  setFlexibleHeight();
};

function setFlexibleHeight() {
  const t = document.getElementById("showPage");
  t.style.height = t.contentWindow.document.documentElement.scrollHeight + "px";
}

function closeAllMenus() {
  const allPopups = document.querySelectorAll(".popup-li-content");
  allPopups.forEach((popup) => {
    popup.style.display = "none";
  });

  const allChildMenus = document.querySelectorAll(".child-ul-content-in");
  allChildMenus.forEach((childMenu) => {
    childMenu.style.display = "none";
  });
}

const menuContainer = document.getElementById("menu-container");
menuContainer.addEventListener("click", (event) => {
  event.stopPropagation();
});

const footerContainer = document.querySelector(".footer-active");
footerContainer.addEventListener("click", (event) => {
  event.stopPropagation();
});

window.addEventListener("click", (event) => {
  const isHeaderClick = event.target.closest("#menu-container");
  const isFooterClick = event.target.closest(".footer-active");

  if (!isHeaderClick && !isFooterClick) {
    closeAllMenus();
  }
});

const iframe = document.getElementById("showPage");
iframe.addEventListener("load", () => {
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  iframeDoc.addEventListener("click", (event) => {
    const isMenuClick = event.target.closest("#menu-container");
    if (!isMenuClick) {
      closeAllMenus();
    }
  });
});
