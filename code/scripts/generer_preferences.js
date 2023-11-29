// Récupération des éléments du fichier html
/* ---- INPUT ----*/
const input_nbEtudiant = document.getElementById('nbEtudiants');
const input_nbEtablissements = document.getElementById('nbEtablissements');
/* ---- ERREUR ----*/
const erreur_etudiants = document.getElementById('erreur-etudiants');
const erreur_etablissements = document.getElementById('erreur-etablissements');


// Fonction qui permet de générer un tableau de taille n contenant des nombre compris entre 0 et n répartie aléatoirement
function creer_liste_melangee(n) {
    let arr = Array.from({ length: n }, (_, index) => index + 1)
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}



// Focntion qui génère le fichier json de préférence qui contient un dictionnaire avec les informations demandés
function generer_preferences() {
    erreur_etudiants.style.display = 'none';
    erreur_etablissements.style.display = 'none';

    // Récupérer les informations des inputs
    let nbEtudiants = input_nbEtudiant.value
    let nbEtablissements = input_nbEtablissements.value

    // Gerer les erreurs
    if (isNaN(nbEtudiants) || nbEtudiants < 1 || nbEtudiants > 5000) {
        erreur_etudiants.style.display = 'block';
        return;
    }
    else if (isNaN(nbEtudiants) || nbEtablissements < 1 || nbEtablissements > 5000) {
        erreur_etablissements.style.display = 'block';
        return;
    }

    console.log("Nb d'étudiant : ", nbEtudiants, " - Nb d'établissement : ", nbEtablissements);

    // Création du dictionnaire des préférences
    let preferences = {
        "nbEtudiants": nbEtudiants,
        "nbEtablissements": nbEtablissements,
        "preferencesEtudiants": {}, // { etu1 : [eta1, eta2, eta3], etu2 ...}
        "preferesEtablissement": {}, // { eta1 : [etu1, etu2, etu3], eta2 ...}
    };

    // Récuperer les préférences
    for (let i = 1; i <= nbEtudiants; i++) {
        preferences.preferencesEtudiants[i] = creer_liste_melangee(nbEtablissements);
    }
    for (let i = 1; i <= nbEtablissements; i++) {
        preferences.preferesEtablissement[i] = creer_liste_melangee(nbEtudiants);
    }

    // Création d'un lien vers le fichier pour le télécharger
    const jsonData = JSON.stringify(preferences);
    const blob = new Blob([jsonData], { type: "application/json" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `preferences-${nbEtudiants}-${nbEtablissements}.json`; // nom du fichier
    link.click();
    URL.revokeObjectURL(blobUrl);
}