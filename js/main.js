
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
const mainMenu = document.querySelector("#main-menu");

if (menuToggle && mainMenu) {

  menuToggle.addEventListener("click", () => {

    const isOpen = mainMenu.classList.toggle("is-open");

    menuToggle.classList.toggle("is-open", isOpen);

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  });


  mainMenu.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

      mainMenu.classList.remove("is-open");
      menuToggle.classList.remove("is-open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });

}
/* ========================================
   UPDATE POPUP
   ======================================== */

const updatePopup = document.getElementById("updatePopup");
const closeUpdatePopup = document.getElementById("closeUpdatePopup");

if (updatePopup && closeUpdatePopup) {

  // Controlla se il popup è già stato visto
  const popupSeen = sessionStorage.getItem("updatePopupSeen");

  if (popupSeen) {
    updatePopup.classList.add("is-hidden");
  }

  // Chiude il popup
  closeUpdatePopup.addEventListener("click", function () {

    updatePopup.classList.add("is-hidden");

    sessionStorage.setItem(
      "updatePopupSeen",
      "true"
    );

  });

}
