import {Component} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { Credenciais } from '../../models/credenciais';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  creds: Credenciais = {
    email: '',
    senha: ''
  }

  email = new FormControl(null, Validators.email);
  senha = new FormControl(null, Validators.minLength(3));

  constructor(private  toastr : ToastrService) {
    // Sincroniza o valor do form com creds
    this.email.valueChanges.subscribe(value => this.creds.email = value ?? '');
    this.senha.valueChanges.subscribe(value => this.creds.senha = value ?? '');
  }

  validaCampos(): boolean {
    if(this.email.valid && this.senha.valid){
      return true;
    } else{
      return false;
    }
  }

  logar() {
    this.toastr.error('Usuario e/ou senha inválidos!', 'Login');
    this.senha.setValue('');
  }

  onSubmit() {
    console.log('Dados do formulário:', this.creds);
    // Aqui você pode chamar um serviço de autenticação, por exemplo
    // this.authService.login(this.creds).subscribe(...)
  }

}
