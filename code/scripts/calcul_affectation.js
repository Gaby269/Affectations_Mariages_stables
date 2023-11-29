// Récupération des éléments du fichier html
const file_select = document.getElementById("choisir-fichier");
const read_button = document.getElementById("load-fichier");
const download_button = document.getElementById("download-fichier");
const display_file_name = document.getElementById("nom-fichier-choisi");
const display_file_contents = document.getElementById("contenu-fichier");
const missing_etablissement = document.getElementById("etablissement-vide");
const missing_etudiant = document.getElementById("etudiant-pas-affecte");

const affichage_preferences = document.getElementById('afficher-preferences');
const affichage_mariages = document.getElementById('afficher-mariages');
const affichage_satisfaction = document.getElementById('afficher-satisfaction');

const span_satisfaction_etudiants = document.querySelector(".satisfaction-etu");
const span_satisfaction_etablissements = document.querySelector(".satisfaction-etab");
const span_satisfaction_globale = document.querySelector(".satisfaction-globale");

/* ---- ERREUR ----*/
const erreur_fichier = document.getElementById('erreur-fichier');
const erreur_type_fichier = document.getElementById('erreur-type-fichier');

/* ---- AFFICHAGE ----*/
const preferencesTableEtud = document.getElementById('afficher-pref-etu');
const preferencesTableEtab = document.getElementById('afficher-pref-etab');


var mariages = {}; // pour y acceder depuis le eventListener
var nbEtu = 0;
var nbEtab = 0;

// Fonction pour vérifier si deux ensembles sont identiques
function estIdentique(ensemble1, ensemble2) {
    if (ensemble1.size !== ensemble2.size) {
        return false;
    }
    for (let element of ensemble1) {
        if (!ensemble2.has(element)) {
            return false;
        }
    }
    return true;
}


// Focntion qui implémente l'algorithme du mariage stable
function mariage_stables(preferences) {
    const nbEtudiants = preferences.nbEtudiants;
    const nbEtablissements = preferences.nbEtablissements;
    const preferencesEtudiants = preferences.preferencesEtudiants;
    const preferesEtablissement = preferences.preferesEtablissement;

    // Création d'un tableau des identifiants de chaque étudiants sans doublons
    const etudiants_libres = new Set();
    for (let i = 1; i <= nbEtudiants; i++) {
        etudiants_libres.add(i);
    }

    const mariages = {};
    let ensemblePrecedent = new Set(); // variable pour que ce soit le set précédent de la boucle
    let nbEtudiantVus = 0; // nombre d'étudiant déjà traité

    // Tant qu'il reste des étudiants à affecter, on dépile
    while (etudiants_libres.size > 0) {

        // Si le nombre d'étudiant déjà vue est le même que le nombre d'étudiant total et le set précédents est le même que celui actuel 
        if ((nbEtudiantVus >= nbEtudiants) && estIdentique(ensemblePrecedent, etudiants_libres)) {
            break; // donc on arrete la boucle de recherche et on renvoie le mariage
        }
        // Copiez l'ensemble actuel dans l'ensemble précédent pour les boucles
        ensemblePrecedent = new Set(etudiants_libres);

        // Récupération des inforamtions du premier étudiants de l'ensemble
        const etudiant = etudiants_libres.values().next().value;
        const etudiantPreferences = preferencesEtudiants[etudiant];

        // Parcourt des établissement dans l'odre de préférence
        for (const etablissement of etudiantPreferences) {

            const etudiantDansMariageActuel = mariages[etablissement];
            // Si l'établissement est libre, il n'a pas de mariage
            if (!etudiantDansMariageActuel) {
                mariages[etablissement] = etudiant;
                etudiants_libres.delete(etudiant);
                break;
            }

            // Sinon l'établissement est déjà marié à un autre étudiant
            else {
                const etablissement_preferences = preferesEtablissement[etablissement]; // préférences de cet établissement
                const indexEtudiantDansMariageActuel = etablissement_preferences.indexOf(etudiantDansMariageActuel); // position de l'étudiant déjà présent dans les préférences de l'établissement
                const indexNouveauMariage = etablissement_preferences.indexOf(etudiant); // position de l'étudiant courant dans les préférences de l'établissement à l'origine
                // Si le nouvel étudiant est préféré à l'ancien
                if (indexNouveauMariage < indexEtudiantDansMariageActuel) {
                    mariages[etablissement] = etudiant;
                    etudiants_libres.delete(etudiant);
                    etudiants_libres.add(etudiantDansMariageActuel);
                    break;
                }
                // sinon le nouvel étudiant est pas préféré, on le supprime et on le réajoute pour qu'il soit à la fin
                else {
                    etudiants_libres.delete(etudiant);
                    etudiants_libres.add(etudiant);
                }
            }
        }
        nbEtudiantVus++ // incremente le compteur du nombre d'étudiant vue
    }
    return mariages;
}



