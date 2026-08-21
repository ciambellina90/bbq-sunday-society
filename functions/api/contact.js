export function onRequestGet() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Contact API is running"
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();

    const nome = formData.get("nome");
    const email = formData.get("email");
    const corso = formData.get("corso") || "Non specificato";
    const messaggio = formData.get("messaggio") || "Nessun messaggio";

    // Controllo campi obbligatori
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

    // Invio email tramite Resend
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

        subject: `Nuova richiesta dal sito - ${nome}`,

        html: `
          <h2>Nuova richiesta dal sito</h2>

          <p>
            <strong>Nome:</strong><br>
            ${nome}
          </p>

          <p>
            <strong>Email:</strong><br>
            ${email}
          </p>

          <p>
            <strong>Corso:</strong><br>
            ${corso}
          </p>

          <p>
            <strong>Messaggio:</strong><br>
            ${messaggio}
          </p>
        `
      })
    });

    // Resend ha restituito un errore
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

    // Tutto OK
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
