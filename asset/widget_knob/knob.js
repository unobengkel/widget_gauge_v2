/**
 * knob.js - Widget Knob Gauge Engine
 * 
 * Widget reusable berbasis Canvas Gauges (RadialGauge).
 * Cukup copy file ini + knob.js + knob.css ke project lain.
 * 
 * Dependensi: Canvas Gauges CDN
 * <script src="https://cdn.jsdelivr.net/npm/canvas-gauges@2.1.7/gauge.min.js"></script>
 * 
 * Contoh penggunaan minimal:
 *   const gauge = new KnobGauge('container-id', {
 *       minValue: 0,
 *       maxValue: 100,
 *       value: 50
 *   });
 *   gauge.setValue(75);
 */

class KnobGauge {
    /**
     * @param {string|HTMLElement} container - ID element atau elemen DOM container
     * @param {Object} options - Konfigurasi gauge
     * @param {number} [options.minValue=0] - Nilai minimum
     * @param {number} [options.maxValue=100] - Nilai maksimum
     * @param {number} [options.value=0] - Nilai awal
     * @param {number} [options.width=300] - Lebar canvas
     * @param {number} [options.height=300] - Tinggi canvas
     * @param {string} [options.units=""] - Satuan (ditampilkan di display)
     * @param {number} [options.animationDuration=1000] - Durasi animasi (ms)
     * @param {string} [options.animationRule="linear"] - Jenis animasi
     * @param {string} [options.needleType="arrow"] - Tipe jarum
     * @param {number} [options.needleWidth=3] - Lebar jarum
     * @param {Array} [options.highlights] - Array warna highlight
     * @param {string} [options.colorMajorTicks="#ffffff"] - Warna tick utama
     * @param {string} [options.colorMinorTicks="#cccccc"] - Warna tick minor
     * @param {string} [options.colorNumbers="#ffffff"] - Warna angka
     * @param {string} [options.colorNeedle="#ffffff"] - Warna jarum
     * @param {string} [options.colorPlate="transparent"] - Warna plat
     * @param {boolean} [options.showValueDisplay=true] - Tampilkan nilai numerik
     */
    constructor(container, options = {}) {
        // Dapatkan elemen container
        this._container = (typeof container === 'string')
            ? document.getElementById(container)
            : container;

        if (!this._container) {
            throw new Error(`KnobGauge: Container element tidak ditemukan: ${container}`);
        }

        // Opsi default
        this._options = {
            minValue: 0,
            maxValue: 100,
            value: 0,
            width: 300,
            height: 300,
            units: '',
            animationDuration: 1000,
            animationRule: 'linear',
            needleType: 'arrow',
            needleWidth: 3,
            needleCircleSize: 7,
            needleCircleOuter: true,
            needleCircleInner: false,
            highlights: [
                { from: 0, to: 30, color: '#3b82f6' },
                { from: 30, to: 50, color: '#8b5cf6' },
                { from: 50, to: 100, color: '#ec4899' }
            ],
            colorMajorTicks: '#ffffff',
            colorMinorTicks: '#cccccc',
            colorNumbers: '#ffffff',
            colorNeedle: '#ffffff',
            colorNeedleEnd: '#ffffff',
            colorPlate: 'transparent',
            borderShadowWidth: 0,
            borders: false,
            valueBox: false,
            showValueDisplay: true,
            ...options
        };

        // State internal
        this._currentValue = this._options.value;
        this._callbacks = {};
        this._radialGauge = null;

        // Build DOM structure
        this._buildDOM();

        // Inisialisasi RadialGauge
        this._initGauge();
    }

    // ========================
    //   PRIVATE METHODS
    // ========================

