import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [],
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.css'
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
  showText1 = true;
  private intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.showText1 = !this.showText1;
    }, 1000); // Switches text every 3 seconds
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
