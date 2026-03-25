
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LanguageService }     from '../../core/services/language.service';
import { DocumentService }     from '../../core/services/document.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService }         from '../../core/services/auth.service';
import { Category, SubCategory, ItemType } from '../../core/services/models/document.models';



export type DeclarationMode = 'lost' | 'found';

export interface UploadedFile {
  file:    File;
  preview: string;
  name:    string;
  size:    string;
}

const MAX_FILES   = 3;
const MAX_SIZE_MB = 5;

@Component({
  selector: 'app-declare-document-page',
  imports: [ReactiveFormsModule],
  templateUrl: './declare-document.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclareDocumentPage implements OnInit {
  private readonly route   = inject(ActivatedRoute);
  private readonly router  = inject(Router);
  private readonly fb      = inject(FormBuilder);
  private readonly docSvc  = inject(DocumentService);
  private readonly notif   = inject(NotificationService);
  private readonly auth    = inject(AuthService);
  readonly lang            = inject(LanguageService);

  // ── Mode lost/found depuis la route ─────────────────────────────
  readonly mode    = signal<DeclarationMode>('lost');
  readonly isLost  = computed(() => this.mode() === 'lost');
  readonly isFound = computed(() => this.mode() === 'found');

  // ── État ─────────────────────────────────────────────────────────
  readonly isLoading       = signal(false);
  readonly loadingSubCats  = signal(false);
  readonly serverError     = signal<string | null>(null);
  readonly fieldErrors     = signal<Record<string, string[]>>({});
  readonly selectedCategoryId = signal<string | null>(null);
  // ── Catégories ───────────────────────────────────────────────────
  // (Historique) L'ID de la catégorie sélectionnée
  readonly documentCategoryId = signal<string | null>(null);

  // Liste des sous-catégories de "Document" (CNI, Passeport, Permis...)
  // Catégories
  readonly categories       = signal<Category[]>([]);


  // Sous-catégories
  readonly subCategories       = signal<SubCategory[]>([]);


  // ── Upload ───────────────────────────────────────────────────────
  readonly uploadedFiles = signal<UploadedFile[]>([]);
  readonly isDragging    = signal(false);
  readonly maxFiles      = MAX_FILES;
  readonly canAddMore    = computed(() => this.uploadedFiles().length < MAX_FILES);

  // ── Formulaire ───────────────────────────────────────────────────
  readonly form = this.fb.nonNullable.group({
    declarationType: ['lost' as DeclarationMode, [Validators.required]],
    category_id: ['', [Validators.required]],
    sub_category_id: ['', [Validators.required]],
    name_on_item: ['', [Validators.required, Validators.minLength(2)]],
    reference_number: ['', [Validators.required, Validators.minLength(3)]],
    event_date: ['', [Validators.required]],
    location: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
  });


  ngOnInit(): void {
    if (typeof window !== 'undefined') {
          // 1. Lire le mode depuis les données de la route
      const routeMode = this.route.snapshot.data['mode'] as DeclarationMode ?? 'lost';
      this.mode.set(routeMode);
      this.form.controls.declarationType.setValue(routeMode);

      // 2. Charger les catégories puis charger les sous-catégories de la catégorie sélectionnée
      this.loadCategories();
    }
  }

  private loadCategories(): void {
    this.loadingSubCats.set(true);

    this.docSvc.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data);

        // Pré-sélection : garder l'ancienne logique si possible (catégorie "Document")
        const documentCat = res.data.find((c) => c.name?.toLowerCase() === 'document');
        const first = documentCat ?? res.data[0] ?? null;

        if (!first) {
          this.loadingSubCats.set(false);
          this.notif.error(this.lang.t().declare.errorCategories);
          return;
        }

        this.selectedCategoryId.set(first.id);
        this.documentCategoryId.set(first.id);
        this.form.controls.category_id.setValue(first.id);

        this.loadSubCategories(first.id);
      },
      error: () => {
        this.loadingSubCats.set(false);
        this.notif.error(this.lang.t().declare.errorCategories);
      },
    });
  }

  private loadSubCategories(categoryId: string): void {
    this.loadingSubCats.set(true);

    this.docSvc.getSubCategories(categoryId).subscribe({
      next: (subRes) => {
        this.subCategories.set(subRes.data);
        this.form.controls.sub_category_id.setValue('');
        this.loadingSubCats.set(false);
      },
      error: () => {
        this.loadingSubCats.set(false);
        this.notif.error(this.lang.t().declare.errorSubCategories);
      },
    });
  }

  onCategoryChange(): void {
    const categoryId = this.form.controls.category_id.getRawValue();
    this.selectedCategoryId.set(categoryId || null);
    this.documentCategoryId.set(categoryId || null);

    if (categoryId) this.loadSubCategories(categoryId);
  }


  // ── Helper : premier message d'erreur serveur pour un champ ─────
  fieldError(field: string): string | null {
    return this.fieldErrors()[field]?.[0] ?? null;
  }

  // ── Drag & Drop ──────────────────────────────────────────────────
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void { this.isDragging.set(false); }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files) this.processFiles(event.dataTransfer.files);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.processFiles(input.files);
    input.value = '';
  }

  private readonly ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  private processFiles(fileList: FileList): void {
    const remaining = MAX_FILES - this.uploadedFiles().length;
    const newFiles: UploadedFile[] = [];

    Array.from(fileList).slice(0, remaining).forEach((file) => {
       // Vérification du type — cohérent avec le backend (pas de webp/gif/bmp)
      if (!this.ACCEPTED_TYPES.includes(file.type)) {
        this.notif.warning(`"${file.name}" — ${this.lang.t().declare.errorFileType}`);
        return;
      }

      if (!file.type.startsWith('image/')) return;

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        this.notif.warning(`"${file.name}" dépasse 5 Mo et a été ignoré.`);
        return;
      }
      newFiles.push({
        file,
        preview: URL.createObjectURL(file),
        name:    file.name,
        size:    this.formatSize(file.size),
      });
    });

    this.uploadedFiles.update((prev) => [...prev, ...newFiles]);
  }

  removeFile(index: number): void {
    this.uploadedFiles.update((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // ── Soumission ───────────────────────────────────────────────────
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Vérifier que la catégorie et la sous-catégorie sont valides
    if (!this.documentCategoryId() || !this.form.controls.sub_category_id.getRawValue()) {

      this.notif.error(this.lang.t().declare.errorCategories);
      return;
    }
     
    if(this.uploadedFiles().length === 0) {
      this.notif.error(this.lang.t().declare.errorNoFiles);
      return;
    }

    this.isLoading.set(true);
    this.serverError.set(null);
    this.fieldErrors.set({});

    const v          = this.form.getRawValue();

    // keep category_id in sync with the selected category
    this.documentCategoryId.set(v.category_id);

    const user       = this.auth.currentUser();
    const countryId  = user?.country?.id ?? '';

    // Convertir le mode lost/found en enum ItemType pour l'API
    const itemType = v.declarationType === 'lost'
      ? ItemType.Lost
      : ItemType.Found;

    // Construire le titre automatiquement depuis la sous-catégorie sélectionnée
    const selectedSub = this.subCategories().find(s => s.id === v.sub_category_id);

    const title = selectedSub
      ? `${selectedSub.name} — ${v.name_on_item}`
      : v.name_on_item;

    this.docSvc.declare({
      type:             itemType,
      title,
      name_on_item:     v.name_on_item,
      reference_number: v.reference_number || undefined,
      event_date:       v.event_date,
      location:         v.location,
      description:      v.description || undefined,
      category_id:      v.category_id,

      sub_category_id:  v.sub_category_id,
      country_id:       countryId,
      photos:           this.uploadedFiles().map((f) => f.file),
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notif.success(this.lang.t().declare.successMessage);
        this.router.navigate(['/app/documents']);
      },
      error: (err: HttpErrorResponse) => {
        const t = this.lang.t().declare;
        this.isLoading.set(false);
        if (err.status === 422 && err.error?.errors) {
          // Erreurs de validation Laravel champ par champ
          this.fieldErrors.set(err.error.errors);
          this.serverError.set(t.error422);
          this.notif.error(t.error422);

        } else if (err.status === 403) {
          this.serverError.set(t.error403);
          this.notif.error(t.error403);
        } else {
          const msg = err.error?.message ?? t.errorGeneral;
          this.serverError.set(msg);
          this.notif.error(msg);
        }
      },
    });
  }
}