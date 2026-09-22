/** @type {import('tailwindcss').Config} */

// Semua warna berasal dari src/css/iom-tokens.css (satu sumber kebenaran
// yang disalin identik ke tiap repo UI IOM-ITB). Pola
// rgb(var(--x) / <alpha-value>) dipakai supaya modifier opacity Tailwind
// seperti `text-main/75` tetap bekerja.
const token = (name) => `rgb(var(--iom-${name}-rgb) / <alpha-value>)`;

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // --- Nama kanonik (dipakai kode baru) ---
        primary: {
          DEFAULT: token("primary"),
          hover: token("primary-hover"),
          deep: token("primary-deep"),
        },
        accent: {
          DEFAULT: token("accent"),
          dark: token("accent-dark"),
        },
        surface: {
          DEFAULT: token("surface"),
          subtle: token("surface-subtle"),
          muted: token("surface-muted"),
          brand: token("surface-brand"),
        },
        ink: token("ink"),
        body: token("text"),
        muted: token("muted-fg"),
        line: {
          DEFAULT: token("border"),
          brand: token("border-brand"),
        },
        success: token("success"),
        danger: token("danger"),
        warning: token("warning"),

        // --- Alias lama ---
        // `main` dipakai 305x dan `colorSecond` 18x di komponen. Keduanya
        // dipertahankan sebagai alias token agar tidak perlu menyentuh
        // ratusan call site tanpa perubahan visual apa pun.
        main: {
          light: token("primary"),
          DEFAULT: token("primary"),
          dark: token("primary"),
        },
        colorSecond: {
          light: token("surface-subtle"),
          DEFAULT: token("surface-subtle"),
          dark: token("surface-subtle"),
        },
      },
      borderRadius: {
        iom: "var(--iom-radius)",
      },
      // `shadow-soft` dipakai 5x di kartu donasi & banner pembayaran tapi
      // tidak pernah didefinisikan, jadi selama ini tidak menghasilkan
      // bayangan sama sekali. Didefinisikan agar kartu tampil konsisten.
      boxShadow: {
        soft: "0 1px 2px rgb(var(--iom-primary-rgb) / 0.04), 0 8px 24px rgb(var(--iom-primary-rgb) / 0.08)",
      },
    },
  },
};
