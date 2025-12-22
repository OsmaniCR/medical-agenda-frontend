const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const api = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("auth-storage")
      ? JSON.parse(localStorage.getItem("auth-storage") || "{}").state?.token
      : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || error.message || "Request failed");
    }

    return response.json();
  },

  async login(username: string, password: string) {
    return api.request<{
      token: string;
      user: { id: number; username: string; email: string };
    }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  async register(username: string, password: string, email?: string) {
    return api.request<{
      token: string;
      user: { id: number; username: string; email: string };
    }>("/auth/register/", {
      method: "POST",
      body: JSON.stringify({ username, password, password2: password, email }),
    });
  },

  async sendMessage(
    message: string,
    conversationHistory: Array<{ role: string; content: string }> = []
  ) {
    return api.request<{ response: string }>("/chat/", {
      method: "POST",
      body: JSON.stringify({
        message,
        conversation_history: conversationHistory,
      }),
    });
  },

  async getAppointments() {
    return api.request<
      Array<{
        id: number;
        patient: number;
        patient_username: string;
        date: string;
        time: string;
        reason: string;
        status: string;
      }>
    >("/appointments/list/");
  },

  async createAppointment(data: {
    date: string;
    time: string;
    reason: string;
    status?: string;
  }) {
    return api.request<{
      id: number;
      patient: number;
      patient_username: string;
      date: string;
      time: string;
      reason: string;
      status: string;
    }>("/appointments/create/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateAppointment(
    appointmentId: number,
    data: {
      date?: string;
      time?: string;
      reason?: string;
      status?: string;
    }
  ) {
    return api.request<{
      id: number;
      patient: number;
      patient_username: string;
      date: string;
      time: string;
      reason: string;
      status: string;
    }>(`/appointments/${appointmentId}/update/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteAppointment(appointmentId: number) {
    return api.request<void>(`/appointments/${appointmentId}/delete/`, {
      method: "DELETE",
    });
  },
};
