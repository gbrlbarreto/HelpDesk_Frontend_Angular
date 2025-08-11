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
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cliente-delete',
  standalone: true,
  imports: [FormsModule, MatError, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, NgxMaskDirective, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './cliente-delete.component.html',
  styleUrls: ['./cliente-delete.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteDeleteComponent implements OnInit {
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly labelPosition = model<'before' | 'after'>('after');
  readonly disabled = model(false);

  cliente: Cliente = {
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

  constructor(private service: ClienteService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.cliente.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.cliente.id).subscribe(resposta => {
      this.cliente = resposta;

      this.nome.setValue(this.cliente.nome);
      this.nome.disable();
      this.cpf.setValue(this.cliente.cpf);
      this.cpf.disable();
      this.email.setValue(this.cliente.email);
      this.email.disable();
      this.senha.setValue(this.cliente.senha);
      this.senha.disable();
    });
  }

  delete(): void {
    this.cliente.nome = this.nome.value;
    this.cliente.cpf = this.cpf.value;
    this.cliente.email = this.email.value;
    this.cliente.senha = this.senha.value;

    this.service.delete(this.cliente.id).subscribe(() => {
      this.toastr.success('Cliente deletado com sucesso', 'Exclusão');
      this.router.navigate(['/clientes']);
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
