import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
@Entity()
export class Dispather {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    vehicle_number: string;

    @Column({nullable:false})
    city: string;
}
