
// ===============================
// PROSES LOGIN
// ===============================

function prosesLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const pengguna = dataPengguna.find(function(user) {
        return user.email === email && user.password === password;
    });

    if (pengguna) {
        alert("Login berhasil! Selamat datang, " + pengguna.nama);

        localStorage.setItem("penggunaLogin", JSON.stringify(pengguna));

        window.location.href = "dashboard.html";
    } else {
        alert("Email/password yang anda masukkan salah");
    }
}


// ===============================
// GREETING DASHBOARD
// ===============================

function tampilkanGreeting() {
    const jam = new Date().getHours();
    let sapaan;

    if (jam >= 5 && jam < 11) {
        sapaan = "Selamat Pagi";
    } else if (jam >= 11 && jam < 15) {
        sapaan = "Selamat Siang";
    } else if (jam >= 15 && jam < 18) {
        sapaan = "Selamat Sore";
    } else {
        sapaan = "Selamat Malam";
    }

    const pengguna = JSON.parse(localStorage.getItem("penggunaLogin"));

    document.getElementById("greeting").textContent = sapaan;

    if (pengguna) {
        document.getElementById("namaPengguna").textContent =
            "Halo, " + pengguna.nama + "!";
    }
}

// ===============================
// LOGOUT
// ===============================

function logout() {
    const konfirmasi = confirm("Apakah kamu yakin ingin logout?");

    if (konfirmasi) {
        localStorage.removeItem("penggunaLogin");
        window.location.href = "index.html";
    }
}

// Jalankan greeting jika berada di dashboard
if (document.getElementById("greeting")) {
    tampilkanGreeting();
}

// ===============================
// MENAMPILKAN KATALOG BUKU
// ===============================

function tampilkanKatalog() {
    const daftarBuku = document.getElementById("daftarBuku");

    if (!daftarBuku) return;

    daftarBuku.innerHTML = "";

    dataKatalogBuku.forEach(function(buku, index) {
        const kartu = document.createElement("div");
        kartu.className = "buku-card";

        kartu.innerHTML = `
            <img src="${buku.cover}" alt="${buku.namaBarang}"
                 onerror="this.style.display='none'">

            <div class="buku-info">
                <h3>${buku.namaBarang}</h3>
                <p>Kode: ${buku.kodeBarang}</p>
                <p>Jenis: ${buku.jenisBarang}</p>
                <p>Edisi: ${buku.edisi}</p>
                <p>Stok: ${buku.stok}</p>
                <p class="harga">${buku.harga}</p>
            </div>
        `;

        daftarBuku.appendChild(kartu);
    });
}

// ===============================
// MENAMBAHKAN BUKU BARU
// ===============================

function tambahBuku(event) {
    event.preventDefault();

    const kode = document.getElementById("kodeBuku").value;
    const nama = document.getElementById("namaBuku").value;
    const stok = Number(document.getElementById("stokBuku").value);
    const harga = document.getElementById("hargaBuku").value;

    const kodeSudahAda = dataKatalogBuku.some(function(buku) {
        return buku.kodeBarang.toLowerCase() === kode.trim().toLowerCase();
    });

    if (kodeSudahAda) {
        alert("Kode buku sudah tersedia!");
        return;
    }

    const bukuBaru = {
        kodeBarang: kode.trim(),
        namaBarang: nama.trim(),
        jenisBarang: "Buku Ajar",
        edisi: "1",
        stok: stok,
        harga: harga,
        cover: ""
    };

    dataKatalogBuku.push(bukuBaru);

    tampilkanKatalog();

    document.getElementById("formTambahBuku").reset();

    alert("Buku berhasil ditambahkan!");
}

