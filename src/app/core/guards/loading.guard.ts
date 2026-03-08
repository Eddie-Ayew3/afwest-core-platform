import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingElement: HTMLElement | null = null;

  show() {
    // Create loading screen with Progress_1.png image
    if (!this.loadingElement) {
      this.loadingElement = document.createElement('div');
      this.loadingElement.innerHTML = `
        <div class="loading-container">
          <div class="loading-overlay"></div>
          <div class="loading-content">
            <div class="loading-image">
              <img src="/Progress_1.png" alt="Loading..." style="width: 120px; height: 120px;" />
            </div>
            <div class="loading-text">
              <p>Loading your data...</p>
            </div>
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
          </div>
        </div>
      `;
      
      // Add inline styles
      this.loadingElement.innerHTML += `
        <style>
          .loading-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; display: flex; align-items: center; justify-content: center; }
          .loading-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.95); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px); }
          .loading-content { position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 2rem; padding: 2rem; background: rgba(255, 255, 255, 0.95); border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); max-width: 320px; text-align: center; }
          .loading-image { margin-bottom: 1rem; }
          .loading-text p { font-size: 0.875rem; font-weight: 500; margin: 0; color: #1e293b; }
          .progress-bar { width: 100%; height: 0.25rem; background: rgba(226, 232, 240, 0.8); border-radius: 0.125rem; overflow: hidden; }
          .progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 50%, #3b82f6 100%); background-size: 200% 100%; animation: progress 2s ease-in-out infinite; border-radius: 0.125rem; }
          @keyframes progress { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        </style>
      `;
      
      document.body.appendChild(this.loadingElement);
      document.body.style.overflow = 'hidden';
    }
  }

  hide() {
    if (this.loadingElement) {
      document.body.removeChild(this.loadingElement);
      this.loadingElement = null;
      document.body.style.overflow = '';
    }
  }
}

export const loadingGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loadingService = inject(LoadingService);
  
  // Show loading screen
  loadingService.show();
  
  // Simulate loading delay (remove this in production)
  setTimeout(() => {
    loadingService.hide();
    return true;
  }, 1500);
  
  return true;
};
