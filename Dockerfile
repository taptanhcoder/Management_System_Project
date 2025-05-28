# Dockerfile

FROM node:22-slim

# Cài OpenSSL & psql client
RUN apt-get update -y \
 && apt-get install -y openssl libssl-dev postgresql-client \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Cài dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ source
COPY . .

# Sinh Prisma Client và build Next.js
RUN npx prisma generate
RUN npm run build

# Copy script chờ Postgres, chuyển CRLF -> LF và gán quyền
COPY wait-for-postgres.sh /usr/local/bin/wait-for-postgres.sh
RUN sed -i 's/\r$//' /usr/local/bin/wait-for-postgres.sh \
 && chmod +x /usr/local/bin/wait-for-postgres.sh

EXPOSE 3000

# Khi container khởi, sẽ chạy script chờ DB, migrate rồi start app
CMD ["sh", "/usr/local/bin/wait-for-postgres.sh"]