function affichage_des_preferences(titre, data, table) {
    table.innerHTML = "";

    for (const item in data) {
        const preferencesItem = data[item];

        const ligne = document.createElement('tr');

        const titleCell = document.createElement('td');
        titleCell.innerText = `${titre} N°${item}`;
        ligne.appendChild(titleCell);

        const preferencesCell = document.createElement('td');
        const preferencesList = preferencesItem.map(preference => `${preference}`);
        preferencesCell.innerHTML = `${preferencesList.join(' ≻ ')}`;
        ligne.appendChild(preferencesCell);

        table.appendChild(ligne);
    }
}



function affichage_des_non_affectes(preferences, mariages) {
    const tab_etab = Array.from({ length: preferences.nbEtablissements }, (_, index) => index + 1); // tableau d'indice
    const tab_etud = Array.from({ length: preferences.nbEtudiants }, (_, index) => index + 1);

    const etablissementVide = tab_etab.filter(etablissement => !mariages.hasOwnProperty(etablissement)); // filtre pour retirer ceux qui sont dans un mariage
    const etudiantVide = tab_etud.filter(etudiant => !Object.values(mariages).includes(etudiant));

    if (etablissementVide.length !== 0) {
        missing_etablissement.innerHTML = `<ul><li><b>ÉTABLISSEMENTS sans étudiants :</b> ${etablissementVide.join(', ')}</li><ul>`;
        missing_etablissement.style.display = "block";
    } else {
        missing_etablissement.style.display = "none";
    }

    if (etudiantVide.length !== 0) {
        missing_etudiant.innerHTML = `<ul><li><b>ÉTUDIANTS sans établissements :</b> ${etudiantVide.join(', ')}</li><ul>`;
        missing_etudiant.style.display = "block";
    } else {
        missing_etudiant.style.display = "none";
    }
}



// click pour selectionner un fichier sur son ordinateur
read_button.addEventListener("click", function() {
    file_select.click();
});


