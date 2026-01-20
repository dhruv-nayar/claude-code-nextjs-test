import { NextResponse } from 'next/server';

// Types
interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
}

// Same in-memory database (in production, use a real database)
const items: Item[] = [
  { id: 1, name: 'Laptop', description: 'High-performance laptop', price: 999.99 },
  { id: 2, name: 'Mouse', description: 'Wireless mouse', price: 29.99 },
  { id: 3, name: 'Keyboard', description: 'Mechanical keyboard', price: 79.99 },
];

// GET /api/items/[id] - Get a specific item by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const itemId = parseInt(id);

  if (isNaN(itemId)) {
    return NextResponse.json(
      { error: 'Invalid item ID' },
      { status: 400 }
    );
  }

  const item = items.find((item) => item.id === itemId);

  if (!item) {
    return NextResponse.json(
      { error: 'Item not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(item);
}
