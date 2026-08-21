export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();

    const nome = formData.get("nome");
    const email = formData.get("email");
    const corso = formData.get("corso") || "Non specificato";
    const messaggio = formData.get("messaggio") || "Nessun messaggio";

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

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",

      headers: {
        "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        from: "BBQ Sunday Society <website@bbqsundaysociety.it>",
        to: ["info@bbqsundaysociety.it"],

        reply_to: email,

        subject: `Nuova richiesta dal sito — ${nome}`,

        html: `
          <h2>Nuova richiesta dal sito</h2>

          <p><strong>Nome:</strong> ${nome}</p>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Corso:</strong> ${corso}</p>

          <p><strong>Messaggio:</strong></p>

          <p>${messaggio}</p>
        `
      })
    });

    if (!response.ok) {
      const error = await response.text();

      console.error("Resend error:", error);

      return new Response(
        JSON.stringify({
          success: false,
          message: "Errore durante l'invio."
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
        success: true
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error(error);

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
