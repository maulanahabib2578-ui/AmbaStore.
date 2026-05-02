let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

// tambah produk
function beli(nama, harga) {
  let item = keranjang.find(i => i.nama === nama);

  if (item) {
    item.qty++;
  } else {
    keranjang.push({ nama, harga, qty: 1 });
  }

  simpan();
  render();
  notif(nama + " ditambahkan");
}

// render
function render() {
  const list = document.getElementById("list-keranjang");
  const totalText = document.getElementById("total");
  const btn = document.getElementById("checkout-btn");
  const count = document.getElementById("cart-count");

  list.innerHTML = "";
  let total = 0;
  let jumlah = 0;

  keranjang.forEach(item => {
    total += item.harga * item.qty;
    jumlah += item.qty;

    let li = document.createElement("li");
    li.className = "item";

    li.innerHTML = `
      ${item.nama} x${item.qty}
      <div>
        <button onclick="kurang('${item.nama}')">-</button>
        <button onclick="tambah('${item.nama}')">+</button>
        <button onclick="hapus('${item.nama}')">❌</button>
      </div>
    `;

    list.appendChild(li);
  });

  totalText.textContent = "Total: Rp" + total;
  count.textContent = jumlah;

  // disable checkout
  btn.disabled = keranjang.length === 0;
}

// tambah qty
function tambah(nama) {
  let item = keranjang.find(i => i.nama === nama);
  item.qty++;
  simpan();
  render();
}

// kurang qty
function kurang(nama) {
  let item = keranjang.find(i => i.nama === nama);
  item.qty--;

  if (item.qty <= 0) {
    keranjang = keranjang.filter(i => i.nama !== nama);
  }

  simpan();
  render();
}

// hapus
function hapus(nama) {
  keranjang = keranjang.filter(i => i.nama !== nama);
  simpan();
  render();
}

// checkout
function checkout() {
  if (keranjang.length === 0) {
    notif("Keranjang kosong!");
    return;
  }

  notif("Checkout berhasil!");
  keranjang = [];
  simpan();
  render();
}

// toggle popup
function toggleCart() {
  const cart = document.getElementById("cart-popup");
  const overlay = document.getElementById("overlay");

  cart.classList.toggle("active");
  overlay.classList.toggle("active");
}

// simpan
function simpan() {
  localStorage.setItem("keranjang", JSON.stringify(keranjang));
}

// notif
function notif(teks) {
  const n = document.createElement("div");
  n.className = "notif";
  n.textContent = teks;
  document.body.appendChild(n);

  setTimeout(() => n.remove(), 2000);
}

// load awal
window.onload = render;
window.addEventListener("click", function(e) {
  const cart = document.getElementById("cart-popup");

  if (e.target === cart) {
    cart.classList.remove("active");
  }
});document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    document.getElementById("cart-popup").classList.remove("active");
  }
});let startX = 0;

const cart = document.getElementById("cart-popup");

cart.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

cart.addEventListener("touchmove", (e) => {
  let moveX = e.touches[0].clientX;
  let diff = moveX - startX;

  if (diff > 50) {
    // geser kanan = tutup
    toggleCart();
  }
});