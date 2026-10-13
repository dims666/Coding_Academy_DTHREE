/* =====================================================
   Coding Academy v2 - script.js
   ===================================================== */

const BAHASA = ["HTML & CSS", "JavaScript", "Python", "PHP", "Java", "C#", "Dart (Flutter)", "Go"];

/* ---------- Data galeri ----------
   Taruh foto asli di folder "images/" sesuai nama di properti "foto".
   Jika belum ada, otomatis tampil gambar pengganti. */
const GALERI = [
  {
    kategori: "Web",
    judul: "Workshop Dasar HTML & CSS",
    meta: "Sabtu, 12 Juli 2025 · Lab Komputer 1",
    foto: "images/kegiatan-1.jpg",
    glyph: "</>", warna: ["#6c4dff", "#a99bff"],
    deskripsi: "Peserta pemula membangun halaman profil pertama mereka. Instruktur membimbing dari struktur tag HTML sampai mengatur tata letak dengan CSS Flexbox dan Grid."
  },
  {
    kategori: "Web",
    judul: "Bootcamp JavaScript Interaktif",
    meta: "Minggu, 20 Juli 2025 · Ruang Kelas A",
    foto: "images/kegiatan-2.jpg",
    glyph: "JS", warna: ["#cff54a", "#f0ffa8"], gelap: true,
    deskripsi: "Sesi praktik membuat kalkulator dan daftar tugas. Peserta belajar menangani event, memanipulasi DOM, dan menyimpan data di browser."
  },
  {
    kategori: "Data",
    judul: "Kelas Python untuk Analisis Data",
    meta: "Rabu, 30 Juli 2025 · Daring (Zoom)",
    foto: "images/kegiatan-3.jpg",
    glyph: "py", warna: ["#ff9cbc", "#ffd0e0"], gelap: true,
    deskripsi: "Pelatihan daring tentang dasar Python, pengolahan file CSV, dan membuat grafik sederhana dari data penjualan toko."
  },
  {
    kategori: "Komunitas",
    judul: "Hackathon Mini 6 Jam",
    meta: "Sabtu, 9 Agustus 2025 · Aula Utama",
    foto: "images/kegiatan-4.jpg",
    glyph: "{ }", warna: ["#14121f", "#4a4570"],
    deskripsi: "Tim beranggotakan tiga orang berlomba membuat aplikasi layanan warga dalam enam jam, lalu mempresentasikannya di depan mentor."
  },
  {
    kategori: "Mobile",
    judul: "Pelatihan Aplikasi Flutter",
    meta: "Kamis, 21 Agustus 2025 · Lab Komputer 2",
    foto: "images/kegiatan-5.jpg",
    glyph: "[ ]", warna: ["#38b6ff", "#a6dcff"], gelap: true,
    deskripsi: "Peserta membuat aplikasi catatan sederhana untuk Android: membangun tampilan, mengelola state, dan menyimpan data di perangkat."
  },
  {
    kategori: "Komunitas",
    judul: "Mentoring Karier Programmer",
    meta: "Jumat, 5 September 2025 · Ruang Diskusi",
    foto: "images/kegiatan-6.jpg",
    glyph: "@", warna: ["#6c4dff", "#cff54a"],
    deskripsi: "Alumni dan praktisi industri berbagi cara menyusun portofolio, menulis CV teknis, dan menghadapi wawancara kerja."
  }
];

/* ---------- Util ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function esc(t) {
  const d = document.createElement("div");
  d.textContent = t;
  return d.innerHTML;
}

function gambarPengganti(g) {
  const warnaTeks = g.gelap ? "#14121f" : "#ffffff";
  const judul = g.judul.replace(/&/g, "dan").replace(/</g, "");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g.warna[0]}"/><stop offset="1" stop-color="${g.warna[1]}"/></linearGradient>` +
    `<pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2" fill="${warnaTeks}" fill-opacity=".15"/></pattern></defs>` +
    `<rect width="800" height="600" fill="url(#g)"/><rect width="800" height="600" fill="url(#p)"/>` +
    `<text x="400" y="330" font-family="monospace" font-size="170" font-weight="700" fill="${warnaTeks}" text-anchor="middle">${g.glyph.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>` +
    `<text x="400" y="440" font-family="sans-serif" font-size="30" font-weight="700" fill="${warnaTeks}" text-anchor="middle">${judul}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ---------- Penyimpanan ---------- */
const KEY = "coding-academy-v2-peserta";

function muat() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
}
function simpan() {
  try { localStorage.setItem(KEY, JSON.stringify(peserta)); } catch (e) { console.warn("Penyimpanan tidak tersedia", e); }
}
let peserta = muat();

