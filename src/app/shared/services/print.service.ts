import { Injectable, ViewChild, ElementRef } from '@angular/core';

export interface PrintOptions {
  useExistingCss?: boolean;
  closeWindow?: boolean;
  printSectionId?: string;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  
  /**
   * Print a specific section of the page
   * @param printSectionId - The ID of the section to print
   * @param options - Optional print configuration
   */
  printSection(printSectionId: string, options: PrintOptions = {}): void {
    const printOptions = {
      useExistingCss: true,
      closeWindow: true,
      title: 'Print Document',
      ...options
    };

    // For now, use window.print() as the most reliable method
    // The printSectionId can be used for future enhancements
    console.log(`Printing section: ${printSectionId}`, printOptions);
    
    // Apply print styles temporarily
    this.applyPrintStyles();
    
    // Trigger browser print
    setTimeout(() => {
      window.print();
      // Remove temporary styles after print dialog closes
      setTimeout(() => {
        this.removePrintStyles();
      }, 1000);
    }, 100);
  }

  /**
   * Apply temporary print styles
   */
  private applyPrintStyles(): void {
    const styleId = 'temp-print-styles';
    
    // Remove existing temp styles if any
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Create and add new styles
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = this.getPrintStyles();
    document.head.appendChild(style);
  }

  /**
   * Remove temporary print styles
   */
  private removePrintStyles(): void {
    const style = document.getElementById('temp-print-styles');
    if (style) {
      style.remove();
    }
  }

  /**
   * Print with window.print() as fallback
   */
  printDefault(): void {
    window.print();
  }

  /**
   * Generate print button HTML template
   * @param printSectionId - The ID of the section to print
   * @param options - Optional print configuration
   * @returns HTML string for the print button
   */
  generatePrintButton(printSectionId: string, options: PrintOptions = {}): string {
    const printOptions = {
      useExistingCss: true,
      closeWindow: true,
      title: 'Print Document',
      ...options
    };

    return `
      <button
        [hidden]="true"
        printSectionId="${printSectionId}"
        ngxPrint
        [useExistingCss]="${printOptions.useExistingCss}"
        [closeWindow]="${printOptions.closeWindow}"
        #printer
        title="${printOptions.title}"
      ></button>
    `;
  }

  /**
   * Get common print CSS styles for page breaks
   * @returns CSS string for print styling
   */
  getPrintStyles(): string {
    return `
      @media print {
        @page {
          size: A4;
          margin: 15mm;
        }

        .no-print {
          display: none !important;
        }
        
        .no-print-bg {
          background: white !important;
        }
        
        .print-wrapper {
          background: white !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        
        .a4-sheet {
          box-shadow: none !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          min-height: auto !important;
        }

        /* Page break controls */
        .content-section {
          page-break-inside: avoid;
          page-break-after: auto;
        }

        .header-band,
        .identity-strip,
        .footer-band {
          page-break-after: auto;
          page-break-inside: avoid;
        }

        .section-title {
          page-break-after: avoid;
          page-break-inside: avoid;
        }

        .grid {
          page-break-inside: avoid;
        }

        .grid > div {
          page-break-inside: avoid;
        }

        .space-y-4 > div,
        .space-y-6 > div {
          page-break-inside: avoid;
        }

        .bg-gray-50,
        .border-gray-200 {
          page-break-inside: avoid;
        }

        /* Ensure proper spacing */
        .px-10 {
          padding-left: 10mm !important;
          padding-right: 10mm !important;
        }

        .py-6 {
          padding-top: 6mm !important;
          padding-bottom: 6mm !important;
        }
      }

      /* Content sections for print */
      .content-section {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      /* Specific section break controls */
      .personal-info,
      .contact-info,
      .employment-details,
      .banking-info,
      .family-info,
      .medical-education,
      .work-experience,
      .next-of-kin,
      .record-auth,
      .security-details,
      .emergency-contact {
        break-inside: avoid;
        page-break-inside: avoid;
        page-break-after: auto;
      }
    `;
  }
}
