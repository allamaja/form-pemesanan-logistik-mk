const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbztC4hZdlKKBoY9l5JKGxIvho1ca4FIMzaj0GTFIEs_IOosGOEOY9TYskysRQJZ1o8r/exec';

let barangList = []; // simpan data barang global

// Ambil data barang dari backend (sekali saja)
async function loadBarangList() {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getBarangList`);
    barangList = await response.json();
    isiDropdownSemuaSelect();
  } catch (err) {
    console.error('Gagal memuat daftar barang:', err);
    alert('⚠️ Gagal memuat daftar barang. Coba refresh halaman.');
  }
}

// Isi dropdown barang
function isiDropdownSemuaSelect() {
  document.querySelectorAll('.barang').forEach(select => {
    select.innerHTML = '<option value="">-- Pilih Barang --</option>';
    barangList.forEach(barang => {
      const option = document.createElement('option');
      option.value = barang;
      option.textContent = barang;
      select.appendChild(option);
    });
  });
}

// Tambah baris barang baru
function tambahBaris() {
  const container = document.getElementById('barang-container');
  const baris = container.querySelector('.barang-row');
  const clone = baris.cloneNode(true);
  clone.querySelector('.jumlah').value = '';
  clone.querySelector('.keterangan').value = '';

  // isi dropdown dari data yang sudah disimpan
  const select = clone.querySelector('.barang');
  select.innerHTML = '<option value="">-- Pilih Barang --</option>';
  barangList.forEach(barang => {
    const option = document.createElement('option');
    option.value = barang;
    option.textContent = barang;
    select.appendChild(option);
  });

  container.appendChild(clone);
}

// Hapus baris barang
document.addEventListener('click', e => {
  if (e.target.classList.contains('hapus')) {
    e.target.parentElement.remove();
  }
});

// Kirim data pesanan
async function kirimPesanan() {
  const namaPemesan = document.getElementById('namaPemesan').value.trim();
  const noWa = document.getElementById('noWa').value.trim();
  const alamat = document.getElementById('alamat').value.trim();
  const cabang = document.getElementById('cabang').value.trim();
  const divisi = document.getElementById('divisi').value.trim();
  const pengiriman = document.querySelector('input[name="pengiriman"]:checked')?.value || '';

  if (!namaPemesan || !noWa || !cabang || !divisi || !pengiriman) {
    alert("⚠️ Mohon lengkapi semua data identitas dan metode pengiriman!");
    return;
  }

  const rows = document.querySelectorAll('.barang-row');
  const data = [];

  rows.forEach(r => {
    const barang = r.querySelector('.barang').value.trim();
    const jumlah = r.querySelector('.jumlah').value.trim();
    const keterangan = r.querySelector('.keterangan').value.trim();
    if (barang && jumlah) {
      data.push({ namaPemesan, noWa, alamat, cabang, divisi, pengiriman, barang, jumlah, keterangan });
    }
  });

  if (data.length === 0) {
    alert("Minimal pesan 1 barang!");
    return;
  }

  document.getElementById('status').textContent = "⏳ Mengirim data...";
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    document.getElementById('status').textContent = "✅ Pesanan berhasil dikirim!";
    document.getElementById('barang-container').innerHTML = ''; // reset form
    tambahBaris(); // tambah baris baru kosong
    isiDropdownSemuaSelect(); // isi dropdown di baris baru
  } catch (err) {
    console.error(err);
    document.getElementById('status').textContent = "❌ Gagal mengirim data!";
  }
}

// Event listeners
document.getElementById('tambah').addEventListener('click', tambahBaris);
document.getElementById('kirim').addEventListener('click', kirimPesanan);

// Jalankan saat load
window.onload = loadBarangList;
