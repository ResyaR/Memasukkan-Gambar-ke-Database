require('dotenv').config(); // Load variabel dari .env
const { Pool } = require('pg');
const fs = require('fs');

// Koneksi ke PostgreSQL Supabase
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Membuat tabel jika belum ada
async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS images (
      id SERIAL PRIMARY KEY,
      name TEXT,
      image_base64 TEXT
    )
  `;
  await pool.query(query);
  console.log("Tabel 'images' siap.");
}

// Fungsi untuk menyimpan gambar ke database
async function insertImage(imagePath, imageName) {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');

  const query = INSERT INTO images (name, image_base64) VALUES ($1, $2) RETURNING id;
  const res = await pool.query(query, [imageName, base64Image]);
  console.log(Gambar '${imageName}' disimpan dengan id ${res.rows[0].id});
  return res.rows[0].id;
}


// Fungsi utama
async function main() {
  await createTable();

  // Masukkan gambar ke database
  const imageId = await insertImage('sample.jpg', 'Gambar Contoh');
  
  // Tutup koneksi database
  await pool.end();
}

main();
