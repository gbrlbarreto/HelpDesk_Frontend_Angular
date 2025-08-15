import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';

import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatSidenavModule, MatListModule, MatButtonModule, MatIconModule, RouterOutlet, HeaderComponent, RouterLink],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements AfterViewInit {
  showFiller = false;
  constructor(private router: Router, private authService: AuthService, private  toastr: ToastrService, private breakpointObserver: BreakpointObserver) { }

  @ViewChild('drawer') drawer!: MatDrawer;
  
  ngOnInit(): void {
    //this.router.navigate(['home'])
  }

  ngAfterViewInit(): void {
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
      setTimeout(() => {
        if (result.matches) {
          this.drawer.mode = 'over';
          this.drawer.close();
        } else {
          this.drawer.mode = 'side';
          this.drawer.open();
        }
      });
    });
  }

  logout() {
    this.router.navigate(['login']);
    this.authService.logout();
    this.toastr.info('Logout realizado com sucesso', 'Logout', {timeOut: 5000});
  }
}
