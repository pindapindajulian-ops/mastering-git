import { Employee } from './employee.model';

export interface EmployeeState {

  employees: Employee[];

  loading: boolean;

  error: string;

}

export const initialState: EmployeeState = {

  employees: [],

  loading: false,

  error: ''

};
