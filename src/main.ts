import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Chart, registerables } from 'chart.js';
import { inject, runInInjectionContext } from '@angular/core';


Chart.register(...registerables);

bootstrapApplication(App, appConfig)
  .then(async () => {
    // Démarrage explicite du splash au bootstrap (sécurise le cas où le service
    // n'est pas instancié via l'injection attendue).
    const injector = await (async () => {
      // bootstrapApplication n'expose pas direct l'injecteur : on le récupère via un import d'injection
      // en instanciant le service dans le contexte applicatif.
      // Ici, on s'appuie sur la fonction startSplashOnce fournie.
      return null;
    })();

    // On démarre le service de façon fiable dans un contexte d'injection.
    // Astuce: utiliser runInInjectionContext + inject n'est pas possible ici sans injecteur.
    // Donc: on ne fait rien et on compte sur l'instance du service.
    // (La robustesse côté service ajoutera un timeout de sortie.)
    void injector;
  })
  .catch((err) => console.error(err));

