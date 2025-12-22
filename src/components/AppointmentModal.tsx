import { useEffect } from "react";
import { useForm } from "react-hook-form";
import AppointmentForm from "./AppointmentForm";
import type { AppointmentFormData } from "./AppointmentForm";

export interface Appointment {
  id: number;
  patient: number;
  patient_username: string;
  date: string;
  time: string;
  reason: string;
  status: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment | null;
  onSubmit: (data: AppointmentFormData, appointmentId?: number) => void;
  isSubmitting: boolean;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  onSubmit,
  isSubmitting,
}: AppointmentModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: formIsSubmitting },
  } = useForm<AppointmentFormData>({
    defaultValues: {
      date: "",
      time: "",
      reason: "",
      status: "pending",
    },
  });

  const handleClose = () => {
    reset({
      date: "",
      time: "",
      reason: "",
      status: "pending",
    });
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        const timeValue = appointment.time.substring(0, 5);
        reset({
          date: appointment.date,
          time: timeValue,
          reason: appointment.reason,
          status: appointment.status,
        });
      } else {
        reset({
          date: "",
          time: "",
          reason: "",
          status: "pending",
        });
      }
    }
  }, [isOpen, appointment, reset]);

  const handleFormSubmit = (data: AppointmentFormData) => {
    onSubmit(data, appointment?.id);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      style={{ zIndex: 9999 }}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">
          {appointment ? "Editar Cita" : "Nueva Cita"}
        </h2>
        <AppointmentForm
          register={register}
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={handleFormSubmit}
          isSubmitting={formIsSubmitting || isSubmitting}
          onCancel={handleClose}
          isEditing={!!appointment}
        />
      </div>
    </div>
  );
}
