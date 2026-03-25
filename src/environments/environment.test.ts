// src/environments/environment.test.ts  (testing)
export const environment = {
  production: false,
  apiUrl: 'http://tkrestore.31.97.73.114.sslip.io/api/v1',
  appUrl: 'http://tkrestore.31.97.73.114.sslip.io',
  chatUrl: 'http://tkrestore.31.97.73.114.sslip.io/chat',


  /**
   * reCAPTCHA v3 - Seulement le site key (pas de secret).
   */
  recaptchaSiteKey: '6Lc8q98sAAAAACoSEMlFFZ1nCZ04uXCezuCiwjPG',

  /**
   * Score minimum accepté côté serveur.
   */
  recaptchaMinScore: 0.5,

}

