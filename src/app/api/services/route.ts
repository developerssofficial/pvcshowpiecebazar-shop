import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const db = await getDb();

    if (id) {
      const { ObjectId } = await import("mongodb");
      let filter: Record<string, unknown> = {};
      if (ObjectId.isValid(id)) {
        filter = { _id: new ObjectId(id) };
      } else {
        filter = { _id: id };
      }
      const service = await db.collection("services").findOne(filter);
      if (!service) {
        return NextResponse.json({ error: "Service not found" }, { status: 404 });
      }
      return NextResponse.json(service);
    }

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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { ObjectId } = await import("mongodb");
    const db = await getDb();
    const result = await db
      .collection("services")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const { ObjectId } = await import("mongodb");
    const db = await getDb();

    const result = await db
      .collection("services")
      .updateOne({ _id: new ObjectId(id) }, { $set: body });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, image, category, price, offer, inStock } = body;

    if (!name || !description || !image) {
      return NextResponse.json(
        { error: "Name, description, and image are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const service = {
      name,
      description,
      image,
      category: category || "Showpiece",
      price: price ?? null,
      offer: offer || null,
      inStock: inStock !== false,
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
