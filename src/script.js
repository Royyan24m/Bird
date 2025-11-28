// Setup canvas dan context untuk menggambar
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Menyesuaikan ukuran canvas dengan ukuran layar
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Memuat gambar burung
const birdImage = new Image();
birdImage.src = "../assets/akmal.png"; // Ganti dengan lokasi gambar burung PNG

// Variabel untuk burung
const birdWidth = 60;
const birdHeight = 60;
const gravity = 0.15;  // Pengaruh gravitasi
const lift = -4;       // Pengaruh gaya angkat saat burung terbang
let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdX = 100;
let isGameOver = false;
let score = 0;

// Variabel untuk pipa
const pipeWidth = canvas.width * 0.1;
const maxPipeHeight = canvas.height * 0.5;
const minPipeHeight = canvas.height * 0.3;
const pipeGap = canvas.height * 0.3;
let pipes = [];

// Status permainan
let gameStarted = false;
let collisionDetected = false;

// Fungsi untuk membuat pipa baru dengan ketinggian acak
function createPipe() {
  const pipeHeightTop = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
  const pipeHeightBottom = canvas.height - pipeHeightTop - pipeGap;
  pipes.push({
    x: canvas.width + 200,
    heightTop: pipeHeightTop,
    heightBottom: pipeHeightBottom
  });
}

// Fungsi untuk menggambar burung
function drawBird() {
  ctx.drawImage(birdImage, birdX, birdY, birdWidth, birdHeight);
}

// Fungsi untuk menggambar pipa (atas dan bawah)
function drawPipes() {
  ctx.fillStyle = "#32CD32";  // Warna pipa
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.heightTop); // Pipa atas
    ctx.fillRect(pipe.x, canvas.height - pipe.heightBottom, pipeWidth, pipe.heightBottom); // Pipa bawah
  });
}

// Fungsi untuk memperbarui posisi burung
function updateBird() {
  if (!collisionDetected) {
    birdVelocity += gravity;
    birdY += birdVelocity;
  }

  if (birdY + birdHeight > canvas.height || birdY < 0) {
    isGameOver = true;
  }
}

// Fungsi untuk memperbarui posisi pipa dan menghapus pipa yang sudah keluar layar
function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 3; // Pipa bergerak ke kiri
  });

  // Menghapus pipa yang sudah keluar dari layar
  if (pipes[0] && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
    score++;
  }

  // Membuat pipa baru jika yang lama sudah keluar layar
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
    createPipe();
  }
}

// Fungsi untuk mendeteksi tabrakan antara burung dan pipa
function detectCollision() {
  pipes.forEach(pipe => {
    if (birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth) {
      if (birdY < pipe.heightTop || birdY + birdHeight > canvas.height - pipe.heightBottom) {
        collisionDetected = true;
      }
    }
  });
}

// Fungsi untuk menggambar skor
function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 20, 50);
}

// Fungsi untuk menggambar teks Game Over
function drawGameOver() {
  const gameOverText = document.createElement("div");
  gameOverText.className = "gameOverText";
  gameOverText.innerHTML = `Game Over!<br>Score: ${score}`;
  document.body.appendChild(gameOverText);
}

// Fungsi utama yang menjalankan permainan
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Menghapus gambar sebelumnya

  if (!isGameOver) {
    if (!collisionDetected) {
      updateBird();
      updatePipes();
      detectCollision();
      drawBird();
      drawPipes();
      drawScore();
    } else {
      drawBird();  // Burung tetap terlihat setelah tabrakan
      drawPipes(); // Pipa tetap terlihat
    }

    requestAnimationFrame(gameLoop); // Memanggil fungsi gameLoop secara terus menerus
  } else {
    drawGameOver(); // Menampilkan teks Game Over jika permainan berakhir
  }
}

// Fungsi untuk menggerakkan burung dengan klik mouse atau spacebar
canvas.addEventListener("click", function () {
  if (gameStarted && !isGameOver) {
    birdVelocity = lift;
  }
});

// Fungsi untuk menggerakkan burung dengan tombol spacebar
window.addEventListener("keydown", function (e) {
  if (e.code === "Space" && gameStarted && !isGameOver) {
    birdVelocity = lift;
  }
});

// Menyesuaikan ukuran canvas saat ukuran jendela berubah
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Fungsi untuk memulai permainan
function startGame() {
  gameStarted = true;
  document.getElementById("startButton").style.display = "none"; // Sembunyikan tombol mulai
  createPipe(); // Membuat pipa pertama
  gameLoop(); // Memulai loop permainan
}

// Menambahkan event listener untuk tombol mulai
document.getElementById("startButton").addEventListener("click", startGame);
