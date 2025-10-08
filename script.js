// Simulasi ambil daftar barang (dummy)
async function isiDropdownBarang() {
  const list = ["Spidol", "Kertas A4", "Buku Catatan", "Pena"];
  const selects = document.querySelectorAll(".barang");
  selects.forEach((select) => {
    select.innerHTML = '<option value="">-- Pilih Barang --</option>';
    list.forEach((item) => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      select.appendChild(option);
    });
  });
}

isiDropdownBarang();

// Tambah baris
document.getElementById("tambah").addEventListener("click", () => {
  const container = document.getElementById("barang-container");
  const barisBaru = document.querySelector(".barang-row").cloneNode(true);
  barisBaru.querySelector(".jumlah").value = "";
  barisBaru.querySelector(".keterangan").value = "";
  container.appendChild(barisBaru);
  isiDropdownBarang();
});

// Hapus baris
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("hapus")) {
    e.target.parentNode.remove();
  }
});

// Kirim data (sementara hanya tampilkan di console)
document.getElementById("kirim").addEventListener("click", async () => {
  const namaPemesan = document.getElementById("namaPemesan").value.trim();
  const noWa = document.getElementById("noWa").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const cabang = document.getElementById("cabang").value.trim();
  const divisi = document.getElementById("divisi").value.trim();
  const pengiriman = document.querySelector('input[name="pengiriman"]:checked');

  if (!namaPemesan || !noWa || !cabang || !divisi || !pengiriman) {
    alert("⚠️ Mohon lengkapi semua data!");
    return;
  }

  const rows = document.querySelectorAll(".barang-row");
  const data = [];

  rows.forEach((r) => {
    const barang = r.querySelector(".barang").value;
    const jumlah = r.querySelector(".jumlah").value;
    if (barang && jumlah) {
      data.push({
        namaPemesan,
        noWa,
        alamat,
        cabang,
        divisi,
        pengiriman: pengiriman.value,
        barang,
        jumlah,
        keterangan: r.querySelector(".keterangan").value,
      });
    }
  });

  if (data.length === 0) {
    alert("Minimal pesan 1 barang!");
    return;
  }

  document.getElementById("status").textContent = "⏳ Mengirim data...";
  console.log(data); // sementara hanya log ke console

  // Jika sudah punya backend/API:
  // await fetch('https://api-kamu.com/simpan', {method: 'POST', body: JSON.stringify(data)})

  document.getElementById("status").textContent = "✅ Data berhasil dikirim (simulasi)";
});