// Jalankan katalog pada halaman stok
if (document.getElementById("daftarBuku")) {
    tampilkanKatalog();

    document.getElementById("formTambahBuku")
        .addEventListener("submit", tambahBuku);
}


 // ===============================
 // CHECKOUT / PEMESANAN BUKU
 // ===============================

 // Mengisi pilihan buku
 function tampilkanPilihanBuku() {
     const pilihBuku = document.getElementById("pilihBuku");

     if (!pilihBuku) return;

     // Kosongkan pilihan lama
     pilihBuku.innerHTML = '<option value="">-- Pilih Buku --</option>';

     // Tampilkan semua buku dari data.js
     dataKatalogBuku.forEach(function(buku) {
         const pilihan = document.createElement("option");

         pilihan.value = buku.kodeBarang;
         pilihan.textContent = buku.namaBarang + " - " + buku.harga;

         pilihBuku.appendChild(pilihan);
     });

     // Mengisi nama pengguna otomatis
     const pengguna = JSON.parse(
         localStorage.getItem("penggunaLogin")
     );

     const namaPemesan = document.getElementById("namaPemesan");

     if (pengguna && namaPemesan) {
         namaPemesan.value = pengguna.nama;
     }
 }

 // Menghitung total pembayaran
 function hitungTotal() {
     const pilihBuku = document.getElementById("pilihBuku");
     const jumlahBuku = document.getElementById("jumlahBuku");
     const totalHarga = document.getElementById("totalHarga");

     if (!pilihBuku || !jumlahBuku || !totalHarga) return;

     const kode = pilihBuku.value;
     const jumlah = Number(jumlahBuku.value);

     const buku = dataKatalogBuku.find(function(item) {
         return item.kodeBarang === kode;
     });

     if (!buku || jumlah < 1) {
         totalHarga.textContent = "Rp 0";
         return;
     }

     const harga = Number(buku.harga.replace(/\D/g, ""));
     const total = harga * jumlah;

     totalHarga.textContent = "Rp " + total.toLocaleString("id-ID");
 }

 // Memproses pesanan
 function prosesCheckout(event) {
     event.preventDefault();

     const kode = document.getElementById("pilihBuku").value;
     const jumlah = Number(document.getElementById("jumlahBuku").value);

     const nama = document.getElementById("namaPemesan").value;
     const alamat = document.getElementById("alamatPemesan").value;
     const telepon = document.getElementById("teleponPemesan").value;

     const buku = dataKatalogBuku.find(function(item) {
         return item.kodeBarang === kode;
     });

     if (!buku) {
         alert("Silakan pilih buku terlebih dahulu!");
         return;
     }

     if (jumlah < 1 || jumlah > buku.stok) {
         alert("Jumlah pesanan melebihi stok yang tersedia!");
         return;
     }

     const harga = Number(buku.harga.replace(/\D/g, ""));
     const total = harga * jumlah;

     const pesanan = {
         nomorDO: "DO" + Date.now(),
         nama: nama,
         alamat: alamat,
         telepon: telepon,
         kodeBarang: buku.kodeBarang,
         namaBarang: buku.namaBarang,
         jumlah: jumlah,
         total: total,
         tanggal: new Date().toLocaleDateString("id-ID"),
         status: "Menunggu Pembayaran"
     };

     let daftarPesanan = JSON.parse(
         localStorage.getItem("daftarPesanan")
     ) || [];

     daftarPesanan.push(pesanan);

     localStorage.setItem(
         "daftarPesanan",
         JSON.stringify(daftarPesanan)
     );

     alert(
         "Pesanan berhasil dibuat!\n" +
         "Nomor DO: " + pesanan.nomorDO +
         "\nTotal: Rp " + total.toLocaleString("id-ID")
     );

     document.getElementById("formCheckout").reset();
     document.getElementById("totalHarga").textContent = "Rp 0";

     tampilkanPilihanBuku();
 }

 // Menjalankan fitur checkout
 const formCheckout = document.getElementById("formCheckout");

 if (formCheckout) {
     tampilkanPilihanBuku();

     document.getElementById("pilihBuku")
         .addEventListener("change", hitungTotal);

     document.getElementById("jumlahBuku")
         .addEventListener("input", hitungTotal);

     formCheckout.addEventListener("submit", prosesCheckout);
 }


// ===============================
// TRACKING PENGIRIMAN
// ===============================

