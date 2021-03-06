import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid} from 'uuid'

@Entity("users")

class Users {

    @PrimaryColumn()
    readonly id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @CreateDateColumn()
    charted_at: Date;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
}

export { Users }