import { ChangeDetectionStrategy, model, Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tecnico-delete',
  standalone: true,
  imports: [FormsModule, MatError, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, NgxMaskDirective, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './tecnico-delete.component.html',
  styleUrls: ['./tecnico-delete.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TecnicoDeleteComponent implements OnInit {
    readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly labelPosition = model<'before' | 'after'>('after');
  readonly disabled = model(false);

  tecnico: Tecnico = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfis: [],
    dataCriacao: ''
  }

  nome: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null);
  email: FormControl = new FormControl(null);
  senha: FormControl = new FormControl(null, Validators.minLength(3));

  constructor(private service: TecnicoService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe(resposta => {
      this.tecnico = resposta;

      this.nome.setValue(this.tecnico.nome);
      this.nome.disable();
      this.cpf.setValue(this.tecnico.cpf);
      this.cpf.disable();
      this.email.setValue(this.tecnico.email);
      this.email.disable();
      this.senha.setValue(this.tecnico.senha);
      this.senha.disable();
    });
  }

  delete(): void {
    this.tecnico.nome = this.nome.value;
    this.tecnico.cpf = this.cpf.value;
    this.tecnico.email = this.email.value;
    this.tecnico.senha = this.senha.value;

    this.service.delete(this.tecnico.id).subscribe(() => {
      this.toastr.success('Técnico deletado com sucesso', 'Exclusão');
      this.router.navigate(['/tecnicos']);
    }, ex => {
      if(ex.error.erros){
        ex.error.erros.forEach(element => {
          this.toastr.error(element.message);
        });
      } else {
        this.toastr.error(ex.error.message);
      }
    })
  }
}
