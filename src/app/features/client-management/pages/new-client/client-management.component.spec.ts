import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClientManagementComponent } from './client-management.component';

describe('ClientManagementComponent', () => {
  let component: ClientManagementComponent;
  let fixture: ComponentFixture<ClientManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toContain('Client Management');
  });

  it('should render page subtitle', () => {
    const subtitle = fixture.debugElement.query(By.css('.text-muted-foreground'));
    expect(subtitle.nativeElement.textContent).toContain('Manage client information and relationships');
  });

  it('should render Add Client button', () => {
    const addButton = fixture.debugElement.query(By.css('tolle-button'));
    expect(addButton.nativeElement.textContent).toContain('Add Client');
  });

  it('should render client directory section', () => {
    const directory = fixture.debugElement.query(By.css('.bg-white.rounded-lg.border.border-border'));
    expect(directory).toBeTruthy();
    expect(directory.query(By.css('h3')).nativeElement.textContent).toContain('Client Directory');
  });

  it('should render filter and search buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('tolle-button[variant="outline"]'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('Filter');
    expect(buttons[1].nativeElement.textContent).toContain('Search');
  });

  it('should render placeholder content', () => {
    const placeholder = fixture.debugElement.query(By.css('.text-center.py-12.text-muted-foreground'));
    expect(placeholder).toBeTruthy();
    expect(placeholder.nativeElement.textContent).toContain('No client records found');
  });
});
