"use client";

import QRCode from "react-qr-code";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

type SongFormData = {
  title: string;
  artist: string;
  url: string;
};

type Song = SongFormData & {
  id: string;
  createdAt: string;
};

const initialForm: SongFormData = {
  title: "",
  artist: "",
  url: "",
};

export default function QRForm() {
  const [form, setForm] = useState<SongFormData>(initialForm);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // pobieranie piosenek z backendu przy pierwszym renderze
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch("/api/songs");
        if (!res.ok) return;

        const data = (await res.json()) as Song[];
        setSongs(data);
      } catch (error) {
        console.error("Nie udało się pobrać piosenek:", error);
      }
    };

    fetchSongs();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title || !form.artist || !form.url) {
      alert("Wszystkie pola są wymagane 🙂");
      return;
    }

    if (
      !form.url.startsWith("http://") &&
      !form.url.startsWith("https://")
    ) {
      alert("Podaj poprawny link zaczynający się od http:// lub https://");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        let message = "Nie udało się zapisać piosenki";
        try {
          const data = (await response.json()) as { error?: string };
          if (data.error) message = data.error;
        } catch {
          // odpowiedź nie była JSON-em – ignorujemy
        }
        alert(message);
        return;
      }

      // obiekt zwrócony z backendu (Prisma + Neon)
      const createdSong = (await response.json()) as Song;
      console.log("Dodana piosenka z backendu:", createdSong);

      // dodajemy nową piosenkę na początek listy
      setSongs((prevSongs) => {
        const next = [createdSong, ...prevSongs];
        return next.slice(0, 5); // opcjonalny limit 5 ostatnich
      });

      // czyścimy formularz
      setForm(initialForm);
    } catch (error) {
      console.error("Błąd podczas zapisu piosenki:", error);
      alert("Wystąpił problem z połączeniem z serwerem 😢");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full max-w-xl space-y-4 rounded-2xl bg-slate-900/60 p-6 shadow-lg border border-slate-800"
      >
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-200"
          >
            Tytuł piosenki
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="np. Numb"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="artist"
            className="block text-sm font-medium text-slate-200"
          >
            Wykonawca
          </label>
          <input
            id="artist"
            name="artist"
            type="text"
            value={form.artist}
            onChange={handleChange}
            placeholder="np. Linkin Park"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="url"
            className="block text-sm font-medium text-slate-200"
          >
            Link do piosenki (Spotify / YouTube)
          </label>
          <input
            id="url"
            name="url"
            type="url"
            value={form.url}
            onChange={handleChange}
            placeholder="https://open.spotify.com/track/..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition"
        >
          {isSubmitting ? "Zapisywanie..." : "Generuj QR dla tej piosenki"}
        </button>
      </form>

      {/* LISTA OSTATNIO DODANYCH PIOSENEK */}
      {songs.length > 0 && (
        <section className="mt-6 w-full max-w-xl space-y-3 text-left">
          <h2 className="text-sm font-semibold text-slate-200">
            Ostatnio dodane piosenki
          </h2>

          <ul className="space-y-2">
            {songs.map((song) => (
              <li
                key={song.id}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-slate-100">
                      {song.title}{" "}
                      <span className="text-slate-400">– {song.artist}</span>
                    </p>

                    <a
                      href={song.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block text-xs text-emerald-400 hover:underline break-all"
                    >
                      {song.url}
                    </a>

                    <p className="mt-1 text-[10px] text-slate-500">
                      {new Date(song.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-col items-center gap-1">
                    <div className="rounded-xl bg-slate-950 p-2 border border-slate-800">
                      <QRCode
                        value={JSON.stringify({
                          title: song.title,
                          artist: song.artist,
                          url: song.url,
                        })}
                        size={164}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Zeskanuj QR 🎵
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
