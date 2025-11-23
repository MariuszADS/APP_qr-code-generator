// src/app/api/songs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";


type SongInput = {
  title: string;
  artist: string;
  url: string;
};

// GET /api/songs → pobierz z bazy (Neon przez Prisma)
export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(songs);
  } catch (error) {
    console.error("API GET /api/songs error:", error);
    return NextResponse.json(
      { error: "Nie udało się pobrać piosenek" },
      { status: 500 }
    );
  }
}

// POST /api/songs → walidacja + zapis do bazy
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<SongInput>;
    const { title, artist, url } = body;

    if (!title || !artist || !url) {
      return NextResponse.json(
        { error: "Brakuje wymaganych pól: title, artist, url" },
        { status: 400 }
      );
    }

    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://")
    ) {
      return NextResponse.json(
        { error: "URL musi zaczynać się od http:// lub https://" },
        { status: 400 }
      );
    }

    const newSong = await prisma.song.create({
      data: {
        title,
        artist,
        url,
      },
    });

    return NextResponse.json(newSong, { status: 201 });
  } catch (error) {
    console.error("API POST /api/songs error:", error);
    return NextResponse.json(
      { error: "Wewnętrzny błąd serwera" },
      { status: 500 }
    );
  }
}