function cariTracking(event) {
    event.preventDefault();

    const nomor = document.getElementById("nomorDO").value.trim();
    const hasil = document.getElementById("hasilTracking");

    let data = dataTracking[nomor];

    // Jika nomor tidak ditemukan di data dosen,
    // periksa pesanan yang dibuat melalui checkout.
    if (!data) {
        const daftarPesanan = JSON.parse(
            localStorage.getItem("daftarPesanan")
        ) || [];

        const pesanan = daftarPesanan.find(function(item) {
            return item.nomorDO === nomor;
        });

        if (pesanan) {
            data = {
                nomorDO: pesanan.nomorDO,
                nama: pesanan.nama,
                status: pesanan.status,
                ekspedisi: "Belum ditentukan",
                tanggalKirim: pesanan.tanggal,
                total: "Rp " + pesanan.total.toLocaleString("id-ID"),
                perjalanan: []
            };
        }
    }

    if (!data) {
        hasil.innerHTML = `
            <p class="tracking-error">
                Nomor DO tidak ditemukan. Periksa kembali nomor pesanan kamu.
            </p>
        `;
        return;
    }

    let riwayat = "";

    if (data.perjalanan && data.perjalanan.length > 0) {
        data.perjalanan.forEach(function(item) {
            riwayat += `
                <div class="tracking-item">
                    <h4>${item.waktu}</h4>
                    <p>${item.keterangan}</p>
                </div>
            `;
        });
    } else {
        riwayat = `
            <p>Belum ada riwayat perjalanan. Pesanan masih menunggu proses pengiriman.</p>
        `;
    }

    hasil.innerHTML = `
        <div class="tracking-result">

            <h2>Informasi Pesanan</h2>

            <p><strong>Nomor DO:</strong> ${data.nomorDO}</p>
            <p><strong>Nama Penerima:</strong> ${data.nama}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Ekspedisi:</strong> ${data.ekspedisi}</p>
            <p><strong>Tanggal:</strong> ${data.tanggalKirim}</p>
            <p><strong>Total:</strong> ${data.total}</p>

            <h3>Riwayat Perjalanan Paket</h3>

            <div class="tracking-history">
                ${riwayat}
            </div>

        </div>
    `;
}

if (document.getElementById("formTracking")) {
    document.getElementById("formTracking")
        .addEventListener("submit", cariTracking);
}

function tampilkanLaporanPesanan() {
    const daftarLaporan = document.getElementById("daftarLaporan");

    if (!daftarLaporan) return;

    const daftarPesanan = JSON.parse(
        localStorage.getItem("daftarPesanan")
    ) || [];

    if (daftarPesanan.length === 0) {
        daftarLaporan.innerHTML = "<p>Belum ada pesanan yang dibuat.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Nomor DO</th>
                <th>Nama Pemesan</th>
                <th>Nama Buku</th>
                <th>Jumlah</th>
                <th>Total</th>
                <th>Status</th>
            </tr>
    `;

    daftarPesanan.forEach(pesanan => {
        html += `
            <tr>
                <td>${pesanan.nomorDO}</td>
                <td>${pesanan.nama}</td>
                <td>${pesanan.namaBarang}</td>
                <td>${pesanan.jumlah}</td>
                <td>Rp ${pesanan.total.toLocaleString("id-ID")}</td>
                <td>${pesanan.status}</td>
            </tr>
        `;
    });

    html += "</table>";

    daftarLaporan.innerHTML = html;
}

tampilkanLaporanPesanan();

function tampilkanHistory() {
    const daftarHistory = document.getElementById("daftarHistory");

    if (!daftarHistory) return;

    const daftarPesanan = JSON.parse(
        localStorage.getItem("daftarPesanan")
    ) || [];

    if (daftarPesanan.length === 0) {
        daftarHistory.innerHTML = "<p>Belum ada riwayat transaksi.</p>";
        return;
    }

    let html = `
        <table>
            <tr>
                <th>Tanggal</th>
                <th>Nomor DO</th>
                <th>Nama Buku</th>
                <th>Jumlah</th>
                <th>Total Pembayaran</th>
                <th>Status</th>
            </tr>
    `;

    daftarPesanan.forEach(pesanan => {
        html += `
            <tr>
                <td>${pesanan.tanggal}</td>
                <td>${pesanan.nomorDO}</td>
                <td>${pesanan.namaBarang}</td>
                <td>${pesanan.jumlah}</td>
                <td>Rp ${pesanan.total.toLocaleString("id-ID")}</td>
                <td>${pesanan.status}</td>
            </tr>
        `;
    });

    html += "</table>";
    daftarHistory.innerHTML = html;
}

tampilkanHistory();
