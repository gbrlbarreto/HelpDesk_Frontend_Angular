import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-nav',
  imports: [MatSidenavModule, MatListModule, MatButtonModule, MatIconModule, RouterOutlet, HeaderComponent],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
      this.router.navigate(['home'])
  }
}
