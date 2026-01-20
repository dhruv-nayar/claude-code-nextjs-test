import { NextResponse } from 'next/server';

// Types
interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
}

// In-memory database (for demo purposes)
// In production, you'd use a real database
let items: Item[] = [
  { id: 1, name: 'Laptop', description: 'High-performance laptop', price: 999.99 },
  { id: 2, name: 'Mouse', description: 'Wireless mouse', price: 29.99 },
  { id: 3, name: 'Keyboard', description: 'Mechanical keyboard', price: 79.99 },
];

// GET /api/items - Get all items
export async function GET() {
  return NextResponse.json(items);
}

// POST /api/items - Create a new item
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.id || !body.name || !body.description || body.price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, description, price' },
        { status: 400 }
      );
    }

    const newItem: Item = {
      id: body.id,
      name: body.name,
      description: body.description,
      price: body.price,
    };

    items.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
