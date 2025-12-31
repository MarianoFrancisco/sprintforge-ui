export enum EntityType {
  PROJECT = "PROJECT",
  SPRINT = "SPRINT",
  WORK_ITEM = "WORK_ITEM",
  BOARD_COLUMN = "BOARD_COLUMN"
}

export interface ScrumActivityResponseDTO {
  id: string;
  eventType: string;
  message: string;
  occurredAt: string; // ISO 8601 string format
}

export interface GetScrumActivitiesParams {
  entityType: EntityType;
  projectId?: string;
  sprintId?: string;
  workItemId?: string;
}