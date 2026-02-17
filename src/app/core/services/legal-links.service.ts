import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LegalLinksService {
  private router = inject(Router);

  async openTermsOfUse(): Promise<void> {
    const platform = Capacitor.getPlatform();
    const legal = environment.legalLinks;
    const termsUrl = platform === 'ios' ? legal.iosTermsUrl : legal.androidTermsUrl;

    if (termsUrl) {
      window.open(termsUrl, '_blank');
      return;
    }

    await this.router.navigate(['/terms-of-use-android']);
  }

  async openPrivacyPolicy(): Promise<void> {
    const privacyUrl = environment.legalLinks.privacyPolicyUrl;

    if (privacyUrl) {
      window.open(privacyUrl, '_blank');
      return;
    }

    await this.router.navigate(['/privacy-policy']);
  }
}
