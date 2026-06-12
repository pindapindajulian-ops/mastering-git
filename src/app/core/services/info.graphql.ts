import { HttpHeaders } from '@angular/common/http';

export const GRAPHQL_ENDPOINT = '/graphql';

export interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
}

export interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: Array<{ message: string; [key: string]: unknown }>;
}

export function buildGraphQLRequest(query: string, variables?: Record<string, unknown>): GraphQLRequest {
  return { query, variables };
}

export const GET_EMPLOYEES_QUERY = `
  query GetEmployees {
    employees {
      id
      name
      email
      password
      gender
      contactNo
      department
      role
      certificateName
      certificateType
      certificateData
    }
  }
`;

export const GET_EMPLOYEE_QUERY = `
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      name
      email
      password
      gender
      contactNo
      department
      role
      certificateName
      certificateType
      certificateData
    }
  }
`;

export const ADD_EMPLOYEE_MUTATION = `
  mutation AddEmployee($input: EmployeeInput!) {
    addEmployee(input: $input) {
      id
      name
      email
      password
      gender
      contactNo
      department
      role
      certificateName
      certificateType
      certificateData
    }
  }
`;

export const UPDATE_EMPLOYEE_MUTATION = `
  mutation UpdateEmployee($id: ID!, $input: EmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      name
      email
      password
      gender
      contactNo
      department
      role
      certificateName
      certificateType
      certificateData
    }
  }
`;

export const DELETE_EMPLOYEE_MUTATION = `
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

export const GRAPHQL_HEADERS = new HttpHeaders({
  'Content-Type': 'application/json',
});
