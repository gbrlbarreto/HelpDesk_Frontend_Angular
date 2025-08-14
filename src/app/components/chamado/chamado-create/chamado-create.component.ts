import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatSelectModule } from '@angular/material/select';
import { Chamado } from '../../../models/chamado';
import { Cliente } from '../../../models/cliente';
import { Tecnico } from '../../../models/tecnico';
import { ClienteService } from '../../../services/cliente.service';
import { TecnicoService } from '../../../services/tecnico.service';
import { ChamadoService } from '../../../services/chamado.service';

@Component({
  selector: 'app-chamado-create',
  standalone: true,
  imports: [FormsModule, MatError, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './chamado-create.component.html',
  styleUrls: ['./chamado-create.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChamadoCreateComponent implements OnInit {

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
    private toastr: ToastrService, private router: Router
  ) {}

  titulo: FormControl = new FormControl(null, Validators.required);
  status: FormControl = new FormControl(null, Validators.required);
  prioridade: FormControl = new FormControl(null, Validators.required);
  tecnico: FormControl = new FormControl(null, Validators.required);
  cliente: FormControl = new FormControl(null, Validators.required);
  descricao: FormControl = new FormControl(null, Validators.required);

  ngOnInit(): void {
    this.findAllClientes();
    this.findAllTecnicos();
  }

  private formatarDataAtualBr(): string {
    return new Date().toLocaleDateString('pt-BR');
  }

  findAllClientes(): void {
    this.clienteService.findAll().subscribe(resposta => {
      this.clientes = resposta;
    })
  }

  findAllTecnicos(): void {
    this.tecnicoService.findAll().subscribe(resposta => {
      this.tecnicos = resposta;
    })
  }

  validaCampos(): boolean {
    return this.titulo.valid && this.status.valid && this.prioridade.valid && this.tecnico.valid && this.cliente.valid && this.descricao.valid;
  }

  create(): void {
    const clienteSelecionado = this.clientes.find(c => c.id === this.cliente.value);
    const tecnicoSelecionado = this.tecnicos.find(t => t.id === this.tecnico.value);

    this.chamado.titulo = this.titulo.value;
    this.chamado.status = this.status.value;
    this.chamado.prioridade = this.prioridade.value;
    this.chamado.tecnico = this.tecnico.value;
    this.chamado.cliente = this.cliente.value;
    this.chamado.observacoes = this.descricao.value;
    this.chamado.nomeTecnico = tecnicoSelecionado?.nome || '';
    this.chamado.nomeCliente = clienteSelecionado?.nome || '';
    this.chamado.dataAbertura = this.formatarDataAtualBr();

    this.chamadoService.create(this.chamado).subscribe({
      next: () => {
        this.toastr.success('Chamado cadastrado com sucesso', 'Cadastro');
        this.router.navigate(['/chamados']);
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
    });
  }
}
