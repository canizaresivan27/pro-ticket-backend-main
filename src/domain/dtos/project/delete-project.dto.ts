import { Validators } from "../../../config";

export class DeleteProjectDto {
  private constructor(public readonly id: string) {}

  static create(object: { [key: string]: any }): [string?, DeleteProjectDto?] {
    const { id } = object;

    if (!id) return ["Missing project Id"];
    if (!Validators.isMongoID(id)) return ["Invalid project Id"];

    return [undefined, new DeleteProjectDto(id)];
  }
}
