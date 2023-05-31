
[![Netlify Status](https://api.netlify.com/api/v1/badges/588928b7-440f-4cf5-91e7-e1be8e5a56cb/deploy-status)](https://app.netlify.com/sites/favoris/deploys)

J'aimerai faire une application web : 

Un site permettant de créer des "dashboard" de liens présentés sous forme de quadrillage de card.
Une card c'est :
- un lien
- un titre
- une image

L'utilisateur devra se connecter au site avec un compte Google.
L'utilisateur peut avoir plusieurs dashboard.
L'utilisateur peut naviguer entre ses dashboard à l'aide d'une sidebar à gauche de l'écran listant ses dashboard (qui ont donc un titre).
Par défaut un utilisateur a un seul dashboard vide.
Le site possède une marketplace de dashboard où les gens qui ont réalisés leurs dashboard peuvent en partager une copie sur la marketplace.
L'utilisateur peut naviguer dans les dashboard de la marketplace pour choisir un dashboard à copier dans ses propres dashboard.
Au sein d'un dashboard on peut ajouter/modifier/supprimer les cards.
Un utilisateur peut créer/renommer/supprimer des dashboard.

J'aimerai faire un projet qui se passe d'un language back donc j'aimerai utiliser les fonctionnalités de Supabase pour réaliser toutes les features back-end.
Ci-dessous le code de l'ébauche de l'application pour l'instant statique qui se base sur une url en json pour peupler les cards. Mais maintenant je voudrais une app complète dynamique.

Le HTML :

<!doctype html>
<html class="no-js" lang="fr">

<head>
  <meta charset="utf-8">
  <title>Link Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>

  <link rel="stylesheet" href="dist/css/normalize.css">
  <link rel="stylesheet" href="dist/css/main.css">

  <meta name="theme-color" content="#fafafa">
</head>

<body>

<div class="input-container">
  <input class="input-json"
         type="text"
         value="https://gist.githubusercontent.com/guillaumehanotel/c211c9b80be6d7545694b262e0db3e5f/raw/3d7562a403a93dd4060c873125344d67c2d48a0f/dofus-sites.json">
</div>

  <div class="sites-container">

  </div>

  <script type="module" src="test/js/app.js"></script>
</body>

</html>


Le CSS : 

body {
font-family: 'Roboto', sans-serif;
padding: 4rem;

    background-size: cover;
}

.input-container {
width: 100%;
text-align: center;
}

.input-json {
width: 70%;

    color: white;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);

    margin-bottom: 2rem;
}

.sites-container {
display: flex;
flex-direction: row;
flex-wrap: wrap;
align-content: flex-start;
}

.card {
display: inline-block;
margin: 10px;
width: 200px;
height: 200px;
box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
overflow: hidden;
position: relative;

    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.card img {
width: 100%;
height: 100%;
object-fit: cover;
object-position: center;
}

.card .content {
position: absolute;
bottom: 0;
left: 0;
width: 100%;
padding: 10px;
box-sizing: border-box;
background-color: rgba(0, 0, 0, 0.7);
color: #fff;
}

.card .content h2 {
margin: 0;
font-size: 1.2em;
font-weight: normal;
text-align: center;
}

.card a {
display: block;
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 1;
}

Le JS : 


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

Modifie moi ce code pour prendre en compte les features demandées






