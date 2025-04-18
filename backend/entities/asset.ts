import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { CustomBaseEntity } from "./customBaseEntity";
import { IAssetModel } from "../interfaces";

// Create Asset entity
@Entity("assets")
export default class Asset extends CustomBaseEntity implements IAssetModel {
    
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({nullable: false})
    name!: string;

    @Column({nullable: false})
    fileType!: string;

    @Column({nullable: false})
    fileData!: string;

    @Column ({nullable: false})
    file!: string


}