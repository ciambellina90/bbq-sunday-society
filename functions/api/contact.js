function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();

    const nome = formData.get("nome");
    const email = formData.get("email");
    const corso = formData.get("corso") || "Non specificato";
    const messaggio = formData.get("messaggio") || "Nessun messaggio";
    const website = formData.get("website");

    // Honeypot: se compilato, molto probabilmente è uno spam bot
    if (website) {
      return new Response(
        JSON.stringify({
          success: true
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    if (!nome || !email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Nome ed email sono obbligatori."
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Inserisci un indirizzo email valido."
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const safeNome = escapeHtml(nome);
    const safeEmail = escapeHtml(email);
    const safeCorso = escapeHtml(corso);
    const safeMessaggio = escapeHtml(messaggio).replaceAll("\n", "<br>");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "BBQ Sunday Society <website@bbqsundaysociety.it>",
        to: [
          "info@bbqsundaysociety.it"
        ],
        reply_to: email,
        subject: `Nuova richiesta dal sito - ${safeNome}`,
        html: `
          <h2>Nuova richiesta dal sito</h2>

          <p>
            <strong>Nome:</strong><br>
            ${safeNome}
          </p>

          <p>
            <strong>Email:</strong><br>
            ${safeEmail}
          </p>

          <p>
            <strong>Corso:</strong><br>
            ${safeCorso}
          </p>

          <p>
            <strong>Messaggio:</strong><br>
            ${safeMessaggio}
          </p>
        `
      })
    });

    if (!response.ok) {
      const error = await response.text();

      console.error("Resend error:", error);

      return new Response(
        JSON.stringify({
          success: false,
          message: "Errore durante l'invio della richiesta."
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Richiesta inviata."
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error("Contact form error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Errore interno."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
