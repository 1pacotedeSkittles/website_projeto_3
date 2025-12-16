function onTextReady(text) {

const urls = text.split('\n');

for (const url of urls) {
    const image = document.createElement('img');
    image.src = url;
    document.body.append(image);
    image.onload = () => console.log('✅ Imagem carregada:', url);
    image.onerror = () => console.error('❌ Erro ao carregar:', url);
}
}

function onResponse(response) {
return response.text();
}

fetch('/testes_diogo_3/assets/links_url.txt')
.then(onResponse)
.then(onTextReady);