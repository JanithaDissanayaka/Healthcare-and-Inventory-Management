import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are CarePulse AI Assistant.

You help hospital staff use the Healthcare & Inventory Management System.

Available modules:
- Dashboard
- Patients
- Doctors
- Appointments
- Inventory
- Suppliers
- Billing
- Reports

Keep answers short and professional.
Do not answer unrelated questions.
`,
        },

        ...messages,
      ],
    });

    return NextResponse.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}