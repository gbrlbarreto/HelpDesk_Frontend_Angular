import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Tecnico } from '../../../models/tecnico';

@Component({
  selector: 'app-tecnico-list',
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './tecnico-list.component.html',
  styleUrl: './tecnico-list.component.css'
})
export class TecnicoListComponent implements AfterViewInit {

  ELEMENT_DATA: Tecnico[] = [
    {
      id: 1,
      nome: 'Gabriel',
      cpf: '123.456.789-10',
      email: 'teste@email.com',
      senha: '1234',
      perfis: ['0'],
      dataCriacao: '15/08/2022'
    }
  ]

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'acoes'];
  dataSource = new MatTableDataSource<Tecnico>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}


