import { EmployeesService } from './employees.service';
export declare class EmployeesController {
    private employeeService;
    constructor(employeeService: EmployeesService);
    getGreeting(): String;
}
