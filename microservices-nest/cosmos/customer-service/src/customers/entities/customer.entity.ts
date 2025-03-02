import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['email'])
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name: string;
    
    @Column({nullable:false, unique:true})
    email: string;

    @Column()
    address: string;
}
