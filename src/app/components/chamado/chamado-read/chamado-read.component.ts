import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { MatSelectModule } from '@angular/material/select';
import { Cliente } from '../../../models/cliente';
import { Chamado } from '../../../models/chamado';
import { Tecnico } from '../../../models/tecnico';
import { ChamadoService } from '../../../services/chamado.service';
import { TecnicoService } from '../../../services/tecnico.service';

@Component({
  selector: 'app-chamado-read',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './chamado-read.component.html',
  styleUrls: ['./chamado-read.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChamadoReadComponent implements OnInit {

  clientes: Cliente[] = [];
  tecnicos: Tecnico[] = [];

  chamado: Chamado = {
    id: '',
    dataAbertura: '',
    dataFechamento: '',
    prioridade: '',
    status: '',
    titulo: '',
    observacoes: '',
    tecnico: '',
    cliente: '',
    nomeCliente: '',
    nomeTecnico: ''
  }

  constructor(private chamadoService: ChamadoService, private clienteService: ClienteService, private tecnicoService: TecnicoService,
    private router: Router, private route: ActivatedRoute
  ) {}

  titulo: FormControl = new FormControl({ value: null, disabled: true }, Validators.required);
  status: FormControl = new FormControl({ value: null, disabled: true }, Validators.required);
  prioridade: FormControl = new FormControl({ value: null, disabled: true }, Validators.required);
  tecnico: FormControl = new FormControl({ value: null, disabled: true }, Validators.required);
  cliente: FormControl = new FormControl({ value: null, disabled: true }, Validators.required);
  descricao: FormControl = new FormControl({ value: null, disabled: true }, Validators.required);

  ngOnInit(): void {
    this.chamado.id = this.route.snapshot.paramMap.get('id');
    this.findAllClientes();
    this.findAllTecnicos();
    this.findById();
  }

  findById(): void {
    this.chamadoService.findById(this.chamado.id).subscribe(resposta => {
      this.chamado = resposta;

      this.titulo.setValue(this.chamado.titulo);
      this.status.setValue(String(this.chamado.status));
      this.prioridade.setValue(String(this.chamado.prioridade));
      this.tecnico.setValue(this.chamado.tecnico);
      this.cliente.setValue(this.chamado.cliente);
      this.descricao.setValue(this.chamado.observacoes);
    });
  }

  findAllClientes(): void {
    this.clienteService.findAll().subscribe(resposta => {
      this.clientes = resposta;
      this.loadForm();
    })
  }

  findAllTecnicos(): void {
    this.tecnicoService.findAll().subscribe(resposta => {
      this.tecnicos = resposta;
      this.loadForm();
    })
  }
  
  loadForm(): void {
    if (this.clientes.length > 0 && this.tecnicos.length > 0) {
      this.findById();
    }
  }
}
