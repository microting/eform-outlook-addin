export class AdvEntitySelectableItemModel {
  name: string;
  description: string;
  entityItemUId: string;
  workflowState: string;
  microtingUUID: string;
  id: number;

  constructor(name?: string) {
    this.name = name;
  }
}
