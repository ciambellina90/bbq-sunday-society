
const form = document.querySelector("#contact-form");

if (form) {
  const submitButton = form.querySelector(".form-submit");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Invio in corso...";

    try {
      const formData = new FormData(form);

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Errore durante l'invio."
        );
      }

      form.reset();

      submitButton.textContent = "Richiesta inviata ✓";

      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 4000);

    } catch (error) {
      console.error("Errore modulo:", error);

      submitButton.textContent = "Errore. Riprova.";

      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 4000);
    }
  });
}

/* ========================================
   MOBILE MENU
   ======================================== */

const menuToggle = document.querySelector(".menu-toggle");
const mainMenu = document.querySelector(".site-header .menu");

if (menuToggle && mainMenu) {

  menuToggle.addEventListener("click", function () {

    const isOpen = mainMenu.classList.toggle("menu-open");

    menuToggle.classList.toggle("active", isOpen);

    menuToggle.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Chiudi menu" : "Apri menu"
    );

  });


  /* Chiudi il menu quando clicco su una voce */

  mainMenu.querySelectorAll("a").forEach(function (link) {

    link.addEventListener("click", function () {

      mainMenu.classList.remove("menu-open");
      menuToggle.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Apri menu");

    });

  });

}
