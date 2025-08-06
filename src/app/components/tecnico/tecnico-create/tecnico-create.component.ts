import { ChangeDetectionStrategy, model, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule}  from '@angular/material/input';

@Component({
  selector: 'app-tecnico-create',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './tecnico-create.component.html',
  styleUrls: ['./tecnico-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class TecnicoCreateComponent {
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly labelPosition = model<'before' | 'after'>('after');
  readonly disabled = model(false);
}
