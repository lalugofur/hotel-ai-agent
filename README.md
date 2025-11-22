# AI Hotel Agent - System Otomatis

## Video Demo

**Tonton demo lengkap di sini:** [Link Video Demo](https://drive.google.com/drive/folders/1J5_kh-gQ2MeT9Ip6WnUR9KUdufGeT5M7?usp=sharing)

Ini aplikasi yang dibuat untuk scrape data hotel, bikin konten pake AI, kemudian post otomatis ke app mobile dan sosmed tiap 2 jam.

## Yang Bisa Dilakuin

- **Ambil data hotel** dari Expedia & situs lain
- **AI bikin konten** blog dan postingan sosmed
- **App mobile** untuk liat hotel deals  
- **Auto post** ke Twitter & Facebook
- **Chatbot AI** di app buat tanya-tanya hotel
- **Jalan sendiri** tiap 2 jam tanpa perlu dieksekusi

## Teknologi yang Dipake

**Backend:**
- Node.js + Express
- MongoDB
- Puppeteer buat scraping
- OpenAI buat AI
- API Twitter & Facebook

## Cara Menjalankan

### 1. Backend Dulu
```bash
# Download project
https://github.com/lalugofur/hotel-ai-agent.git
cd ai-hotel-agent

# Pasang yang diperlukan
npm install

# Setup config
cp .env.example .env
# Edit file .env, isi API keys

# Nyalain database
mongod

# Jalanin server
npm run dev

# Workflow
- Tiap 2 jam sistem jalan sendiri
- Pilih lokasi random (Bali, Paris, Tokyo, dll)
- Ambil data hotel dari Expedia dll
- AI bikin blog dan postingan sosmed
- Post otomatis ke Twitter & Facebook
- Simpan semua ke database