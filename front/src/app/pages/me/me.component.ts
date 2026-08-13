import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule, Location } from "@angular/common";
import { User } from '@models/user.interface';
import { SessionService } from '@service/auth/session.service';
import { UserService } from '@service/user/user.service';
import { MaterialModule } from "../../shared/material.module";

@Component({
  selector: 'app-me',
  imports: [CommonModule, MaterialModule],
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {

  private router = inject(Router);
  private sessionService = inject(SessionService);
  private matSnackBar = inject(MatSnackBar);
  private userService = inject(UserService);
  private location = inject(Location);

  public user: User | undefined;

  ngOnInit(): void {
    this.userService
      .getById(this.sessionService.sessionInformation!.id.toString())
      .subscribe((user: User) => this.user = user);
  }

  public back(): void {
    this.location.back();
  }

  public delete(): void {
    this.userService
      .delete(this.sessionService.sessionInformation!.id.toString())
      .subscribe(() => {
        this.matSnackBar.open("Your account has been deleted !", 'Close', { duration: 3000 });
        this.sessionService.logOut();
        this.router.navigate(['/']);
      })
  }
}
