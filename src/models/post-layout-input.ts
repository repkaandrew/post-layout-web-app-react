export class PostLayoutInput {
  postSize?: number;
  panelMaxLength?: number;
  runHorLength?: number;
  obstructions?: ObstructionData[];

  constructor(source: Partial<PostLayoutInput>) {
    this.postSize = source?.postSize;
    this.panelMaxLength = source?.panelMaxLength;
    this.runHorLength = source?.runHorLength;
    this.obstructions = source?.obstructions;
  }
}

export class ObstructionData {
  size?: number;
  location?: number;
  type?: ObstructionType;
}

export enum ObstructionType {
  MUST_AVOID = 'MUST_AVOID',
  TRY_TO_AVOID = 'TRY_TO_AVOID',
  PLACE_POST = 'PLACE_POST'
}
