# Habits ( Server )

 ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) 
 ![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)


![image](https://user-images.githubusercontent.com/50121055/213936358-93acde34-2c5d-4a6a-bc80-8b9df6cbdcf0.png)


## Sobre o projeto 
 Esta é o server do Habits, aplicativo de monitaramento de hábitos planejado pela [RocketSeat](https://www.rocketseat.com.br/). Essa aplicação consiste em um sistema para monitorar hábitos diários dos usuários
 permitindo o controle de sua rotina em busca de novas praticas saudáveis.
 
 Essa aplicação possui uma versão web, disponível em: https://github.com/GotemBarbosa/NLW-Setup-Web  
 E também a versão mobile, disponível em: https://github.com/GotemBarbosa/NLW-Setup-Mobile


## Como rodar o projeto:

- Clone este repositório

- Baixe as dependências:

`npm install`

- Configure e inicie o banco de dados via Prisma:  

`npx prisma init --datasource-provider SQLite`  
`npx prima migrate dev`  

- Configure e inicie o projeto 

`npm run build`

`npm run dev`
