document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const menuIcon = menuToggle ? menuToggle.querySelector("span") : null;

  if (!menuToggle || !mobileNav) {
    return;
  }

  const openLabel = "Abrir menú de navegación";
  const closeLabel = "Cerrar menú de navegación";
  const menuIconOpen = "menu";
  const menuIconClose = "close";

  const closeMenu = () => {
    mobileNav.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", openLabel);
    if (menuIcon) {
      menuIcon.textContent = menuIconOpen;
    }
  };

  const openMenu = () => {
    mobileNav.classList.remove("hidden");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", closeLabel);
    if (menuIcon) {
      menuIcon.textContent = menuIconClose;
    }
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      closeMenu();
      return;
    }

    openMenu();
  });

  mobileNav.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    const isClickInsideNav = mobileNav.contains(target);
    const isClickInsideToggle = menuToggle.contains(target);

    if (!isClickInsideNav && !isClickInsideToggle && !mobileNav.classList.contains("hidden")) {
      closeMenu();
    }
  });
});
