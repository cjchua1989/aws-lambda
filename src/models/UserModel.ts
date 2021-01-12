import { Model } from './Model';
import { Column, Entity } from 'typeorm';

@Entity({
    name: 'users',
})
export class UserModel extends Model {
    @Column({
        type: 'varchar',
        length: 50,
    })
    public name: string;

    @Column({
        type: 'varchar',
        length: 50,
    })
    public email: string;

    @Column({
        type: 'varchar',
        length: 11,
    })
    public mobile: string;

    @Column({
        type: 'text',
    })
    public password: string;
}
