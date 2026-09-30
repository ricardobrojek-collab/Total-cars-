export async function POST(request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages.slice(-20) : [];
    const input = messages
      .filter(m => m && typeof m.text === "string")
      .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

    if (!input.length) {
      return Response.json({ error: "Mensagem vazia." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "OPENAI_API_KEY não configurada." }, { status: 500 });
    }

    const instructions = `Você é o Total Cars AI, um assistente automotivo dentro do site totalcars.ch.
Converse naturalmente como um especialista em diagnóstico automotivo. Mantenha o contexto de toda a conversa.
Responda no idioma do usuário (português ou alemão, salvo se ele pedir outro idioma).
Quando faltarem dados essenciais, faça no máximo 1 ou 2 perguntas objetivas e não repita dados que o usuário já informou.
Diferencie causas prováveis de causas apenas possíveis e sugira verificações práticas em ordem.
Nunca invente códigos de falha, especificações, preços, recalls, peças ou procedimentos.
Se houver risco de segurança (freios, direção, roda, mola quebrada, combustível, superaquecimento grave etc.), recomende não continuar dirigindo até inspeção adequada.
Seja claro e útil, sem afirmar que um diagnóstico remoto é certeza.`;

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        instructions,
        input,
        max_output_tokens: 900
      })
    });

    const data = await r.json();
    if (!r.ok) {
      console.error("OpenAI API error", r.status, data?.error?.code || data?.error?.type);
      return Response.json({ error: "Não foi possível consultar o Total Cars AI agora." }, { status: 502 });
    }

    const text = data.output_text ||
      data.output?.flatMap(item => item.content || []).find(c => c.type === "output_text")?.text;

    if (!text) {
      return Response.json({ error: "A IA não retornou uma resposta." }, { status: 502 });
    }
    return Response.json({ text });
  } catch (error) {
    console.error("Diagnostic API error", error);
    return Response.json({ error: "Erro interno no diagnóstico." }, { status: 500 });
  }
}
