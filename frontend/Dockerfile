# ESTÁGIO 1: Build do React
FROM node:20 as build-stage
WORKDIR /app
COPY package*.json ./
# Instala as dependências
RUN npm install
# Copia o resto dos arquivos
COPY . .
# Gera a pasta 'dist' (o site otimizado)
RUN npm run build

# ESTÁGIO 2: Servidor Nginx (Produção)
FROM nginx:alpine as production-stage
# Copia o build do React para a pasta do Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Copia nossa configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]