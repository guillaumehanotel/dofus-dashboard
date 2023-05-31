import supabase from './supabaseClient.js'; // ou './supabaseClient.js' ou './db.js', etc.


// Récupérer l'identifiant du dashboard à partir de l'URL
const urlParams = new URLSearchParams(window.location.search);
const dashboardId = urlParams.get('id');

const user = JSON.parse(localStorage.getItem('user'));


async function fetchDashboards() {

    const { data: dashboards, error } = await supabase
        .from('dashboards')
        .select('id, title')
        .eq('user_id', user.id);

    if (error) {
        console.error('Error fetching dashboards: ', error.message);
    } else if (dashboards) {
        const sidebar = document.getElementById('sidebar');

        // Clear any existing dashboard links in the sidebar
        sidebar.innerHTML = '';

        dashboards.forEach(dashboard => {
            const link = document.createElement('a');
            link.classList.add('dashboard-item');
            link.href = `?id=${dashboard.id}`;
            link.textContent = dashboard.title;
            sidebar.appendChild(link);
        });
    }
}


// Fonction pour récupérer le dashboard
async function fetchLinksByDashboard(id) {
    const { data: dashboard, error } = await supabase
        .from('dashboards')
        .select(`
        title,
        links (
            url,
            title,
            image
        )
    `)
        .eq('id', dashboardId)
        .single();

    if (error) {
        console.error('Error fetching dashboard: ', error.message);
    } else if (dashboard) {
        const dashboardContainer = document.getElementById('dashboard-container');

        // Vider le conteneur de dashboard
        dashboardContainer.innerHTML = '';

        // Afficher le titre du dashboard
        const title = document.createElement('h1');
        title.innerText = dashboard.title;
        dashboardContainer.appendChild(title);
        // Parcourir et afficher chaque lien dans le dashboard
        dashboard.links.forEach(link => {
            renderLink(link);
        });

        // Ajouter une dernière carte pour créer un nouveau lien
        const newLinkCard = document.createElement('div');
        newLinkCard.classList.add('card', 'new-link-card');
        newLinkCard.addEventListener('click', openNewLinkForm);
        dashboardContainer.appendChild(newLinkCard);

        function renderLink(link) {
            // Créer les éléments HTML
            const card = document.createElement('div');
            const linkElement = document.createElement('a');
            const image = document.createElement('img');
            const content = document.createElement('div');
            const title = document.createElement('h2');

            // Ajouter les classes CSS aux éléments HTML
            card.classList.add('card');
            linkElement.target = '_blank';
            linkElement.href = link.url;
            image.src = link.image;
            image.alt = link.title;
            content.classList.add('content');

            // Ajouter le contenu texte aux éléments HTML
            title.textContent = link.title;

            // Ajouter les éléments HTML à la carte
            content.appendChild(title);
            card.appendChild(linkElement);
            card.appendChild(image);
            card.appendChild(content);

            // Ajouter la carte au conteneur
            dashboardContainer.appendChild(card);
        }

        function openNewLinkForm() {
            // Ouvrir une boîte de dialogue pour entrer l'URL du nouveau lien
            const url = window.prompt('Enter the URL of the new link:');
            if (!url) return;  // L'utilisateur a cliqué sur "Cancel" ou n'a entré aucune URL

            // Ouvrir une boîte de dialogue pour entrer le titre du nouveau lien
            const title = getSiteName(url)

            // Ouvrir une boîte de dialogue pour entrer l'image du nouveau lien
            let image = window.prompt('Enter the image URL of the new link:');
            if (!image) {
                image = 'https://caer.univ-amu.fr/wp-content/uploads/default-placeholder.png';
            }

            // Ajouter le nouveau lien à la base de données
            addNewLink(url, title, image);
        }

        async function addNewLink(url, title, image) {
            const { data: link, error } = await supabase
                .from('links')
                .insert([
                    { url: url, title: title, image: image, dashboard_id: dashboardId }
                ]);

            if (error) {
                console.error('Error adding new link:', error);
            } else {
                // Recharger le tableau de bord pour montrer le nouveau lien
                fetchLinksByDashboard(dashboardId);
            }
        }

    }
}


function getSiteName(url) {
    try {
        // Crée un nouvel objet URL
        let urlObject = new URL(url);

        // Récupère le nom d'hôte (ex : www.google.com)
        let hostname = urlObject.hostname;

        // Supprime les 'www.' si présents
        if (hostname.startsWith('www.')) {
            hostname = hostname.slice(4);
        }

        // Divise le nom de domaine en parties
        let parts = hostname.split('.');

        // La liste des domaines de premier niveau les plus courants
        const tlds = ['com', 'org', 'net', 'io', 'co', 'gov', 'edu', 'ac', 'fr'];

        // Si le domaine de premier niveau est dans la liste, prend la partie juste avant
        if (tlds.includes(parts[parts.length - 1])) {
            let siteName = parts[parts.length - 2];

            // Capitalise la première lettre et renvoie
            return siteName.charAt(0).toUpperCase() + siteName.slice(1);
        } else {
            // Sinon, prend la première partie comme nom du site
            let siteName = parts[0];

            // Capitalise la première lettre et renvoie
            return siteName.charAt(0).toUpperCase() + siteName.slice(1);
        }

    } catch (error) {
        console.error('Invalid URL');
        return null;
    }
}


fetchLinksByDashboard(dashboardId);
fetchDashboards()
