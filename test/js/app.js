import supabase from './supabaseClient.js';

// Fonction pour se déconnecter
async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.error('Error signing out: ', error.message);
    } else {
        localStorage.removeItem('user');
        document.getElementById('user-info').innerText = 'Déconnecté';
        document.getElementById('dashboard-list').innerHTML = ''; // Effacer la liste de dashboards
    }
}

async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'http://127.0.0.1:8080'
        }
    })
    if (error) {
        console.error('Error signing in: ', error.message);
    } else if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        document.getElementById('user-info').innerText = `Connecté comme ${user.email}`;
        fetchDashboards(user.id);
    }
}


// Fonction pour récupérer les dashboards de l'utilisateur
// Fonction pour récupérer les dashboards de l'utilisateur
async function fetchDashboards(userId) {
    console.log("FETCH DASHBOARDS")
    const { data: dashboards, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching dashboards: ', error.message);
    } else if (dashboards) {
        const dashboardList = document.getElementById('dashboard-list');
        dashboardList.innerHTML = ''; // Effacer l'ancienne liste de dashboards
        dashboards.forEach(dashboard => {
            const dashboardLink = document.createElement('a');
            dashboardLink.href = `/dashboard.html?id=${dashboard.id}`;
            dashboardLink.innerText = dashboard.title;
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'x';
            deleteButton.onclick = () => deleteDashboard(dashboard.id);
            dashboardLink.appendChild(deleteButton);
            dashboardList.appendChild(dashboardLink);
        });
    }
}

// Fonction pour supprimer un dashboard
async function deleteDashboard(dashboardId) {
    const { error } = await supabase
        .from('dashboards')
        .delete()
        .eq('id', dashboardId);

    if (error) {
        console.error('Error deleting dashboard: ', error.message);
    } else {
        const user = JSON.parse(localStorage.getItem('user'));
        fetchDashboards(user.id); // Actualiser la liste des dashboards
    }
}

// Gérer les changements de session
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        const user = session.user;
        localStorage.setItem('user', JSON.stringify(user));
        document.getElementById('user-info').innerText = `Connecté comme ${session.user.email}`;
        fetchDashboards(session.user.id);
    } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user');
        document.getElementById('user-info').innerText = 'Déconnecté';
        document.getElementById('dashboard-list').innerHTML = ''; // Effacer la liste de dashboards
    }
});

// Vérifier si l'utilisateur est déjà connecté
const user = JSON.parse(localStorage.getItem('user'));
if (user) {
    document.getElementById('user-info').innerText = `Connecté comme ${user.email}`;
    fetchDashboards(user.id);
}

// Lorsque le bouton "Se connecter avec Google" est cliqué
document.querySelector('#signin-btn').addEventListener('click', signInWithGoogle)
document.querySelector('#signout-btn').addEventListener('click', signOut)

// Lorsque le bouton "Sauvegarder le tableau" est cliqué
document.querySelector('.save-dashboard').addEventListener('click', async () => {
    const title = document.querySelector('.dashboard-title').value

    // Enregistrer le tableau de liens dans la base de données
    const { data, error } = await supabase
        .from('dashboards')
        .insert([
            { title: title, user_id: user.id }
        ])

    if (error) {
        console.error(error)
    } else {
        const user = JSON.parse(localStorage.getItem('user'));
        fetchDashboards(user.id); // Actualiser la liste des dashboards
    }
})
//
// const inputJson = document.querySelector('.input-json');
//
// inputJson.addEventListener('input', (e) => {
//     const url = e.target.value;
//     fetchData(url)
// });
//
// const url = inputJson.value;
// fetchData(url)
//
//
// function fetchData(url) {
//     fetch(url)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => renderCards(data))
//         .catch(error => console.error(error));
// }
//
// function renderCards(data) {
//     const sitesContainer = document.querySelector('.sites-container');
//
//     document.querySelector('body').style.backgroundImage = `url("${data.background}")`
//     document.title = data.title
//
//     // Parcourez les données du JSON et générez les cartes correspondantes
//     data.sites.forEach(site => {
//         // Créer les éléments HTML
//         const card = document.createElement('div');
//         const link = document.createElement('a');
//         const image = document.createElement('img');
//         const content = document.createElement('div');
//         const title = document.createElement('h2');
//
//         // Ajouter les classes CSS aux éléments HTML
//         card.classList.add('card');
//         link.target = '_blank';
//         link.href = site.url;
//         image.src = site.image;
//         image.alt = site.title;
//         content.classList.add('content');
//
//         // Ajouter le contenu texte aux éléments HTML
//         title.textContent = site.title;
//
//         // Ajouter les éléments HTML à la carte
//         content.appendChild(title);
//         card.appendChild(link);
//         card.appendChild(image);
//         card.appendChild(content);
//
//         // Ajouter la carte au conteneur
//         sitesContainer.appendChild(card);
//     });
// }

