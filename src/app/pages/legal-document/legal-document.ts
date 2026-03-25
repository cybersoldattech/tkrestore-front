// src/app/pages/legal-document/legal-document.ts

import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

export type LegalDocType = 'legal' | 'privacyPolicy' | 'dataProcessing' | 'dpa';

@Component({
  selector: 'app-legal-document',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './legal-document.html',
  styles: [],
})
export class LegalDocument {
  docType = input.required<LegalDocType>();

  private lang = inject(LanguageService);
  readonly t    = this.lang.t;

  /**
   * Retourne le document traduit correspondant au type.
   * Peut être undefined si docType() n'est pas encore résolu (SSR / premier rendu).
   */
  readonly doc = computed(() => {
    const type = this.docType();
    const translations = this.t();

    const map = {
      legal:          translations.legal,
      privacyPolicy:  translations.privacyPolicy,
      dataProcessing: translations.dataProcessing,
      dpa: translations.dpa,
    } as const;

    // Si la clé n'existe pas dans le map (typo, valeur inattendue) → undefined
    return map[type] ?? undefined;
  });

  /** true uniquement pour legal et privacyPolicy (ont sections + lastUpdated) */
  readonly hasSections = computed(() => this.docType() !== 'dataProcessing');

  /** true quand doc() est résolu et non undefined — guard de sécurité SSR */
  readonly isReady = computed(() => this.doc() !== undefined);

  /** Sections sans ambiguïté de type */
  readonly sections = computed(() => {
    const type = this.docType();
    if (type === 'dataProcessing') return [];
    return this.t()[type].sections;
  });

  /** lastUpdated sans ambiguïté de type */
  readonly lastUpdated = computed(() => {
    const type = this.docType();
    if (type === 'dataProcessing') return '';
    return this.t()[type].lastUpdated;
  });

  toLines(content: string): string[] {
    return content.split('\n');
  }
}