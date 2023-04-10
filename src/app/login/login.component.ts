import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { catchError, throwError } from 'rxjs';

interface LoginResult {
  login: {
    username: string;
    password: string;
  }
}

const LOGIN_QUERY = gql`
query Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    email
    password
    username
  }
}
`;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private router: Router, private apollo: Apollo) { }

  onSubmit() {
    this.apollo.watchQuery<LoginResult>({
      query: LOGIN_QUERY,
      variables: {
        username: this.username,
        password: this.password
      }
    }).valueChanges.pipe(
      catchError((error) => {
        this.error = error.message;
        return throwError(error);
      })
    ).subscribe((result) => {
      if (result.data.login){
        localStorage.setItem('user', JSON.stringify(result.data.login));
        this.router.navigate(['/employeelist']);
      } else {
        this.error = 'Invalid username or password';
      }
    });
  }

  GoToSignup() {
    this.router.navigate(['/signup']);
  }
  
}
