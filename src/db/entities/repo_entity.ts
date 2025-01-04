import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity()
export class RepoInfo {
    @PrimaryColumn({type:'int'})
    id: number;
    @Column()
    name: string;
    @Column({name:'created_at'})
    createdAt: string;
    @Column({name:'updated_at'})
    updatedAt: string;
    @Column({name:'url'})
    url: string;
    @Column({name:'description'})
    description: string;
    @Column({name:'language'})
    language: string;
    @Column({name:'forks',type:'int'})
    forks: number;
    @Column({name:'stars',type:'int'})
    stars: number;
    @Column({name:'open_issues',type:'int'})
    openIssues: number;
}

