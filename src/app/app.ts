import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Para trabalhar com formulários no Angular 12
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Para realizar requisições HTTP
import { HttpClientModule } from '@angular/common/http';

// Imports para componentes do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

// Componentes do projeto
import { NavComponent } from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MatFormFieldModule,
    MatPaginatorModule, MatSnackBarModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatSelectModule, 
    MatTableModule, MatRadioModule, MatInputModule, MatIconModule, MatListModule, MatCardModule, NavComponent],
  templateUrl: 'app.html'
})
export class App {
  protected readonly title = signal('helpdesk');
}
