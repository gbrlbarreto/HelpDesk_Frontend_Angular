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
  selector: 'app-tecnico-update',
  standalone: true,
  imports: [FormsModule, MatError, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, NgxMaskDirective, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TecnicoUpdateComponent implements OnInit {
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

  constructor(private service: TecnicoService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

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

  private formatarDataAtual(): string {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe(resposta => {
      resposta.perfis = [];
      resposta.senha = '';
      this.tecnico = resposta;

      this.nome.setValue(this.tecnico.nome);
      this.cpf.setValue(this.tecnico.cpf);
      this.email.setValue(this.tecnico.email);
    });
  }

  update(): void {
    this.tecnico.nome = this.nome.value;
    this.tecnico.cpf = this.cpf.value;
    this.tecnico.email = this.email.value;
    this.tecnico.dataCriacao = this.formatarDataAtual();

    this.service.update(this.tecnico).subscribe({
      next: () => {
        this.toastr.success('Técnico atualizado com sucesso', 'Atualização');
        this.router.navigate(['/tecnicos']);
      },
      error: (ex) => {
        if (ex.error?.erros) {
          ex.error.erros.forEach((element: any) => {
            this.toastr.error(element.message);
          });
        } else {
          this.toastr.error(ex.error?.message || 'Erro inesperado');
        }
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
    return this.nome.valid && this.cpf.valid && this.email.valid;
  }
}
