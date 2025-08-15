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
import { MatSelectModule } from '@angular/material/select';
import { Cliente } from '../../../models/cliente';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from '../../../models/chamado';
import { Tecnico } from '../../../models/tecnico';
import { ChamadoService } from '../../../services/chamado.service';
import { TecnicoService } from '../../../services/tecnico.service';

@Component({
  selector: 'app-chamado-update',
  standalone: true,
  imports: [FormsModule, MatError, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, NgxMaskDirective, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './chamado-update.component.html',
  styleUrls: ['./chamado-update.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ChamadoUpdateComponent implements OnInit {

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
    private toastr: ToastrService, private router: Router, private route: ActivatedRoute
  ) {}

  titulo: FormControl = new FormControl(null, Validators.required);
  status: FormControl = new FormControl(null, Validators.required);
  prioridade: FormControl = new FormControl(null, Validators.required);
  tecnico: FormControl = new FormControl(null, Validators.required);
  cliente: FormControl = new FormControl(null, Validators.required);
  descricao: FormControl = new FormControl(null, Validators.required);

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

  private formatarDataAtualBr(): string {
    return new Date().toLocaleDateString('pt-BR');
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

  validaCampos(): boolean {
    return this.titulo.valid && this.status.valid && this.prioridade.valid && this.tecnico.valid && this.cliente.valid && this.descricao.valid;
  }

  update(): void {
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

    this.chamadoService.update(this.chamado).subscribe({
      next: () => {
        this.toastr.success('Chamado atualizado com sucesso', 'Atualização');
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
