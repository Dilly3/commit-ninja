import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({name:'commits'})
export class CommitInfo {
  @PrimaryColumn()
  id: string;
  @Column({
    type: 'varchar',
    name: 'repo_name',
    nullable: false,
  })
  repoName: string;
  @Column({ name: 'message', type: 'varchar' })
  message: string;
  @Column({ name: 'author_name' })
  authorName: string;
  @Column({ name: 'author_email' })
  authorEmail: string;
  @Column({ name: 'date' })
  date: string;
  @Column({ name: 'url' })
  url: string;
}
