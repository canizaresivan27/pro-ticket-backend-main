export class GetProjectByIdDto {
  constructor(public readonly projectId: string) {}

  static create(object: { [key: string]: any }): [string?, GetProjectByIdDto?] {
    const { projectId } = object;

    if (!projectId) return ["Missing project ID"];

    return [undefined, new GetProjectByIdDto(projectId)];
  }
}
