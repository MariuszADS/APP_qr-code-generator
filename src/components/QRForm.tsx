"use client";

import QRCode from "react-qr-code";
import { useState, type ChangeEvent, type FormEvent } from "react";

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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

    // 1. Tworzymy obiekt Song
    const newSong: Song = {
      ...form,
      id: `${Date.now()}-${Math.random()}`, // prosty unikalny id
      createdAt: new Date().toISOString(),
    };

    // 2. Dodajemy do tablicy (najświeższe na górze)
    setSongs((prevSongs) => {
      const next = [newSong, ...prevSongs]
      return next.slice(0, 5)
    })

    console.log("Dodana piosenka:", newSong);

    setSongs

    // 3. Czyścimy formularz
    setForm(initialForm);
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
          className="mt-2 w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 active:scale-[0.98] transition"
        >
          Generuj QR dla tej piosenki
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



/**"use client"; – mówi Nextowi, że ten komponent działa w przeglądarce (możemy używać useState, alert, window itd.).

type SongFormData – definiuje kształt danych formularza.

useState<SongFormData>(...) – stan ma konkretny typ.

handleChange – uniwersalna obsługa onChange dla wszystkich <input>:

klucz name musi się zgadzać z polami w SongFormData (title, artist, url).

handleSubmit:

event.preventDefault() – blokuje przeładowanie strony,

prosta walidacja: jeśli czegoś brakuje → alert,

na razie: console.log – backend + QR dodamy później. */