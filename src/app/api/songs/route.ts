// src/app/api/songs/route.ts
import { NextRequest, NextResponse } from "next/server";

// Typ danych przychodzących z frontu
type SongInput = {
  title: string;
  artist: string;
  url: string;
};

// Typ pełnego obiektu piosenki
type Song = SongInput & {
  id: string;
  createdAt: string;
};

// "Baza danych" w pamięci – znika po restarcie
const songs: Song[] = [];

/**
 * GET /api/songs
 * Zwraca listę piosenek w formacie JSON
 */
export async function GET() {
  return NextResponse.json(songs);
}

/**
 * POST /api/songs
 * Przyjmuje piosenkę, waliduje ją i dodaje do tablicy
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<SongInput>;
    const { title, artist, url } = body;

    // Walidacja - backend zawsze sprawdza wszystko
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

    // Tworzenie obiektu piosenki
    const newSong: Song = {
      title,
      artist,
      url,
      id: `${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
    };

    // Dodanie na początek listy (ostatnie dodane na górze)
    songs.unshift(newSong);

    return NextResponse.json(newSong, { status: 201 });
  } catch (error) {
    console.error("API error in POST /api/songs:", error);
    return NextResponse.json(
      { error: "Wewnętrzny błąd serwera" },
      { status: 500 }
    );
  }
}
