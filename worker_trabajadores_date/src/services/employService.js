const BASE_URL = "http://localhost:8080/api";
 
const employmentService = {
  /**
   * Trae todos los trabajadores disponibles
   * GET /employements
   */
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/employements`);
    if (!response.ok) throw new Error(`Error al obtener trabajadores: ${response.status}`);
    return response.json(); // People[]
  },
};
 
export default employmentService;