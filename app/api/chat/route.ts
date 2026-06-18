import { NextResponse } from "next/server";

// Simulated Database Connection
const CLINIC_DB = {
  patients: {
    totalToday: 24,
    waiting: 2,
    inTreatment: 2,
    completed: 20,
    recentNames: ["Sarah Mitchell", "David Chen", "Emma Wilson"]
  },
  inventory: {
    totalItems: 142,
    criticalItems: [
      { name: "Endodontic Files (Assorted)", stock: 8, required: 20 },
      { name: "Composite Resin Syringes", stock: 12, required: 15 },
      { name: "Lidocaine HCL 2%", stock: 45, required: 50 }
    ]
  },
  financials: {
    dailyRevenue: "145,000 LKR",
    pendingPayments: 1
  }
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content.toLowerCase();

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    let aiResponse = "";

    // AI LOGIC ENGINE: Match user intent to the "Database"
    if (lastMessage.includes("patient") || lastMessage.includes("summary")) {
      aiResponse = `**Live Patient Summary:**\nWe have seen ${CLINIC_DB.patients.totalToday} patients today. Currently, there are ${CLINIC_DB.patients.waiting} patients in the waiting room and ${CLINIC_DB.patients.inTreatment} in treatment.\n\n*Recent Walk-ins: ${CLINIC_DB.patients.recentNames.join(", ")}.*`;
    
    } else if (lastMessage.includes("inventory") || lastMessage.includes("stock") || lastMessage.includes("insight")) {
      aiResponse = `**Critical Inventory Alert:**\nOut of ${CLINIC_DB.inventory.totalItems} catalog items, **3** require immediate restocking:\n\n` +
        CLINIC_DB.inventory.criticalItems.map(item => `- ${item.name}: ${item.stock} left (Needs ${item.required})`).join('\n') +
        `\n\nWould you like me to generate a purchase order for these?`;
    
    } else if (lastMessage.includes("report") || lastMessage.includes("billing") || lastMessage.includes("revenue")) {
      aiResponse = `**Daily Financial Report:**\nTotal settled cash flow for today is **${CLINIC_DB.financials.dailyRevenue}**. There is currently ${CLINIC_DB.financials.pendingPayments} patient awaiting checkout at the front desk.`;
    
    } else {
      aiResponse = "I am connected to the CarePulse database. You can ask me for a **Patient Summary**, **Inventory Insights**, or **Financial Reports**.";
    }

    return NextResponse.json({
      role: "assistant",
      content: aiResponse
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}