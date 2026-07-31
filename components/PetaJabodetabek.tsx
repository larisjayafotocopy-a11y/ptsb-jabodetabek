import Link from 'next/link';

interface Korwil {
  id: number;
  nama_wilayah: string;
}

// ============================================================
// TITIK PIN — SET MANUAL DI SINI
// ============================================================
// Gambar aslinya berukuran 2086 x 1274 px. Container di bawah dibuat
// dengan aspect-ratio PERSIS SAMA (2086/1274), jadi posisi dalam PERSEN
// ini akan selalu jatuh di titik yang sama persis pada gambar — baik di
// HP maupun desktop, tidak akan geser lagi.
//
// Cara menentukan koordinat: buka gambar aslinya di editor foto apa saja
// yang menunjukkan posisi kursor dalam piksel (Photoshop, Photopea, Preview
// di Mac, Paint di Windows, dll), arahkan kursor ke tengah pulau yang mau
// dituju, lalu hitung:
//   left = (posisi_x_piksel / 2086) * 100
//   top  = (posisi_y_piksel / 1274) * 100
//
// Cocokkan `nama` di bawah dengan nama_wilayah PERSIS seperti di database
// (lihat tabel korwil Anda). Silakan diubah semua angkanya sesuai pulau
// yang mana untuk wilayah yang mana.
const PIN_POSITIONS: Record<string, { top: number; left: number }> = {
  'Wilayah DKI': { top: 41, left: 47 },
  'Wilayah Jakarta Utara': { top: 18, left: 47 },
  'Wilayah Cengkareng': { top: 30, left: 28 },
  'Wilayah Ciracas': { top: 30, left: 67 },
  'Wilayah Cibinong': { top: 49, left: 25 },
  'Wilayah Bekasi': { top: 49, left: 70 },
  'Wilayah Tangerang Selatan': { top: 68, left: 31 },
  'Wilayah Depok': { top: 72, left: 48 },
  'Wilayah Tangerang': { top: 68, left: 64 },
};

// Kalau ada wilayah yang namanya belum ada di daftar atas, pin-nya
// ditaruh di titik ini (tengah) supaya tetap kelihatan, bukan hilang.
const DEFAULT_POSITION = { top: 50, left: 50 };

export default function PetaJabodetabek({ korwilList }: { korwilList: Korwil[] }) {
  return (
    <div
      className="w-full rounded-[2rem] relative mb-10 overflow-hidden shadow-xl border border-blue-100"
      style={{ aspectRatio: '2086 / 1274' }}
    >
      <img
        src="/peta-background.png"
        alt="Peta Wilayah PTSB Jabodetabek"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {korwilList.map((k) => {
        const pos = PIN_POSITIONS[k.nama_wilayah] || DEFAULT_POSITION;
        return (
          <Link
            key={k.id}
            href={`/direktori/${k.id}`}
            style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10"
          >
            <svg
              viewBox="0 0 384 512"
              className="w-6 h-6 md:w-8 md:h-8 text-batakRed drop-shadow-lg group-hover:scale-110 transition"
              fill="currentColor"
            >
              <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
            </svg>
            <span className="mt-0.5 bg-white text-batakDark px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-sm font-bold shadow-md group-hover:bg-batakRed group-hover:text-white transition whitespace-nowrap">
              {k.nama_wilayah.replace('Wilayah ', '')}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
