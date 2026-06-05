// components/PersonRegistrationForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAndLockTask,
  completeExternalTask,
  reportTaskFailure,
  startRegisterProcess
} from "../services/camundaService";
import "./PersonRegistrationForm.css";

export default function PersonRegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    personName:     "",
    personLastName: "",
    numberPhone:    "",
    email:          ""
  });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleChange = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async () => {
  setStatus("loading");
  setMessage("Iniciando proceso...");

  let task = null;

  try {
    // 1. Iniciar el proceso
    await startRegisterProcess();

    // 2. Pequeña espera para que Camunda registre la tarea
    await new Promise(resolve => setTimeout(resolve, 500));

    setMessage("Buscando tarea disponible...");

    // 3. Hacer fetchAndLock
    task = await fetchAndLockTask("receive-person-data");

    if (!task) {
      setStatus("error");
      setMessage("No hay proceso esperando datos en este momento.");
      return;
    }

    setMessage("Tarea encontrada. Enviando datos...");

    // 4. Completar la tarea
    await completeExternalTask(task.id, formData);

    setStatus("success");
    setMessage("Datos enviados. El proceso continúa automáticamente.");

  } catch (error) {
    if (task) await reportTaskFailure(task.id, error.message);
    setStatus("error");
    setMessage("Error: " + error.message);
  }
};

  return (
    <div className="person-registration-container">
      <nav className="registration-navbar">
        <div className="registration-nav-content">
          <div className="registration-nav-brand">
            <h1>👤 Registro de Persona</h1>
            <p>Complete el formulario con sus datos</p>
          </div>
          <button className="btn-back-nav" onClick={() => navigate("/")}>
            ← Volver
          </button>
        </div>
      </nav>

      <div className="registration-content">
        <div className="registration-card">
          <form className="registration-form">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                placeholder="Ingresa tu nombre"
                value={formData.personName}
                onChange={handleChange("personName")}
              />
            </div>

            <div className="form-group">
              <label>Apellido *</label>
              <input
                type="text"
                placeholder="Ingresa tu apellido"
                value={formData.personLastName}
                onChange={handleChange("personLastName")}
              />
            </div>

            <div className="form-group">
              <label>Teléfono *</label>
              <input
                type="tel"
                placeholder="Ingresa tu teléfono"
                value={formData.numberPhone}
                onChange={handleChange("numberPhone")}
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                placeholder="Ingresa tu email"
                value={formData.email}
                onChange={handleChange("email")}
              />
            </div>

            {message && (
              <div className={`message message-${status}`}>
                {message}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn-submit"
                onClick={handleSubmit}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Enviando..." : "Enviar Datos"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}