# Clip Maker

## O que é este projeto?

O **Clip Maker** é uma aplicação web que permite extrair momentos virais de vídeos usando inteligência artificial. O usuário faz upload de um vídeo, a plataforma gera uma transcrição automática e utiliza IA para identificar e recortar o segmento mais engraçado ou surpreendente, criando um clipe de 30 a 60 segundos.

## Desenvolvimento do projeto

Este projeto foi desenvolvido durante a participação na **Next Level Week (NLW)** da Rocketseat. Assisti às 3 aulas disponíveis e construí o Clip Maker seguindo os ensinamentos, aplicando conceitos de upload de mídia, integração com APIs de IA e manipulação de vídeos na nuvem.

## Utilização da IA

A IA desempenha um papel central no projeto:

- **Transcrição automática**: O vídeo é enviado para o Cloudinary, que gera uma transcrição usando tecnologia de reconhecimento de fala.
- **Análise de conteúdo**: A transcrição é enviada para o modelo **Gemini 2.5 Flash** (do Google), que analisa o texto e identifica o momento mais viral baseado em critérios como engajamento, humor ou surpresa.
- **Recorte inteligente**: Com base na resposta da IA, que fornece os segundos de início e fim (ex: `so_10,eo_40`), o vídeo é recortado automaticamente no Cloudinary, gerando o clipe final.

A IA auxilia no desenvolvimento ao sugerir melhorias no código, otimizar prompts e debugar integrações, tornando o processo mais eficiente.

## Como funciona

1. Insira sua chave da API do Gemini.
2. Faça upload do vídeo via widget do Cloudinary.
3. Aguarde a transcrição e análise da IA.
4. Visualize o clipe viral gerado automaticamente.

## Tecnologias utilizadas

- **Frontend**: HTML, CSS (Tailwind), JavaScript
- **APIs**: Cloudinary (upload e processamento de vídeo), Gemini (análise de IA)
- **Bibliotecas**: GSAP (animações), Lucide (ícones)

## Como executar

1. Clone o repositório.
2. Abra o `index.html` em um navegador.
3. Configure sua chave da API do Gemini.
4. Faça upload de um vídeo e veja a magia acontecer.