import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name: string;

    @Column('decimal', { precision: 10, scale: 2, nullable:false })
    price: number;

    @Column({nullable:false, type:'int'})
    quantity: number;
}
