import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from "apollo-angular";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  salary: number;
}

interface getEmployeeList {
  getAllEmployees: Employee[];
  getEmployeeList: Employee[];
}

const GET_EMPLOYEES_QUERY = gql`
query Query {
  getAllEmployees {
    email
    firstName
    lastName
    gender
    salary
    _id
  }
}
`;

const DELETE_EMPLOYEE_MUTATION = gql`
mutation Mutation($id: ID!) {
  deleteEmployee(_id: $id) {
    firstName
    lastName
    email
    gender
    salary
    _id
  }
}
`;


@Component({
  selector: 'app-employeelist',
  templateUrl: './employeelist.component.html',
  styleUrls: ['./employeelist.component.css']
})
export class EmployeelistComponent implements OnInit {

  employees: Employee[] = [];
  user = localStorage.getItem('user');

  constructor(private route: ActivatedRoute, private router: Router, private apollo: Apollo) {
    const userD = JSON.parse(this.user || '{}');
    this.user = userD.username;
    console.log(userD);
  }

  ngOnInit(): void {
    this.apollo.watchQuery<getEmployeeList>({
      query: GET_EMPLOYEES_QUERY
    }).valueChanges.subscribe((result) => {
      this.employees = result.data.getAllEmployees;
    });
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  goToCreateEmployee() {
    this.router.navigate(['/create-emp']);
  }

  deleteEmployee(id: string) {
    this.apollo.mutate({
      mutation: DELETE_EMPLOYEE_MUTATION,
      variables: {
        id
      }
    }).subscribe((result) => {
      console.log(result);
    });
  }



}
