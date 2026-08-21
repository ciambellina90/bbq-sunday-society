
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
