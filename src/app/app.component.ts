import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, SidebarGroup } from '@tolle_/tolle-ui';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
    sidebarItems: SidebarGroup[] = [
        {
            title: 'Platform',
            items: [
                {
                    title: 'Playground',
                    icon: 'ri-terminal-box-line',
                    expanded: false,
                    items: [
                        { title: 'History', url: '#' },
                        { title: 'Starred', url: '#' },
                        { title: 'Settings', url: '#' }
                    ]
                },
                {
                    title: 'Models',
                    icon: 'ri-command-line',
                    expanded: false,
                    items: [
                        { title: 'Genesis', url: '#' },
                        { title: 'Explorer', url: '#' },
                        { title: 'Quantum', url: '#' }
                    ]
                },
                {
                    title: 'Documentation',
                    icon: 'ri-book-open-line',
                    expanded: false,
                    items: [
                        { title: 'Introduction', url: '#' },
                        { title: 'Get Started', url: '#' },
                        { title: 'Tutorials', url: '#' },
                        { title: 'Changelog', url: '#' }
                    ]
                },
                {
                    title: 'Settings',
                    icon: 'ri-settings-4-line',
                    expanded: false,
                    items: [
                        { title: 'General', url: '#' },
                        { title: 'Team', url: '#' },
                        { title: 'Billing', url: '#' },
                        { title: 'Limits', url: '#' }
                    ]
                }
            ]
        },
        {
            title: 'Projects',
            items: [
                { title: 'Design Engineering', icon: 'ri-layout-line', url: '#' },
                { title: 'Sales & Marketing', icon: 'ri-pie-chart-line', url: '#' },
                { title: 'Travel', icon: 'ri-map-pin-line', url: '#' }
            ]
        }
    ];
}
