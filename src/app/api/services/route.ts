import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const services = await db
      .collection("services")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, image, category, price, offer } = body;

    if (!name || !description || !image || price === undefined || price === null) {
      return NextResponse.json(
        { error: "Name, description, image and price are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const service = {
      name,
      description,
      image,
      category: category || "Showpiece",
      price,
      offer: offer || null,
      createdAt: new Date(),
    };

    const result = await db.collection("services").insertOne(service);

    return NextResponse.json({
      ...service,
      _id: result.insertedId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
