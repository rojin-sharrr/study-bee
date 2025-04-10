import {
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BeforeUpdate,
  } from 'typeorm';
   
  export abstract class CustomBaseEntity extends BaseEntity  {
    @CreateDateColumn()
    createdAt!: Date;
   
    @UpdateDateColumn()
    updatedAt!: Date;
   
    @DeleteDateColumn()
    deletedAt?: Date;
   
    @BeforeUpdate()
    updateTimestamp() {
      this.updatedAt = new Date();
    }
  }