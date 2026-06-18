import { NextResponse } from "next/server";

// Simulated Database Connection
const CLINIC_DB = {
  patients: {
    totalToday: 24,
    waiting: 2,
    inTreatment: 2,
    completed: 20,
    recentNames: ["Sarah Mitchell", "David Chen", "Emma Wilson"],
  },
  inventory: {
    totalItems: 142,
    criticalItems: [
      { name: "Endodontic Files (Assorted)", stock: 8, required: 20 },
      { name: "Composite Resin Syringes", stock: 12, required: 15 },
      { name: "Lidocaine HCL 2%", stock: 45, required: 50 },
    ],
  },
  financials: {
    dailyRevenue: "145,000 LKR",
    pendingPayments: 1,
  },
};

export async function POST(req: Request) {
  try {
    const { messages = [] } = await req.json();

    if (!messages.length) {
      return NextResponse.json({
        reply: "How can I help you today?",
      });
    }

    const lastMessage =
      messages[messages.length - 1].content.toLowerCase();

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    let aiResponse = "";

    // PATIENT SUMMARY
    if (
      lastMessage.includes("patient") ||
      lastMessage.includes("summary")
    ) {
      aiResponse = `
Live Patient Summary

• Patients seen today: ${CLINIC_DB.patients.totalToday}
• Waiting: ${CLINIC_DB.patients.waiting}
• In treatment: ${CLINIC_DB.patients.inTreatment}
• Completed: ${CLINIC_DB.patients.completed}

Recent walk-ins:
${CLINIC_DB.patients.recentNames.join(", ")}
`;
    }

    // INVENTORY
    else if (
      lastMessage.includes("inventory") ||
      lastMessage.includes("stock") ||
      lastMessage.includes("insight")
    ) {
      aiResponse =
        `Critical Inventory Alert

Out of ${CLINIC_DB.inventory.totalItems} items, these require attention:

` +
        CLINIC_DB.inventory.criticalItems
          .map(
            (item) =>
              `• ${item.name}: ${item.stock} left (Required ${item.required})`
          )
          .join("\n");
    }

    // REPORTS
    else if (
      lastMessage.includes("report") ||
      lastMessage.includes("billing") ||
      lastMessage.includes("revenue")
    ) {
      aiResponse = `
Daily Financial Report

• Revenue: ${CLINIC_DB.financials.dailyRevenue}
• Pending Payments: ${CLINIC_DB.financials.pendingPayments}
`;
    }

    // GREETINGS
    else if (
      lastMessage.includes("hi") ||
      lastMessage.includes("hello")
    ) {
      aiResponse = `
Hello 👋

I am CarePulse AI Assistant.

You can ask me about:

• Patient Summary
• Inventory Insights
• Financial Reports
`;
    }

    // DEFAULT
    else {
      aiResponse = `
I am connected to the CarePulse system.

Try asking:

• Generate patient summary
• Show inventory insights
• Generate report
• Revenue summary
`;
    }

    return NextResponse.json({
      reply: aiResponse,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return NextResponse.json(
      {
        reply: "Sorry, I couldn't process your request.",
      },
      { status: 500 }
    );
  }
}