import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserRole {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number

    @Column({ type: "varchar" })
    description: string
}
