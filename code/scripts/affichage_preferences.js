const section_preferences = document.querySelector("#afficher-preferences");
const section_mariages = document.querySelector("#afficher-mariages");

const header_preferences = document.querySelector(".replier-preferences");
const header_mariages = document.querySelector(".replier-mariages");

const span_sections_preferences = document.querySelector(".span-replier-preferences");
const span_sections_mariages = document.querySelector(".span-replier-mariages");

// Trigger pour replier la section "affichage des préférences"
section_preferences.addEventListener("click", () => {
    const contenu = header_preferences.nextElementSibling.nextElementSibling; 
    if (contenu.style.display != "block" ) { 
        contenu.style.display = "block"; 
        span_sections_preferences.innerHTML = "expand_less";
    } 
    else { 
        contenu.style.display = "none"; 
        span_sections_preferences.innerHTML = "expand_more";
    }
});

// Trigger pour replier la section "affectations"
section_mariages.addEventListener("click", () => {
    const contenu = header_mariages.nextElementSibling.nextElementSibling; 
    if (contenu.style.display != "none") { 
        contenu.style.display = "none"; 
        span_sections_mariages.innerHTML = "expand_more";
    } 
    else { 
        contenu.style.display = "block"; 
        span_sections_mariages.innerHTML = "expand_less";
    }
});
