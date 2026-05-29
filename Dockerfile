# Estágio de build
FROM node:20-alpine as build
WORKDIR /app

# Instalar dependências
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copiar código-fonte e compilar
COPY . .
RUN npm run build

# Estágio de produção (Nginx)
FROM nginx:alpine
# Copiar configuração do Nginx para roteamento do React (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copiar os arquivos gerados no estágio de build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
