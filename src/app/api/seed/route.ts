import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const initialServices = [
  {
    name: "Custom PVC Showpiece",
    description: "আপনার পছন্দমতো কাস্টমাইজড PVC শোপিস তৈরি করি।",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Custom%20handcrafted%20PVC%20showpiece%20beautiful%20sculpture%20on%20white%20background%20product%20photography&image_size=square",
    category: "Showpiece",
  },
  {
    name: "Name Showpiece",
    description: "আপনার নাম দিয়ে তৈরি বিশেষ PVC শোপিস।",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=PVC%20name%20showpiece%20decorative%20nameplate%20elegant%20on%20white%20background%20product%20photography&image_size=square",
    category: "Showpiece",
  },
  {
    name: "Couple Showpiece",
    description: "প্রিয়জনের জন্য সুন্দর কাপল শোপিস।",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Beautiful%20PVC%20couple%20showpiece%20romantic%20sculpture%20on%20white%20background%20product%20photography&image_size=square",
    category: "Showpiece",
  },
  {
    name: "Family Showpiece",
    description: "পরিবারের ছবি থেকে তৈরি PVC শোপিস।",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=PVC%20family%20showpiece%20loving%20family%20sculpture%20on%20white%20background%20product%20photography&image_size=square",
    category: "Showpiece",
  },
  {
    name: "Home Decoration",
    description: "আপনার ঘর সাজানোর জন্য সেরা PVC ডেকোর।",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=PVC%20home%20decoration%20items%20flower%20vase%20showpiece%20on%20white%20background%20product%20photography&image_size=square",
    category: "Decor",
  },
  {
    name: "Wall Decor",
    description: "দেয়ালের জন্য আকর্ষণীয় PVC ওয়াল ডেকোর।",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=PVC%20wall%20decor%20art%20beautiful%20hanging%20on%20white%20background%20product%20photography&image_size=square",
    category: "Decor",
  },
  {
    name: "Calligraphy PVC",
    description: "ইসলামিক ক্যালিগ্রাফি PVC শোপিস।",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=PVC%20Islamic%20calligraphy%20art%20bismillah%20elegant%20sculpture%20on%20white%20background%20product%20photography&image_size=square",
    category: "Art",
  },
  {
    name: "Gift Showpiece",
    description: "প্রিয়জনকে দেওয়ার জন্য নান্দনিক PVC গিফট।",
    image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Beautiful%20PVC%20gift%20showpiece%20wrapped%20elegant%20present%20on%20white%20background%20product%20photography&image_size=square",
    category: "Gift",
  },
];

export async function POST() {
  try {
    const db = await getDb();
    const servicesCollection = db.collection("services");

    const count = await servicesCollection.countDocuments();
    if (count > 0) {
      return NextResponse.json({
        message: "Database already seeded",
        count,
      });
    }

    const services = initialServices.map((s) => ({
      ...s,
      createdAt: new Date(),
    }));

    const result = await servicesCollection.insertMany(services);

    return NextResponse.json({
      message: "Database seeded successfully",
      count: result.insertedCount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
