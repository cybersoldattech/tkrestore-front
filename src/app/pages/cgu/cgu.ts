import { Component } from '@angular/core';
import { LegalDocument } from '../legal-document/legal-document';

@Component({
  selector: 'app-cgu',
  standalone:true,
  imports: [LegalDocument],
  templateUrl: './cgu.html',
})
export class Cgu {

}
