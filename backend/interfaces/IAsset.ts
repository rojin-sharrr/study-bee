import IBase from "./IBase";

export interface IAssetModel extends IBase {
  name: string;
  fileType: string;
  file: string;
  isEmbedding: "DRAFT" | "PROCESSING" | "COMPLETED";
}
