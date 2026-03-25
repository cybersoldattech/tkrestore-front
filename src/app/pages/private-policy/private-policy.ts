import { Component } from '@angular/core';
import { LegalDocument } from '../legal-document/legal-document';

@Component({
  selector: 'app-private-policy',
  standalone:true,
  imports: [LegalDocument],
  templateUrl: './private-policy.html',
})
export class PrivatePolicy {

}
