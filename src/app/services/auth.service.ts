import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Credenciais } from '../models/credenciais';
import { JwtHelperService } from '@auth0/angular-jwt'
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtService: JwtHelperService = new JwtHelperService();
  
  constructor(
    private http: HttpClient, 
    @Inject(PLATFORM_ID) private platformId: Object // Injetando o ID da plataforma
  ){}

  authenticate(creds: Credenciais) {
    return this.http.post(`${API_CONFIG.baseUrl}/login`, creds, {
      observe: 'response',
      responseType: 'text',
    });
  }

  successfulLogin(authToken: string) {
    if (isPlatformBrowser(this.platformId)) {
      // Garantir que o código está sendo executado no navegador
      localStorage.setItem('token', authToken);
    }
  }

  isAuthenticated() {
    if (isPlatformBrowser(this.platformId)) {
      // Verificar se está no ambiente do navegador antes de acessar o localStorage
      let token = localStorage.getItem('token');
      if (token != null) {
        return !this.jwtService.isTokenExpired(token);
      }
    }
    return false;
  }
}