/* ---------- Dialog konfirmasi (dipakai untuk simpan & hapus) ---------- */
function konfirmasi({ judul = "Konfirmasi", teks, ya = "Ya", tidak = "Tidak" }) {
  return new Promise((resolve) => {
    const dlg = $("#dlgConfirm");
    $("#confirmJudul").textContent = judul;
    $("#confirmTeks").textContent = teks;
    $("#btnYa").textContent = ya;
    $("#btnTidak").textContent = tidak;

    const selesai = (hasil) => {
      $("#btnYa").removeEventListener("click", onYa);
      $("#btnTidak").removeEventListener("click", onTidak);
      dlg.removeEventListener("cancel", onTidak);
      if (dlg.open) dlg.close();
      resolve(hasil);
    };
    const onYa = () => selesai(true);
    const onTidak = () => selesai(false);

    $("#btnYa").addEventListener("click", onYa);
    $("#btnTidak").addEventListener("click", onTidak);
    dlg.addEventListener("cancel", onTidak);
    dlg.showModal();
  });
}

/* ---------- Navigasi 3 tampilan ---------- */
const VIEWS = ["galeri", "daftar", "peserta"];
function tampilkan(nama) {
  const v = VIEWS.includes(nama) ? nama : "galeri";
  VIEWS.forEach((n) => { $("#view-" + n).hidden = n !== v; });
  $$(".nav-link").forEach((a) => {
    const aktif = a.dataset.view === v;
    a.classList.toggle("active", aktif);
    if (aktif) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  window.scrollTo({ top: 0 });
}
window.addEventListener("hashchange", () => tampilkan(location.hash.slice(1)));

/* ---------- Galeri ---------- */
let kategoriAktif = "Semua";

function renderChips() {
  const kategori = ["Semua", ...new Set(GALERI.map((g) => g.kategori))];
  const wadah = $("#chips");
  wadah.innerHTML = "";
  kategori.forEach((k) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = k;
    b.setAttribute("aria-pressed", String(k === kategoriAktif));
    b.addEventListener("click", () => { kategoriAktif = k; renderChips(); renderGaleri(); });
    wadah.appendChild(b);
  });
}

function renderGaleri() {
  const grid = $("#galleryGrid");
  grid.innerHTML = "";
  GALERI.filter((g) => kategoriAktif === "Semua" || g.kategori === kategoriAktif).forEach((g) => {
    const kartu = document.createElement("button");
    kartu.type = "button";
    kartu.className = "g-item";
    kartu.innerHTML =
      `<img src="${g.foto}" alt="Foto kegiatan: ${esc(g.judul)}" loading="lazy">` +
      `<div class="g-body"><span class="tag">${esc(g.kategori)}</span>` +
      `<h3>${esc(g.judul)}</h3><p class="g-meta">${esc(g.meta)}</p>` +
      `<p class="g-desc">${esc(g.deskripsi)}</p></div>`;
    const img = kartu.querySelector("img");
    img.addEventListener("error", () => { img.src = gambarPengganti(g); }, { once: true });
    kartu.addEventListener("click", () => {
      $("#fotoBesar").src = img.src;
      $("#fotoBesar").alt = "Foto kegiatan: " + g.judul;
      $("#fotoTag").textContent = g.kategori;
      $("#fotoJudul").textContent = g.judul;
      $("#fotoMeta").textContent = g.meta;
      $("#fotoDesc").textContent = g.deskripsi;
      $("#dlgFoto").showModal();
    });
    grid.appendChild(kartu);
  });
}
$("#btnTutupFoto").addEventListener("click", () => $("#dlgFoto").close());
$("#dlgFoto").addEventListener("click", (e) => { if (e.target.id === "dlgFoto") e.target.close(); });

/* ---------- Form pendaftaran ---------- */
const form = $("#formDaftar");

function renderPilihanBahasa() {
  const wadah = $("#bahasaOptions");
  BAHASA.forEach((b) => {
    const label = document.createElement("label");
    label.className = "choice";
    label.innerHTML = `<input type="radio" name="bahasa" value="${esc(b)}"><span>${esc(b)}</span>`;
    wadah.appendChild(label);
  });
}

function setError(id, pesan) {
  const el = $("#err-" + id);
  el.textContent = pesan || "";
  const f = el.closest(".field");
  if (f) f.classList.toggle("invalid", Boolean(pesan));
  return !pesan;
}

function ambilData() {
  const pilih = (n) => (form.querySelector(`input[name="${n}"]:checked`) || {}).value || "";
  return {
    nik: $("#nik").value.trim(),
    nama: $("#nama").value.trim(),
    gender: pilih("gender"),
    hp: $("#hp").value.trim(),
    alamat: $("#alamat").value.trim(),
    bahasa: pilih("bahasa")
  };
}

function validasi(d) {
  let ok = true;
  if (!/^\d{16}$/.test(d.nik)) ok = setError("nik", "NIK harus terdiri dari 16 digit angka.") && ok;
  else if (peserta.some((p) => p.nik === d.nik)) ok = setError("nik", "NIK ini sudah terdaftar.") && ok;
  else setError("nik", "");

  if (d.nama.length < 3) ok = setError("nama", "Nama lengkap minimal 3 karakter.") && ok;
  else setError("nama", "");

  if (!d.gender) ok = setError("gender", "Pilih jenis kelamin.") && ok;
  else setError("gender", "");

  if (!/^(\+62|62|0)8\d{8,12}$/.test(d.hp.replace(/[\s-]/g, ""))) ok = setError("hp", "Masukkan nomor HP yang valid, contoh 081234567890.") && ok;
  else setError("hp", "");

  if (d.alamat.length < 10) ok = setError("alamat", "Alamat minimal 10 karakter.") && ok;
  else setError("alamat", "");

  if (!d.bahasa) ok = setError("bahasa", "Pilih salah satu bahasa pemrograman.") && ok;
  else setError("bahasa", "");
  return ok;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const d = ambilData();
  if (!validasi(d)) {
    const salah = form.querySelector(".invalid input, .invalid textarea");
    if (salah) salah.focus();
    return;
  }

  const yakin = await konfirmasi({ teks: "Apakah Anda sudah yakin untuk menyimpan?" });
  if (!yakin) return;

  d.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  d.tanggal = new Date().toISOString();
  peserta.push(d);
  simpan();

  tampilkanHasil(d);
  renderPeserta();
  form.reset();
  $("#hasil").scrollIntoView({ behavior: "smooth", block: "nearest" });
});

