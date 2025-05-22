import IBase from "./IBase";

export interface IAssetModel extends IBase {
  isEmbedding: "DRAFT" | "PROCESSING" | "COMPLETED";
  name: string;
  fileType: string;
  fileData: string;
  file: string;
}
