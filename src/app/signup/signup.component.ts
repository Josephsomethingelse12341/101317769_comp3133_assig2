import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from "apollo-angular";
import { catchError, throwError } from 'rxjs';

interface CreateUser {
  signup: {
    username: string;
    email: string;
  }
}

const CREATE_USER_MUTATION = gql`
mutation Mutation($username: String!, $email: String!, $password: String!) {
  signup(username: $username, email: $email, password: $password) {
    email
    password
    username
  }
}
`;


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  email: string = '';
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private apollo: Apollo) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.apollo.mutate<CreateUser>({
      mutation: CREATE_USER_MUTATION,
      variables: {
        username: this.username,
        email: this.email,
        password: this.password
      }
    }).pipe(
      catchError((error) => {
        this.error = error.message;
        return throwError(error);
      })
    ).subscribe((result) => {
      console.log(result);
      this.router.navigate(['/login']);
    }, (error) => {
      this.error = error;
    });
  }


  GoToLogin() {
    this.router.navigate(['/login']);
  }


}
