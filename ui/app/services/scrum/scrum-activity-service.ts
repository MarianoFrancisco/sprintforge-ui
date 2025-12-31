import { apiClient } from "~/lib/api-client";
import { EntityType, type GetScrumActivitiesParams, type ScrumActivityResponseDTO } from "~/types/scrum/scrum-activiy";

class ScrumActivityService {
  private basePath = "/api/v1/scrum-activity";

  private async handleError(error: any): Promise<never> {
    console.error("Scrum Activity API Error:", error);
    throw new Error(error.message || "Error desconocido al procesar la solicitud");
  }

  async getAll(params: GetScrumActivitiesParams): Promise<ScrumActivityResponseDTO[]> {
    try {
      const queryParams = new URLSearchParams();

      // Parámetro requerido
      queryParams.append("entityType", params.entityType);

      // Parámetros opcionales
      if (params.projectId) queryParams.append("projectId", params.projectId);
      if (params.sprintId) queryParams.append("sprintId", params.sprintId);
      if (params.workItemId) queryParams.append("workItemId", params.workItemId);

      const endpoint = `${this.basePath}?${queryParams.toString()}`;
      const activities = await apiClient.get<ScrumActivityResponseDTO[]>(endpoint);
      
      return activities;
    } catch (error) {
      console.error("Error fetching scrum activities:", error);
      // Retorna array vacío en caso de error como solicitaste
      return [];
    }
  }

  async getByProject(projectId: string): Promise<ScrumActivityResponseDTO[]> {
    return this.getAll({
      entityType: EntityType.PROJECT,
      projectId
    });
  }

  async getBySprint(sprintId: string): Promise<ScrumActivityResponseDTO[]> {
    return this.getAll({
      entityType: EntityType.SPRINT,
      sprintId
    });
  }

  async getByWorkItem(workItemId: string): Promise<ScrumActivityResponseDTO[]> {
    return this.getAll({
      entityType: EntityType.WORK_ITEM,
      workItemId
    });
  }

  async getByBoardColumn(boardColumnId: string): Promise<ScrumActivityResponseDTO[]> {
    // Nota: El endpoint actual no soporta boardColumnId directamente
    // Podrías necesitar ajustar el backend o usar otro enfoque
    return this.getAll({
      entityType: EntityType.BOARD_COLUMN,
      // Si el backend acepta workItemId para BOARD_COLUMN, ajusta esto
      workItemId: boardColumnId
    });
  }

  // Método para obtener actividades recientes con límite
  async getRecent(params: GetScrumActivitiesParams & { limit?: number }): Promise<ScrumActivityResponseDTO[]> {
    try {
      const activities = await this.getAll(params);
      if (params.limit && activities.length > params.limit) {
        return activities.slice(0, params.limit);
      }
      return activities;
    } catch (error) {
      console.error("Error fetching recent scrum activities:", error);
      return [];
    }
  }
}

export const scrumActivityService = new ScrumActivityService();