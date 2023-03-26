
const inputJson = document.querySelector('.input-json');

inputJson.addEventListener('input', (e) => {
    const url = e.target.value;
    fetchData(url)
});

const url = inputJson.value;
fetchData(url)


function fetchData(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => renderCards(data))
        .catch(error => console.error(error));
}

function renderCards(data) {
    const sitesContainer = document.querySelector('.sites-container');

    document.querySelector('body').style.backgroundImage = `url("${data.background}")`
    document.title = data.title

    // Parcourez les données du JSON et générez les cartes correspondantes
    data.sites.forEach(site => {
        // Créer les éléments HTML
        const card = document.createElement('div');
        const link = document.createElement('a');
        const image = document.createElement('img');
        const content = document.createElement('div');
        const title = document.createElement('h2');

        // Ajouter les classes CSS aux éléments HTML
        card.classList.add('card');
        link.target = '_blank';
        link.href = site.url;
        image.src = site.image;
        image.alt = site.title;
        content.classList.add('content');

        // Ajouter le contenu texte aux éléments HTML
        title.textContent = site.title;

        // Ajouter les éléments HTML à la carte
        content.appendChild(title);
        card.appendChild(link);
        card.appendChild(image);
        card.appendChild(content);

        // Ajouter la carte au conteneur
        sitesContainer.appendChild(card);
    });
}

