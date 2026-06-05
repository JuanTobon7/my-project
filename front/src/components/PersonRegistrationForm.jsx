// components/PersonRegistrationForm.jsx
import { useState } from "react";
import {
  fetchAndLockTask,
  completeExternalTask,
  reportTaskFailure
} from "../services/camundaService";

export default function PersonRegistrationForm() {
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
    setMessage("Buscando tarea disponible...");

    let task = null;

    try {
      task = await fetchAndLockTask("receive-person-data");

      if (!task) {
        setStatus("error");
        setMessage("No hay proceso esperando datos en este momento.");
        return;
      }

      setMessage("Tarea encontrada. Enviando datos...");

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
    <div>
      <h2>Registro de Persona</h2>

      <input
        placeholder="Nombre"
        value={formData.personName}
        onChange={handleChange("personName")}
      />
      <input
        placeholder="Apellido"
        value={formData.personLastName}
        onChange={handleChange("personLastName")}
      />
      <input
        placeholder="Teléfono"
        value={formData.numberPhone}
        onChange={handleChange("numberPhone")}
      />
      <input
        placeholder="Email"
        value={formData.email}
        onChange={handleChange("email")}
      />

      <button onClick={handleSubmit} disabled={status === "loading"}>
        {status === "loading" ? "Enviando..." : "Enviar datos"}
      </button>

      {message && (
        <p style={{ color: status === "error" ? "red" : "green" }}>
          {message}
        </p>
      )}
    </div>
  );
}