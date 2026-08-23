(function () {
  const btn = document.querySelector("[data-menu]");
  const links = document.querySelector("[data-nav]");
  if (btn && links) {
    btn.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  const path = location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll("[data-nav] a").forEach(function (anchor) {
    const href = anchor.getAttribute("href") || "";
    if (!href || href.startsWith("http") || href.startsWith("#")) return;
    const normalized = href.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
    if (path.endsWith(normalized) || path.endsWith(normalized + "/index.html")) {
      anchor.classList.add("active");
    }
  });

  const hash = location.hash.slice(1);
  if (hash) {
    const target = document.getElementById(hash);
    if (target) target.scrollIntoView({ block: "start" });
  }

  document.querySelectorAll("[data-wiki-nav] a").forEach(function (anchor) {
    anchor.addEventListener("click", function () {
      document.querySelectorAll("[data-wiki-nav] a").forEach(function (item) {
        item.classList.remove("active");
      });
      anchor.classList.add("active");
    });
    if (hash && anchor.getAttribute("href") === "#" + hash) {
      anchor.classList.add("active");
    }
  });
})();
