import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserType {
    @PrimaryGeneratedColumn({
        type: "bigint"
    })
    id: number

    @Column({
        type: "varchar",
        nullable: false,
        unique: true
    })
    description: string
}
