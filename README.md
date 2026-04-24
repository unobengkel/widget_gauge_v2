# 🎛 Widget Knob Gauge v2

Widget **Knob Gauge** reusable berbasis **Canvas Gauges** (RadialGauge).  
Cukup copy **2 file** (`knob.js` + `knob.css`) untuk langsung digunakan di project manapun.

![Demo](https://img.shields.io/badge/status-stable-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Size](https://img.shields.io/badge/size-~8KB-lightgrey)

---

## ✨ Fitur

- ✅ **Reusable** - Copy 2 file, siap pakai
- ✅ **Kustomisasi** - Warna, ukuran, animasi, segmen warna (highlights)
- ✅ **Event-driven** - Event `change` untuk integrasi dengan logika aplikasi
- ✅ **Canvas-based** - Performa tinggi, tampilan smooth
- ✅ **Responsive** - Mendukung variasi ukuran (small, large) dan tema (light/dark)
- ✅ **Lightweight** - Hanya ~8KB (JS + CSS)

---

## 🚀 Cara Penggunaan

### 1. Sertakan Library Canvas Gauges (CDN)

```html
<script src="https://cdn.jsdelivr.net/npm/canvas-gauges@2.1.7/gauge.min.js"></script>
```

### 2. Copy & Sertakan File Widget

Copy folder `asset/widget_knob/` ke project kamu, lalu:

```html
<link rel="stylesheet" href="path/ke/knob.css">
<script src="path/ke/knob.js"></script>
```

### 3. Buat Container

```html
<div id="my-gauge"></div>
```

### 4. Inisialisasi

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const gauge = new KnobGauge('my-gauge', {
        minValue: 0,
        maxValue: 100,
        value: 50,
        width: 300,
        height: 300,
        units: '%'
    });

    // Set nilai
    gauge.setValue(75);

    // Dapatkan nilai
    const val = gauge.getValue();

    // Event listener
    gauge.on('change', (data) => {
        console.log('Nilai:', data.value);
    });
});
```

---

## 📚 API Reference

### Constructor

```javascript
new KnobGauge(container, options)
```

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| `container` | string/HTMLElement | wajib | ID atau elemen DOM container |
| `options.minValue` | number | `0` | Nilai minimum |
| `options.maxValue` | number | `100` | Nilai maksimum |
| `options.value` | number | `0` | Nilai awal |
| `options.width` | number | `300` | Lebar canvas (px) |
| `options.height` | number | `300` | Tinggi canvas (px) |
| `options.units` | string | `""` | Satuan (contoh: "%", "°C") |
| `options.animationDuration` | number | `1000` | Durasi animasi (ms) |
| `options.animationRule` | string | `"linear"` | Jenis animasi |
| `options.highlights` | Array | `[...]` | Warna segmen |
| `options.showValueDisplay` | boolean | `true` | Tampilkan nilai numerik |

### Methods

| Method | Deskripsi |
|--------|-----------|
| `setValue(value, silent?)` | Set nilai gauge |
| `getValue()` | Dapatkan nilai saat ini |
| `on(event, callback)` | Daftarkan event listener |
| `off(event, callback?)` | Hapus event listener |
| `draw()` | Render ulang gauge |
| `destroy()` | Bersihkan instance |

### Events

| Event | Data | Deskripsi |
|-------|------|-----------|
| `change` | `{ value, oldValue }` | Dipicu saat nilai berubah |

---

## 🎨 Kustomisasi

### Warna Highlight

```javascript
const gauge = new KnobGauge('my-gauge', {
    highlights: [
        { from: 0, to: 40, color: "#22c55e" },   // Hijau
        { from: 40, to: 70, color: "#eab308" },  // Kuning
        { from: 70, to: 100, color: "#ef4444" }  // Merah
    ]
});
```

### Ukuran via CSS

```html
<div id="my-gauge" class="knob-small"></div>   <!-- 200px -->
<div id="my-gauge" class="knob-large"></div>    <!-- 450px -->
<div id="my-gauge" class="knob-light"></div>    <!-- Tema terang -->
```

### Warna Detail

```javascript
const gauge = new KnobGauge('my-gauge', {
    colorPlate: "#1e293b",
    colorMajorTicks: "#94a3b8",
    colorMinorTicks: "#475569",
    colorNumbers: "#f1f5f9",
    colorNeedle: "#f97316",
    needleType: "arrow",
    needleWidth: 4
});
```

---

## 📁 Struktur Project

```
widget_gauge_v2/
├── asset/
│   ├── widget_knob/
│   │   ├── knob.js          # ✅ Widget engine (class KnobGauge)
│   │   └── knob.css          # ✅ Widget styling
│   └── web/
│       ├── main.js           # # Script demo halaman web
│       └── main.css          # # Styling halaman web
├── example/
│   ├── contoh_dasar.html     # 🔰 Contoh minimal
│   ├── contoh_manual.html    # 🎚 Contoh dengan slider
│   └── contoh_otomatis.html  # 🤖 Contoh simulasi otomatis
├── index.html                # Landing page
├── tutorial.html             # 📖 Panduan lengkap
└── readme.md                 # Dokumentasi GitHub
```

> **Catatan:** Folder `web/` dan `example/` hanya untuk keperluan demo.  
> Jika ingin menggunakan widget di project lain, **cukup copy folder `widget_knob/`** saja.

---

## 🌐 Live Demo

Buka [index.html](index.html) untuk melihat demo langsung.

Atau lihat contoh-contoh di folder [`example/`](example/):

- [Contoh Dasar](example/contoh_dasar.html) - Implementasi paling sederhana
- [Contoh Manual](example/contoh_manual.html) - Dengan slider kendali manual
- [Contoh Otomatis](example/contoh_otomatis.html) - Simulasi nilai acak

---

## 📋 Persyaratan

- Browser modern (Chrome, Firefox, Safari, Edge)
- Koneksi internet (untuk Canvas Gauges CDN)

---

## 📄 Lisensi

MIT License © 2026

---

## 🙏 Kredit

- [Canvas Gauges](https://canvas-gauges.com/) - Library gauge berbasis Canvas