// Trigger lorsqu'on sélectionne un fichier
file_select.addEventListener("change", function() {
    erreur_fichier.style.display = 'none';
    erreur_type_fichier.style.display = 'none';

    // Récupère le fichier sélectionné
    const selectedFile = file_select.files[0];

    // Si le fichier existe
    if (selectedFile) {

        const reader = new FileReader();

        // Focntion de trigger qui sera exécutée lorsque le fichier sera complètement chargé
        reader.onload = function(event) {
            // Affichage du nom du fichier sélectionné
            display_file_name.querySelector('span').textContent = selectedFile.name;
            display_file_name.style.display = 'block';

            // Récupère le contenu du fichier
            const contenu_fichier = event.target.result;
            try {
                const preferences = JSON.parse(contenu_fichier);
                if (!("nbEtudiants" in preferences &&
                    "nbEtablissements" in preferences &&
                    "preferencesEtudiants" in preferences &&
                    "preferesEtablissement" in preferences)) {
                    throw new Error("Le fichier n'est pas un fichier JSON valide");
                }

                nbEtu = parseInt(preferences.nbEtudiants);
                nbEtab = parseInt(preferences.nbEtablissements);
                mariages = mariage_stables(preferences);

                // download_button.style.display = "block";


                /************   Affichage des préférences par étudiants   ***********/
                affichage_des_preferences("Étu", preferences.preferencesEtudiants, preferencesTableEtud);
                affichage_des_preferences("Étab", preferences.preferesEtablissement, preferencesTableEtab);



                /************   Affichage des mariages   ***********/
                let resultatsMariages = ""// "<h4><b><center>Table des mariages stables :</center></b></h4><br>";
                resultatsMariages += `<div class="conteneur-table"><table>`;
                resultatsMariages += "<tr><th>Étudiants</th><th>Établissements</th></tr>";
                for (const etablissement in mariages) {
                    let satisfaction = calcul_satisfaction_partielle(preferences, mariages, etablissement);
                    let satisfactionEtablissement = (100 * satisfaction.satisfactionEtablissement / nbEtu).toFixed(1);
                    let satisfactionEtudiant = (100 * satisfaction.satisfactionEtudiant / nbEtab).toFixed(1);
                    resultatsMariages += "<tr>";
                    resultatsMariages += `<td>Étudiant n°${mariages[etablissement]} - satisfaction : ${satisfactionEtudiant}%</td>`;
                    resultatsMariages += `<td>Établissement n°${etablissement} - satisfaction : ${satisfactionEtablissement}%`;
                    resultatsMariages += "</tr>";
                }
                resultatsMariages += "</table></div>";
                display_file_contents.innerHTML = resultatsMariages;


                /************   Affichage des établissements sans étudiant   ***********/
                affichage_des_non_affectes(preferences, mariages);


                /************   Calcul de la satisfaction   ***********/
                const satisfactions = calcul_satisfaction_totale(preferences, mariages);
                const satisfactionMaximale = satisfactions.satisfactionMaximale;
                const satisfactionEtudiants = satisfactions.satisfactionEtudiants;
                const satisfactionEtablissements = satisfactions.satisfactionEtablissements;
                const satisfactionMoyennePonderee = (satisfactionEtablissements * nbEtab + satisfactionEtudiants * nbEtu) / (satisfactionMaximale * (nbEtab + nbEtu));

                // console.log("Satisfaction des maximale théorique :", satisfactionMaximale);
                // console.log("Satisfaction des Étudiants :", satisfactionEtudiants);
                // console.log("Satisfaction des Établissements :", satisfactionEtablissements);
                // console.log("Satisfaction pondérée :", (satisfactionEtablissements * nbEtab + satisfactionEtudiants * nbEtu));

                span_satisfaction_etudiants.innerHTML = (100 * satisfactionEtudiants / satisfactionMaximale).toFixed(1) + "%";
                span_satisfaction_etablissements.innerHTML = (100 * satisfactionEtablissements / satisfactionMaximale).toFixed(1) + "%";
                span_satisfaction_globale.innerHTML = (100 * satisfactionMoyennePonderee).toFixed(2) + "%";

                // Affichage des divs pour les différentes parties
                affichage_preferences.style.display = 'block';
                affichage_mariages.style.display = 'block';
                affichage_satisfaction.style.display = 'block';
            }

            catch (error) {
                erreur_fichier.style.display = 'block';
                console.log(error);

                affichage_preferences.style.display = 'none';
                affichage_mariages.style.display = 'none';
                affichage_satisfaction.style.display = 'none';
            }
        }

        // Lecture du contenu du fichier pour déclencher le trigger 'onload' (plus haut)
        reader.readAsText(selectedFile);
    }
    // Si le fichier n'existe pas
    else {
        erreur_type_fichier.style.display = 'block';
    }
});


// bouton pour télécharger les affectations
download_button.addEventListener("click", function() {
    const jsonData = JSON.stringify(mariages);
    const blob = new Blob([jsonData], { type: "application/json" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `affectations-${nbEtu}-${nbEtab}.json`; // nom du fichier
    link.click();
    URL.revokeObjectURL(blobUrl);
});