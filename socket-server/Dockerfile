# Gunakan Node.js
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy sisa kodingan
COPY . .

# Compile TypeScript ke JavaScript (Folder dist)
RUN npm run build
# ----------------------

# Expose port (hanya dokumentasi)
EXPOSE 8080

# Jalankan file JavaScript hasil compile (Bukan ts-node lagi)
CMD ["npm", "run", "start:prod"]