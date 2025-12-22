import React from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const formatAppointmentMessage = (content: string): React.ReactNode => {
  const hasAppointmentPattern =
    /Cita\s*#?\d+/i.test(content) ||
    /Fecha:/.test(content) ||
    /Hora:/.test(content);

  if (!hasAppointmentPattern) {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }

  const lines = content.split("\n");
  const formattedLines: React.ReactNode[] = [];
  let currentAppointment: string[] = [];
  let inAppointment = false;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (
      /^📅\s*\*\*Cita\s*#?\d+/i.test(trimmedLine) ||
      /^Cita\s*#?\d+/i.test(trimmedLine)
    ) {
      if (currentAppointment.length > 0) {
        formattedLines.push(
          <div key={`appt-${index}`} className="mb-4">
            {formatAppointmentBlock(currentAppointment.join("\n"))}
          </div>
        );
      }
      currentAppointment = [trimmedLine];
      inAppointment = true;
    } else if (inAppointment) {
      if (trimmedLine === "" && currentAppointment.length > 1) {
        formattedLines.push(
          <div key={`appt-${index}`} className="mb-4">
            {formatAppointmentBlock(currentAppointment.join("\n"))}
          </div>
        );
        currentAppointment = [];
        inAppointment = false;
      } else if (trimmedLine !== "") {
        currentAppointment.push(trimmedLine);
      } else if (trimmedLine === "" && currentAppointment.length === 0) {
        formattedLines.push(<br key={`br-${index}`} />);
      }
    } else {
      if (trimmedLine) {
        formattedLines.push(
          <p key={`text-${index}`} className="mb-2">
            {trimmedLine}
          </p>
        );
      } else {
        formattedLines.push(<br key={`br-${index}`} />);
      }
    }
  });

  if (currentAppointment.length > 0) {
    formattedLines.push(
      <div key="appt-last" className="mb-4">
        {formatAppointmentBlock(currentAppointment.join("\n"))}
      </div>
    );
  }

  return <div>{formattedLines}</div>;
};

const formatAppointmentBlock = (appointmentText: string): React.ReactNode => {
  const lines = appointmentText.split("\n").filter((line) => line.trim());
  const appointmentLines: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (
      /^📅\s*\*\*Cita\s*#?\d+/i.test(trimmedLine) ||
      /^Cita\s*#?\d+/i.test(trimmedLine)
    ) {
      appointmentLines.push(
        <div
          key={`title-${index}`}
          className="font-bold text-lg text-indigo-700 mb-2 pb-2 border-b border-indigo-200"
        >
          {trimmedLine.replace(/\*\*/g, "")}
        </div>
      );
    } else if (
      /^[-•]\s*(📆|⏰|📝|✅|Fecha|Hora|Motivo|Estado):/i.test(trimmedLine)
    ) {
      const cleanLine = trimmedLine.replace(/^[-•]\s*/, "");
      const [label, ...valueParts] = cleanLine.split(":");
      const value = valueParts.join(":").trim();

      const labelColor = "text-gray-700";
      let valueColor = "text-gray-900";

      if (label.includes("Estado") || label.includes("✅")) {
        if (value.toLowerCase().includes("confirmada")) {
          valueColor = "text-green-600 font-semibold";
        } else if (value.toLowerCase().includes("cancelada")) {
          valueColor = "text-red-600 font-semibold";
        } else {
          valueColor = "text-yellow-600 font-semibold";
        }
      }

      appointmentLines.push(
        <div key={`info-${index}`} className="mb-1.5 text-sm">
          <span className={`font-medium ${labelColor}`}>{label}:</span>{" "}
          <span className={valueColor}>{value} </span>
        </div>
      );
    } else if (trimmedLine) {
      appointmentLines.push(
        <div key={`other-${index}`} className="mb-1 text-sm text-gray-700">
          {trimmedLine}
        </div>
      );
    }
  });

  return (
    <div className="bg-linear-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4 shadow-sm">
      {appointmentLines}
    </div>
  );
};

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-white text-gray-800 shadow-sm border border-gray-200"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          formatAppointmentMessage(content)
        )}
      </div>
    </div>
  );
}
