import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';
import { PrintService, PrintOptions } from '../../services/print.service';

@Component({
  selector: 'app-print-button',
  standalone: true,
  imports: [CommonModule, NgxPrintModule],
  template: `
    <!-- Hidden print button for ngxPrint -->
    <button
        [hidden]="true"
        [printSectionId]="printSectionId"
        ngxPrint
        [useExistingCss]="options.useExistingCss"
        [closeWindow]="options.closeWindow"
        #printer
        [title]="options.title"
    ></button>
  `,
  styles: []
})
export class PrintButtonComponent {
  @ViewChild('printer') printer: any;

  @Input() printSectionId: string = 'print-section';
  @Input() options: PrintOptions = {
    useExistingCss: true,
    closeWindow: true,
    title: 'Print Document'
  };

  constructor(private printService: PrintService) {}

  /**
   * Trigger the print functionality
   */
  print(): void {
    if (this.printer) {
      this.printer.print();
    } else {
      // Fallback to print service
      this.printService.printSection(this.printSectionId, this.options);
    }
  }
}
