import { Validators } from "../../../config";

export class UpdateProjectMembersDto {
  private constructor(
    public readonly id: string,
    public readonly members: string[]
  ) {}

  static create(object: {
    [key: string]: any;
  }): [string?, UpdateProjectMembersDto?] {
    const { id, members } = object;

    let newMembers: string[] = [];

    if (!id) return ["Missing project Id"];
    if (!Validators.isMongoID(id)) return ["Invalid project Id"];
    if (!members) return ["Missing members"];
    if (typeof members === "string") {
      newMembers = JSON.parse(members);
    }

    return [undefined, new UpdateProjectMembersDto(id, newMembers)];
  }
}
