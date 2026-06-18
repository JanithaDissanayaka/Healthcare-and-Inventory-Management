import { NextResponse } from 'next/server';

export async function GET() {
  // Simulating a database fetch for Inventory and Suppliers
  const data = {
    stats: {
      totalProducts: 142,
      lowStockCount: 3,
      activeSuppliers: 8,
      pendingOrders: 4
    },
    inventory: [
      { id: 101, name: 'Lidocaine HCL 2%', category: 'Anesthetics', stock: 45, minThreshold: 50, unit: 'Vials', status: 'Low Stock' },
      { id: 102, name: 'Nitrile Examination Gloves (M)', category: 'PPE', stock: 120, minThreshold: 30, unit: 'Boxes', status: 'In Stock' },
      { id: 103, name: 'Composite Resin Syringes', category: 'Restorative', stock: 12, minThreshold: 15, unit: 'Units', status: 'Low Stock' },
      { id: 104, name: 'Surgical Face Masks (Level 3)', category: 'PPE', stock: 350, minThreshold: 100, unit: 'Boxes', status: 'In Stock' },
      { id: 105, name: 'Endodontic Files (Assorted)', category: 'Endodontics', stock: 8, minThreshold: 20, unit: 'Packs', status: 'Critical' },
      { id: 106, name: 'Dental Alginate Impression Material', category: 'Materials', stock: 24, minThreshold: 10, unit: 'Bags', status: 'In Stock' }
    ],
    suppliers: [
      { id: 1, name: 'MediSupply Co.', type: 'General Dental Supplies', phone: '011 234 5678', leadTime: '2 Days', rating: 4.8 },
      { id: 2, name: 'Apex Ortho Labs', type: 'Orthodontic Brackets & Wires', phone: '077 987 6543', leadTime: '5 Days', rating: 4.5 },
      { id: 3, name: 'Global PPE Imports', type: 'Gloves, Masks & Sanitizers', phone: '071 555 4444', leadTime: '1 Day', rating: 4.9 }
    ]
  };

  return NextResponse.json(data);
}