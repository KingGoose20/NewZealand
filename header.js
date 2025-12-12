const scriptPathH = document.currentScript.src;
const scriptH = document.currentScript;
const currentPage = scriptH.dataset.currentPage;
const headerDir = scriptPathH.substring(0, scriptPathH.lastIndexOf("/"));

fetch(`${headerDir}/header.html`)
  .then((r) => r.text())
  .then((html) => {
    const container = document.createElement("div");
    container.innerHTML = html;

    // -----------------------------------------
    // Activate menu
    // -----------------------------------------
    const el = container.querySelector(`#item-${currentPage}`);
    if (el) {
      el.classList.add("current-page");
      el.selected = true;
    }

    // Insert modified header

    document.getElementById("header").innerHTML = container.innerHTML;
    changePage();

    requestAnimationFrame(() => {
      //initMobileMenu();
      //createDropDownMenu();
      const headerEl = document.getElementById("main-header");
      const pageContent = document.getElementById("page-container");

      if (headerEl && pageContent) {
        // Set page padding so content is not hidden
        const headerHeight = headerEl.offsetHeight;
        pageContent.style.paddingTop = headerHeight + "px";

        // Now attach scroll listener safely
        //initHideHeaderOnScroll(headerEl);
      }
    });
  });

// --- Helper functions ---

function initHideHeaderOnScroll(header) {
  if (!header) return;

  let lastScrollY = window.scrollY;
  const threshold = 10;

  window.addEventListener(
    "scroll",
    () => {
      const current = window.scrollY;

      // Always show header if near top
      if (current <= 20) {
        header.classList.remove("header-hidden");
      }
      // scrolling down -> hide
      else if (current > lastScrollY && current > 60) {
        header.classList.add("header-hidden");
      }
      // scrolling up -> show
      else if (lastScrollY - current > threshold) {
        header.classList.remove("header-hidden");
      }

      lastScrollY = current;
    },
    { passive: true }
  );
}

function changePage() {
  document.getElementById('itenary-select').addEventListener('change', function() {
			if (!this.value) return;
			if (this.value.startsWith('#')) {
				const id = this.value.slice(1);
				const el = document.getElementById(id);
				if (el) {
					el.scrollIntoView({behavior: 'smooth'});
					history.replaceState(null, '', this.value);
				}
			} else {
				location.href = this.value;
			}
		});
}