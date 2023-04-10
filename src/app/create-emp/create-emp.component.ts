import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { catchError, throwError } from 'rxjs';

const CREATE_EMPLOYEE_MUTATION = gql`
mutation Mutation($firstName: String!, $lastName: String!, $email: String!, $gender: String!, $salary: Float!) {
  createEmployee(firstName: $firstName, lastName: $lastName, email: $email, gender: $gender, salary: $salary) {
    email
    firstName
    gender
    lastName
    salary
  }
}
`;

@Component({
  selector: 'app-create-emp',
  templateUrl: './create-emp.component.html',
  styleUrls: ['./create-emp.component.css']
})
export class CreateEmpComponent {

  email: string = '';
  firstName: string = '';
  lastName: string = '';
  gender: string = '';
  salary: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private apollo: Apollo) { }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.apollo.mutate({
      mutation: CREATE_EMPLOYEE_MUTATION,
      variables: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        salary: this.salary,
        gender: this.gender
      }
    }).pipe(
      catchError((error) => {
        return throwError(error);
      }
      )
    ).subscribe((result) => {
      console.log(result);
      this.router.navigate(['/employeelist']);
    }
    );
  }
}