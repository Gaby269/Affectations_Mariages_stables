// Fonction qui calcul de toutes les satisfactions à partir des préférences et du mariage stable
function calcul_satisfaction_totale(preferences_initiales, mariages_obtenus) {

    const nbEtu = preferences_initiales.nbEtudiants;
    const nbEtab = preferences_initiales.nbEtablissements;

    const satisfactionMaximale = nbEtu * nbEtab;
    let satisfactionEtudiants = 0;
    let satisfactionEtablissements = 0;

    // Comme on itère que sur ceux qui ont un mariage, ceux qui n'ont pas été affecté ajoutent un score de 0
    for (const etablissement in mariages_obtenus) { 
        const etudiant = mariages_obtenus[etablissement];

        // On regarde la position dans le tableau des préférences
        const classementDeEtudiant = preferences_initiales.preferencesEtudiants[etudiant].indexOf(parseInt(etablissement));
        const classementDeEtablissement = preferences_initiales.preferesEtablissement[etablissement].indexOf(etudiant);

        // Le score est déterminé par la position dans les préférences, le + préféré = score max
        satisfactionEtudiants += nbEtab - classementDeEtudiant;
        satisfactionEtablissements += nbEtu - classementDeEtablissement;
    }

    return { satisfactionMaximale, satisfactionEtudiants, satisfactionEtablissements };
}

// Fonction qui calcul les satisfactions des étudiants et établissements à partir des préférences,du mariages stables et du nombre d'établissement
function calcul_satisfaction_partielle(preferences_initiales, mariages_obtenus, num_etablissement) {
    let satisfactionEtudiant = 0;
    let satisfactionEtablissement = 0;

    // Comme on itère que sur ceux qui ont un mariage, ceux qui n'ont pas été affecté ajoutent un score de 0
    for (const etablissement in mariages_obtenus) { 
        if (etablissement == num_etablissement) {
            const etudiant = mariages_obtenus[etablissement];
            
            // On regarde la position dans le tableau des préférences
            const classementDeEtudiant = preferences_initiales.preferencesEtudiants[etudiant].indexOf(parseInt(etablissement));
            const classementDeEtablissement = preferences_initiales.preferesEtablissement[etablissement].indexOf(etudiant);
    
            // Le score est déterminé par la position dans les préférences, le + préféré = score max
            satisfactionEtudiant = nbEtab - classementDeEtudiant;
            satisfactionEtablissement = nbEtu - classementDeEtablissement;
        }
    }
    return { satisfactionEtudiant, satisfactionEtablissement };
}