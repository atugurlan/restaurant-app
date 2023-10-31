import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  user$ = this.usersService.currentUserProfile$;

  constructor(private authService: AuthenticationService, private router: Router, private usersService: UsersService) { }

  logout() {
    this.authService.logout().subscribe( () => {
      this.router.navigate(['']);
    })
  }
}
