import { Component } from '@angular/core';
import { DataTableComponent, TableColumn, ButtonComponent, TolleCellDirective } from '@tolle_/tolle-ui';

@Component({
    selector: 'app-searchable',
    standalone: true,
    imports: [
        ButtonComponent,
        DataTableComponent,
        TolleCellDirective
    ],
    templateUrl: './searchable.component.html',

})
export class SearchableComponent {
  columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'actions', label: 'Actions', class: 'text-right w-[100px]' }
  ];

  users = [
    { id: 1, name: 'Alex Rivera', email: 'alex@example.com' },
    { id: 2, name: 'Jordan Smith', email: 'jordan@example.com' },
    { id: 3, name: 'Taylor Johnson', email: 'taylor.johnson@example.com' },
    { id: 4, name: 'Morgan Lee', email: 'morgan.lee@example.com' },
    { id: 5, name: 'Casey Brown', email: 'casey.brown@example.com' },
    { id: 6, name: 'Riley Anderson', email: 'riley.anderson@example.com' },
    { id: 7, name: 'Jamie Clark', email: 'jamie.clark@example.com' },
    { id: 8, name: 'Avery Martinez', email: 'avery.martinez@example.com' },
    { id: 9, name: 'Quinn Walker', email: 'quinn.walker@example.com' },
    { id: 10, name: 'Drew Thompson', email: 'drew.thompson@example.com' },
    { id: 11, name: 'Parker Lewis', email: 'parker.lewis@example.com' },
    { id: 12, name: 'Rowan Harris', email: 'rowan.harris@example.com' },
    { id: 13, name: 'Logan White', email: 'logan.white@example.com' },
    { id: 14, name: 'Skyler Hall', email: 'skyler.hall@example.com' },
    { id: 15, name: 'Reese Young', email: 'reese.young@example.com' },
    { id: 16, name: 'Cameron King', email: 'cameron.king@example.com' },
    { id: 17, name: 'Emerson Wright', email: 'emerson.wright@example.com' },
    { id: 18, name: 'Harper Lopez', email: 'harper.lopez@example.com' },
    { id: 19, name: 'Finley Scott', email: 'finley.scott@example.com' },
    { id: 20, name: 'Dakota Green', email: 'dakota.green@example.com' },
    { id: 21, name: 'Noah Adams', email: 'noah.adams@example.com' },
    { id: 22, name: 'Liam Baker', email: 'liam.baker@example.com' },
    { id: 23, name: 'Olivia Carter', email: 'olivia.carter@example.com' },
    { id: 24, name: 'Emma Nelson', email: 'emma.nelson@example.com' },
    { id: 25, name: 'Aiden Mitchell', email: 'aiden.mitchell@example.com' },
    { id: 26, name: 'Sophia Perez', email: 'sophia.perez@example.com' },
    { id: 27, name: 'Ethan Roberts', email: 'ethan.roberts@example.com' },
    { id: 28, name: 'Isabella Turner', email: 'isabella.turner@example.com' },
    { id: 29, name: 'Lucas Phillips', email: 'lucas.phillips@example.com' },
    { id: 30, name: 'Mia Campbell', email: 'mia.campbell@example.com' },
    { id: 31, name: 'Henry Parker', email: 'henry.parker@example.com' },
    { id: 32, name: 'Amelia Evans', email: 'amelia.evans@example.com' },
    { id: 33, name: 'Benjamin Collins', email: 'benjamin.collins@example.com' },
    { id: 34, name: 'Charlotte Stewart', email: 'charlotte.stewart@example.com' },
    { id: 35, name: 'Sebastian Morris', email: 'sebastian.morris@example.com' },
    { id: 36, name: 'Evelyn Rogers', email: 'evelyn.rogers@example.com' },
    { id: 37, name: 'Jack Reed', email: 'jack.reed@example.com' },
    { id: 38, name: 'Abigail Cook', email: 'abigail.cook@example.com' },
    { id: 39, name: 'Owen Morgan', email: 'owen.morgan@example.com' },
    { id: 40, name: 'Emily Bell', email: 'emily.bell@example.com' },
    { id: 41, name: 'Wyatt Murphy', email: 'wyatt.murphy@example.com' },
    { id: 42, name: 'Hannah Bailey', email: 'hannah.bailey@example.com' },
    { id: 43, name: 'Julian Rivera', email: 'julian.rivera@example.com' },
    { id: 44, name: 'Lily Cooper', email: 'lily.cooper@example.com' },
    { id: 45, name: 'Grayson Richardson', email: 'grayson.richardson@example.com' },
    { id: 46, name: 'Zoe Cox', email: 'zoe.cox@example.com' },
    { id: 47, name: 'Isaac Howard', email: 'isaac.howard@example.com' },
    { id: 48, name: 'Nora Ward', email: 'nora.ward@example.com' },
    { id: 49, name: 'Caleb Torres', email: 'caleb.torres@example.com' },
    { id: 50, name: 'Violet Peterson', email: 'violet.peterson@example.com' }
  ];
}