form.addEventListener("reset", () => {
  $$(".error").forEach((el) => (el.textContent = ""));
  $$(".field.invalid").forEach((f) => f.classList.remove("invalid"));
});

function tampilkanHasil(d) {
  const baris = [
    ["NIK", d.nik], ["Nama lengkap", d.nama], ["Jenis kelamin", d.gender],
    ["No. HP", d.hp], ["Alamat", d.alamat], ["Bahasa diminati", d.bahasa]
  ];
  const dl = $("#hasilList");
  dl.innerHTML = "";
  baris.forEach(([k, v]) => {
    const dt = document.createElement("dt"); dt.textContent = k;
    const dd = document.createElement("dd"); dd.textContent = v;
    dl.append(dt, dd);
  });
  $("#hasil").hidden = false;
  $("#hasilKosong").hidden = true;
}

/* ---------- Peserta ---------- */
function formatTanggal(iso) {
  const t = new Date(iso);
  if (isNaN(t)) return "-";
  return t.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function renderFilterBahasa() {
  const sel = $("#filterBahasa");
  sel.innerHTML = `<option value="">Semua bahasa</option>` + BAHASA.map((b) => `<option>${esc(b)}</option>`).join("");
}

function renderStatistik() {
  const total = peserta.length;
  const l = peserta.filter((p) => p.gender === "Laki-laki").length;
  const pr = peserta.filter((p) => p.gender === "Perempuan").length;

  const hitung = {};
  BAHASA.forEach((b) => (hitung[b] = 0));
  peserta.forEach((p) => { hitung[p.bahasa] = (hitung[p.bahasa] || 0) + 1; });
  const urut = Object.entries(hitung).sort((a, b) => b[1] - a[1]);
  const populer = total && urut[0][1] > 0 ? urut[0][0] : "-";

  $("#stats").innerHTML =
    `<div class="stat"><b>${total}</b><span>Total peserta</span></div>` +
    `<div class="stat"><b>${l}</b><span>Laki-laki</span></div>` +
    `<div class="stat"><b>${pr}</b><span>Perempuan</span></div>` +
    `<div class="stat"><b>${esc(populer)}</b><span>Paling diminati</span></div>`;

  $("#barsBox").hidden = total === 0;
  const maks = Math.max(1, ...Object.values(hitung));
  $("#bars").innerHTML = BAHASA.map((b) =>
    `<div class="bar-row"><span>${esc(b)}</span>` +
    `<div class="bar-track"><div class="bar-fill" style="width:${(hitung[b] / maks) * 100}%"></div></div>` +
    `<b>${hitung[b]}</b></div>`
  ).join("");
}

function dataTersaring() {
  const q = $("#cari").value.trim().toLowerCase();
  const b = $("#filterBahasa").value;
  return peserta.filter((p) => {
    const cocokBahasa = !b || p.bahasa === b;
    const cocokCari = !q || [p.nama, p.nik, p.hp, p.alamat].some((x) => String(x).toLowerCase().includes(q));
    return cocokBahasa && cocokCari;
  });
}

function renderPeserta() {
  $("#navCount").textContent = peserta.length;
  renderStatistik();

  const data = dataTersaring();
  const tbody = $("#tbody");
  tbody.innerHTML = "";

  data.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td>${i + 1}</td>` +
      `<td><strong>${esc(p.nama)}</strong></td>` +
      `<td class="mono">${esc(p.nik)}</td>` +
      `<td class="nowrap">${esc(p.gender)}</td>` +
      `<td class="nowrap">${esc(p.hp)}</td>` +
      `<td>${esc(p.alamat)}</td>` +
      `<td><span class="tag">${esc(p.bahasa)}</span></td>` +
      `<td class="nowrap">${esc(formatTanggal(p.tanggal))}</td>` +
      `<td></td>`;
    const hapus = document.createElement("button");
    hapus.type = "button";
    hapus.className = "btn btn-danger";
    hapus.textContent = "Hapus";
    hapus.addEventListener("click", async () => {
      const ya = await konfirmasi({ judul: "Hapus peserta", teks: `Hapus "${p.nama}" dari daftar peserta?`, ya: "Hapus", tidak: "Batal" });
      if (!ya) return;
      peserta = peserta.filter((x) => x.id !== p.id);
      simpan();
      renderPeserta();
    });
    tr.lastElementChild.appendChild(hapus);
    tbody.appendChild(tr);
  });

  const kosong = data.length === 0;
  $("#kosong").hidden = !kosong;
  if (kosong) {
    const adaData = peserta.length > 0;
    $("#kosongTeks").textContent = adaData ? "Tidak ada peserta yang cocok dengan pencarian." : "Belum ada peserta terdaftar.";
    $("#btnContoh").hidden = adaData;
    $(".kosong-aksi a").hidden = adaData;
  }
  $("#btnCsv").disabled = peserta.length === 0;
  $("#btnHapusSemua").disabled = peserta.length === 0;
}

$("#cari").addEventListener("input", renderPeserta);
$("#filterBahasa").addEventListener("change", renderPeserta);

/* Hapus semua */
$("#btnHapusSemua").addEventListener("click", async () => {
  const ya = await konfirmasi({ judul: "Hapus semua peserta", teks: `Semua data (${peserta.length} peserta) akan dihapus dan tidak bisa dikembalikan. Lanjutkan?`, ya: "Hapus semua", tidak: "Batal" });
  if (!ya) return;
  peserta = [];
  simpan();
  renderPeserta();
});

/* Ekspor CSV */
$("#btnCsv").addEventListener("click", () => {
  const kolom = ["No", "NIK", "Nama lengkap", "Jenis kelamin", "No. HP", "Alamat", "Bahasa", "Tanggal daftar"];
  // NIK & HP ditulis sebagai ="..." agar Excel tidak mengubahnya jadi notasi ilmiah
  const teks = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const angka = (v) => `="${v}"`;
  const baris = peserta.map((p, i) =>
    [i + 1, angka(p.nik), teks(p.nama), teks(p.gender), angka(p.hp), teks(p.alamat), teks(p.bahasa), teks(formatTanggal(p.tanggal))].join(",")
  );
  const csv = "\uFEFF" + [kolom.join(","), ...baris].join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "peserta-coding-academy.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

/* Data contoh */
$("#btnContoh").addEventListener("click", () => {
  const contoh = [
    ["3674010101990001", "Andi Prasetyo", "Laki-laki", "081234567801", "Jl. Mawar No. 12, Serpong, Tangerang Selatan", "JavaScript"],
    ["3674015505010002", "Siti Nurhaliza", "Perempuan", "082134567802", "Jl. Melati Raya No. 7, Pamulang, Tangerang Selatan", "Python"],
    ["3674012003980003", "Budi Santoso", "Laki-laki", "085234567803", "Perum Griya Asri Blok C3, Ciputat, Tangerang Selatan", "PHP"],
    ["3674016609020004", "Dewi Lestari", "Perempuan", "087834567804", "Jl. Cempaka No. 21, BSD City, Tangerang Selatan", "Dart (Flutter)"]
  ];
  contoh.forEach(([nik, nama, gender, hp, alamat, bahasa], i) => {
    if (peserta.some((p) => p.nik === nik)) return;
    peserta.push({
      id: "contoh" + i + Date.now().toString(36), nik, nama, gender, hp, alamat, bahasa,
      tanggal: new Date(Date.now() - i * 3600e3).toISOString()
    });
  });
  simpan();
  renderPeserta();
});

/* ---------- Mulai ---------- */
renderChips();
renderGaleri();
renderPilihanBahasa();
renderFilterBahasa();
renderPeserta();
tampilkan(location.hash.slice(1));