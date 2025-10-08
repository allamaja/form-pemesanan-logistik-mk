const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbztC4hZdlKKBoY9l5JKGxIvho1ca4FIMzaj0GTFIEs_IOosGOEOY9TYskysRQJZ1o8r/exec';

// Ambil data barang dari backend
async function loadBarangList() {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getBarangList`);
    const barangList = await response.json();

    const select = document.getElementById('barang');
    select.innerHTML = '<option value="">-- Pilih Barang --</option>';

    barangList.forEach(barang => {
      const option = document.createElement('option');
      option.value = barang;
      option.textContent = barang;
      select.appendChild(option);
    });
  } catch (err) {
    console.error('Gagal memuat daftar barang:', err);
    alert('⚠️ Gagal memuat daftar barang. Coba refresh halaman.');
  }
}

// Kirim data pesanan ke backend
async function kirimPesanan(event) {
  event.preventDefault();

  const namaPemesan = document.getElementById('namaPemesan').value.trim();
  const noWa = document.getElementById('noWa').value.trim();
  const alamat = document.getElementById('alamat').value.trim();
  const cabang = document.getElementById('cabang').value.trim();
  const divisi = document.getElementById('divisi').value.trim();
  const pengiriman = document.querySelector('input[name="pengiriman"]:checked')?.value || '';
  const barang = document.getElementById('barang').value.trim();
  const jumlah = document.getElementById('jumlah').value.trim();
  const keterangan = document.getElementById('keterangan').value.trim();

  if (!namaPemesan || !barang || !jumlah) {
    alert('⚠️ Nama pemesan, barang, dan jumlah wajib diisi!');
    return;
  }

  const data = [{
    namaPemesan,
    noWa,
    alamat,
    cabang,
    divisi,
    pengiriman,
    barang,
    jumlah,
    keterangan
  }];

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data)
    });

    alert('✅ Pesanan berhasil dikirim!');
    document.getElementById('formPemesanan').reset();

  } catch (err) {
    console.error('Gagal mengirim pesanan:', err);
    alert('⚠️ Terjadi kesalahan saat mengirim pesanan.');
  }
}

// Jalankan fungsi setelah halaman dimuat
window.onload = loadBarangList;
document.getElementById('formPemesanan').addEventListener('submit', kirimPesanan);
