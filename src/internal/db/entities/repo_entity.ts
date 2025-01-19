import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "repos" })
export class RepoInfo {
  @PrimaryColumn({ type: "int" })
  id: number;
  @Column()
  name: string;
  @Column({ name: "created_at" })
  createdAt: string;
  @Column({ name: "updated_at" })
  updatedAt: string;
  @Column({ name: "url" })
  url: string;
  @Column({ name: "description", nullable: true })
  description: string;
  @Column({ name: "language", nullable: true })
  language: string;
  @Column({ name: "forks", type: "int", nullable: true })
  forks: number;
  @Column({ name: "stars", type: "int", nullable: true })
  stars: number;
  @Column({ name: "open_issues", type: "int", nullable: true })
  openIssues: number;
}

export interface MaxStars {
  name: string;
  url: string;
  stars: number;
}
