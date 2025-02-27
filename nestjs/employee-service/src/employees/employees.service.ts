import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeesService {

    public greeting():String{
        var message:string = 'Hello Employee';
        return message;
    }
}