    /**
     * Membangun struktur DOM widget
     */
    _buildDOM() {
        // Tambahkan class wrapper jika belum ada
        this._container.classList.add('knob-gauge-wrapper');

        // Buat canvas element
        const canvasId = `knob-canvas-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this._canvas = document.createElement('canvas');
        this._canvas.id = canvasId;
        this._canvas.className = 'knob-canvas';
        this._canvas.width = this._options.width;
        this._canvas.height = this._options.height;
        this._container.appendChild(this._canvas);

        // Buat value display
        if (this._options.showValueDisplay) {
            this._valueDisplay = document.createElement('div');
            this._valueDisplay.className = 'knob-value-display';
            this._valueDisplay.innerHTML = `<span class="knob-value-text">${Math.round(this._options.value)}</span>` +
                (this._options.units ? `<span class="knob-value-unit">${this._options.units}</span>` : '');
            this._container.appendChild(this._valueDisplay);
            this._valueTextEl = this._valueDisplay.querySelector('.knob-value-text');
        }
    }

    /**
     * Inisialisasi RadialGauge dari Canvas Gauges
     */
    _initGauge() {
        if (typeof RadialGauge === 'undefined') {
            console.warn(
                'KnobGauge: Library Canvas Gauges belum dimuat. ' +
                'Pastikan Anda menyertakan: ' +
                '<script src="https://cdn.jsdelivr.net/npm/canvas-gauges@2.1.7/gauge.min.js"></script>'
            );
            return;
        }

        const opts = this._options;
        this._radialGauge = new RadialGauge({
            renderTo: this._canvas.id,
            width: opts.width,
            height: opts.height,
            units: '',
            minValue: opts.minValue,
            maxValue: opts.maxValue,
            value: opts.value,
            colorPlate: opts.colorPlate,
            borderShadowWidth: opts.borderShadowWidth,
            borders: opts.borders,
            needleType: opts.needleType,
            needleWidth: opts.needleWidth,
            needleCircleSize: opts.needleCircleSize,
            needleCircleOuter: opts.needleCircleOuter,
            needleCircleInner: opts.needleCircleInner,
            animationDuration: opts.animationDuration,
            animationRule: opts.animationRule,
            valueBox: opts.valueBox,
            colorMajorTicks: opts.colorMajorTicks,
            colorMinorTicks: opts.colorMinorTicks,
            colorNumbers: opts.colorNumbers,
            colorNeedle: opts.colorNeedle,
            colorNeedleEnd: opts.colorNeedleEnd,
            highlights: opts.highlights
        }).draw();
    }

    /**
     * Memicu event callback
     */
    _emit(eventName, data) {
        if (this._callbacks[eventName]) {
            this._callbacks[eventName].forEach(cb => {
                try {
                    cb(data);
                } catch (err) {
                    console.error(`KnobGauge: Error di callback "${eventName}":`, err);
                }
            });
        }
    }

    // ========================
    //   PUBLIC METHODS
    // ========================

    /**
     * Mengupdate nilai gauge.
     * @param {number} value - Nilai baru (dalam rentang minValue - maxValue)
     * @param {boolean} [silent=false] - Jika true, tidak memicu event 'change'
     */
    setValue(value, silent = false) {
        // Simpan nilai lama SEBELUM diubah
        const oldValue = this._currentValue;

        // Clamp nilai dalam rentang
        const clampedValue = Math.min(
            this._options.maxValue,
            Math.max(this._options.minValue, Number(value) || 0)
        );

        this._currentValue = clampedValue;

        // Update gauge via Canvas Gauges .value setter.
        // .value setter secara internal membatalkan animasi
        // sebelumnya sebelum memulai yang baru (via cancelTween
        // internal). Hanya ada 1 tween aktif dalam 1 waktu,
        // sehingga aman dipanggil beruntun (misal dari slider).
        if (this._radialGauge) {
            this._radialGauge.value = clampedValue;
        }

        // Update value display
        if (this._valueTextEl) {
            this._valueTextEl.innerText = Math.round(clampedValue);
        }

        // Event
        if (!silent) {
            this._emit('change', {
                value: clampedValue,
                oldValue: oldValue
            });
        }
    }

    /**
     * Mendapatkan nilai gauge saat ini.
     * @returns {number} Nilai saat ini
     */
    getValue() {
        return this._currentValue;
    }

    /**
     * Mendaftarkan event listener.
     * Event yang tersedia: 'change'
     * @param {string} eventName - Nama event
     * @param {Function} callback - Fungsi callback(data)
     */
    on(eventName, callback) {
        if (typeof callback !== 'function') return;

        if (!this._callbacks[eventName]) {
            this._callbacks[eventName] = [];
        }
        this._callbacks[eventName].push(callback);
    }

    /**
     * Menghapus event listener.
     * @param {string} eventName - Nama event
     * @param {Function} [callback] - Jika tidak disertakan, hapus semua callback untuk event tsb
     */
    off(eventName, callback) {
        if (!this._callbacks[eventName]) return;

        if (callback) {
            this._callbacks[eventName] = this._callbacks[eventName]
                .filter(cb => cb !== callback);
        } else {
            delete this._callbacks[eventName];
        }
    }

    /**
     * Render ulang gauge (misal setelah resize).
     */
    draw() {
        if (this._radialGauge) {
            this._radialGauge.draw();
        }
    }

    /**
     * Membersihkan instance gauge.
     */
    destroy() {
        // Hentikan animasi & reset gauge
        if (this._radialGauge) {
            // Canvas Gauges tidak punya method destroy eksplisit,
            // jadi kita reset ke 0 dan hapus referensi
            this._radialGauge.value = 0;
        }

        // Hapus canvas
        if (this._canvas && this._canvas.parentNode) {
            this._canvas.parentNode.removeChild(this._canvas);
        }

        // Hapus value display
        if (this._valueDisplay && this._valueDisplay.parentNode) {
            this._valueDisplay.parentNode.removeChild(this._valueDisplay);
        }

        // Bersihkan class
        if (this._container) {
            this._container.classList.remove('knob-gauge-wrapper');
        }

        // Hapus referensi
        this._radialGauge = null;
        this._callbacks = {};
        this._currentValue = 0;
    }
}
