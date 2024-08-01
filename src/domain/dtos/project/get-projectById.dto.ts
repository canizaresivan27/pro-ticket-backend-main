import { Validators } from "../../../config";

export class GetProjectByIdDto {
  private constructor(public readonly id: string) {}

  static create(object: { [key: string]: any }): [string?, GetProjectByIdDto?] {
    const { id } = object;

    if (!id) return ["Missing project ID"];
    if (!Validators.isMongoID(id)) return ["Invalid project Id"];

    return [undefined, new GetProjectByIdDto(id)];
  }
}
