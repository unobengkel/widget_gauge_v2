/**
 * main.js - Script utama untuk halaman web demo widget knob
 * 
 * File ini berisi logika spesifik untuk halaman demo.
 * Menggunakan class KnobGauge dari widget_knob.
 */

/**
 * Inisialisasi demo gauge dengan kontrol slider dan tombol.
 * @param {string} containerId - ID container gauge
 * @param {Object} options - Opsi tambahan untuk KnobGauge
 * @returns {Object} Instance KnobGauge dan kontrol
 */
function initDemoGauge(containerId, options = {}) {
    // Inisialisasi gauge
    const gauge = new KnobGauge(containerId, {
        width: 300,
        height: 300,
        minValue: 0,
        maxValue: 100,
        value: 0,
        animationDuration: 1000,
        animationRule: 'linear',
        needleType: 'arrow',
        needleWidth: 3,
        highlights: [
            { from: 0, to: 30, color: '#3b82f6' },
            { from: 30, to: 50, color: '#8b5cf6' },
            { from: 50, to: 100, color: '#ec4899' }
        ],
        ...options
    });

    // State simulasi
    let simulationInterval = null;
    let isSimulating = false;

    /**
     * Fungsi untuk update gauge + slider + display
     */
    function updateValue(value) {
        gauge.setValue(value);
        const slider = document.getElementById('gauge-slider');
        if (slider) slider.value = value;
    }

    /**
     * Setup slider kontrol manual
     */
    const slider = document.getElementById('gauge-slider');
    if (slider) {
        slider.addEventListener('input', function (e) {
            // Hentikan simulasi jika sedang berjalan
            stopSimulation();
            updateValue(e.target.value);
        });

        // Sinkron slider dengan nilai awal gauge
        slider.value = gauge.getValue();
    }

    /**
     * Memulai simulasi nilai acak
     */
    function startSimulation() {
        stopSimulation();
        isSimulating = true;
        simulationInterval = setInterval(() => {
            const randomValue = Math.floor(
                Math.random() * (gauge._options.maxValue - gauge._options.minValue + 1)
            ) + gauge._options.minValue;
            updateValue(randomValue);
        }, 1500);
        updateStatus('Simulasi berjalan...');
    }

    /**
     * Menghentikan simulasi
     */
    function stopSimulation() {
        if (simulationInterval) {
            clearInterval(simulationInterval);
            simulationInterval = null;
        }
        isSimulating = false;
    }

    /**
     * Reset ke nilai awal
     */
    function resetGauge() {
        stopSimulation();
        updateValue(0);
        updateStatus('Reset ke 0');
    }

    /**
     * Update status info
     */
    function updateStatus(message) {
        const statusEl = document.getElementById('status-info');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    // Setup tombol kontrol
    const btnStart = document.getElementById('btn-start');
    const btnStop = document.getElementById('btn-stop');
    const btnReset = document.getElementById('btn-reset');

    if (btnStart) {
        btnStart.addEventListener('click', startSimulation);
    }
    if (btnStop) {
        btnStop.addEventListener('click', () => {
            stopSimulation();
            updateStatus('Simulasi dihentikan');
        });
    }
    if (btnReset) {
        btnReset.addEventListener('click', resetGauge);
    }

    // Event listener dari gauge
    gauge.on('change', function (data) {
        updateStatus(`Nilai: ${Math.round(data.value)}`);
    });

    return {
        gauge,
        startSimulation,
        stopSimulation,
        resetGauge,
        updateValue
    };
}
