**Créez un site accessible pour une plateforme de photographes**

Scenario
Depuis quelques semaines, vous êtes développeur junior chez Techasite, une société de conseil spécialisée dans le développement de sites web et d'applications mobiles.

Avec votre cheffe de projet Amanda et le Designer UI, vous venez de faire une réunion de lancement du projet avec un nouveau client, FishEye. FishEye est un site web qui permet aux photographes indépendants de présenter leurs meilleurs travaux. Ils ont récemment levé des fonds et aimeraient mettre à jour leur site web. 

Après la réunion de lancement, vous voyez un mail de votre cheffe de projet concernant le projet FishEye. Vous l'ouvrez immédiatement :

Objet : Réunion de lancement FishEye
De : Amanda
À : Moi

Salut, 

Merci d'avoir participé à la réunion de ce matin ! Pour résumer, notre objectif est de construire un prototype fonctionnel d'un nouveau site web que nous pourrons présenter à FishEye lors de notre prochaine réunion avec les clients. Tu seras chargé de fournir tout le HTML, le CSS et le JavaScript nécessaires au prototype. Notre équipe de back-end intégrera le système existant de FishEye une fois que tu auras terminé le code pour ta partie du projet.

Pour t’aider à démarrer, voici toutes les informations que j'ai recueillies auprès du client :

Mes notes de réunion détaillant les principales fonctionnalités et les exigences techniques à mettre en œuvre. 
Les maquettes approuvées, développées par notre designer. Tu vas créer une page principale ainsi qu’une page avec les informations pour chaque photographe de l’échantillon. 
Des exemples de photos et de vidéos de FishEye, que tu devras utiliser pour la conception des pages. 
Des exemples de données au format JSON, que tu pourras utiliser pour créer les différentes pages des photographes de façon dynamique. Ce format imite la structure des données dans la base de données, donc ne modifie pas les données existantes. La seule modification que tu peux réaliser est l'ajout d'un champ description pour la description de chaque image (pour les lecteurs d'écran).
J'avais demandé à Zoé de s’occuper de ce projet, mais après avoir rédigé un premier jet très rapidement, elle a dû passer à autre chose. Tu trouveras la base de son code sur ce repo avec une partie du HTML et CSS mis en place, ce qui devrait t’aider. Tu peux forker son repo pour te lancer dans le code.

Bien que le site web soit un prototype, il devrait correspondre aux maquettes et fonctionner correctement (pas d'erreur dans la console). Comme l'a mentionné le client lors de la réunion de lancement, sa priorité absolue est l'accessibilité. Veille à construire le site conformément aux exigences d'accessibilité indiquées dans mes notes.

Une fois que tu m'auras envoyé le repo GitHub avec le code complété, nous passerons en revue et vérifierons toutes les fonctionnalités des pages. Je te demanderai également de faire une démonstration de la navigation du site au moyen du clavier pour qu’on s’assure qu'il est utilisable par les lecteurs d'écran.  

De plus, avant de soumettre ton travail, assure-toi qu'il respecte bien les contraintes techniques indiquées dans mes notes de réunion.

Bonne chance et montre-moi ce que tu sais faire !

Amanda
Cheffe de Projet @Techasite

Lorsque vous commencez à regarder les maquettes, vous recevez un message instantané de Zoé, une développeuse senior que vous admirez beaucoup. Elle vous a encadré et a effectué un grand nombre de vos révisions de code :

Zoé : Salut ! Amanda m'a dit qu'elle t'avait chargé de développer le premier prototype du projet FishEye, c'est bien ça ?

Moi : Oui, je viens de commencer !

Zoé : Tant mieux pour toi ! J'avais commencé ce projet, mais on m'a passé sur autre chose. Je pense que tu apprendras beaucoup au cours du processus. Je voulais juste te donner un petit conseil technique. Amanda a mentionné que FishEye a des vidéos et des photos pour le photographe. Comme tu le verras dans la base de code, j'avais commencé à utiliser  le pattern de Factory. Il faut que tu le gardes dans ton code : c'est un bon moyen de gérer tes données.

Moi : OK, je vais utiliser le pattern Factory Method. Merci encore !
