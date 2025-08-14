import { ChangeDetectionStrategy, model, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tecnico-create',
  standalone: true,
  imports: [FormsModule, MatError, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, NgxMaskDirective, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './tecnico-create.component.html',
  styleUrls: ['./tecnico-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class TecnicoCreateComponent {
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
  cpf: FormControl = new FormControl(null, [Validators.required, this.validaCpf.bind(this)]);
  email: FormControl = new FormControl(null, [Validators.required, this.validaEmail.bind(this)]);
  senha: FormControl = new FormControl(null, Validators.minLength(3));

  constructor(private service: TecnicoService, private toastr: ToastrService, private router: Router) { }

  validaCpf(control: AbstractControl): ValidationErrors | null {
    const cpf = (control.value || '').replace(/\D/g, '');

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return { cpfInvalido: true };
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return { cpfInvalido: true };

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return { cpfInvalido: true };

    return null;
  }

  validaEmail(control: AbstractControl): ValidationErrors | null {
    const email = control.value || '';
    if (!email) return null;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
    return emailRegex.test(email) ? null : { emailInvalido: true };
  }

  private formatarDataAtualBr(): string {
    return new Date().toLocaleDateString('pt-BR');
  }

  create(): void {
    this.tecnico.nome = this.nome.value;
    this.tecnico.cpf = this.cpf.value;
    this.tecnico.email = this.email.value;
    this.tecnico.senha = this.senha.value;
    this.tecnico.dataCriacao = this.formatarDataAtualBr();

    this.service.create(this.tecnico).subscribe(() => {
      this.toastr.success('Técnico cadastrado com sucesso', 'Cadastro');
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

  addPerfil(perfil: any): void {
    if(this.tecnico.perfis.includes(perfil)){
      this.tecnico.perfis.splice(this.tecnico.perfis.indexOf(perfil), 1);
    } else {
      this.tecnico.perfis.push(perfil);
    }
  }

  validaCampos(): boolean {
    return this.nome.valid && this.cpf.valid && this.email.valid && this.senha.valid;
  }
}
