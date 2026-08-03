import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { addTemporaryPlayer, getCoachClasses, TemporaryPlayerPayload } from "../../api/coaches";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import DatePicker from "../form/date-picker";

interface ClassItem {
  classId: string;
  className: string;
  location: string;
  startTime: string;
  dayOfWeek: string;
}

export default function AddTempPlayerscomp() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<TemporaryPlayerPayload>({
    defaultValues: {
      name: "",
      dob: "",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      emergencyContact: "",
      medicalConditions: "",
      allergies: "",
      classId: "",
      sessionDate: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getCoachClasses();
        if (response && Array.isArray(response.data)) {
          setClasses(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        toast.error("Failed to load classes list");
      } finally {
        setLoadingClasses(false);
      }
    };
    fetchClasses();
  }, []);

  const onSubmit = async (data: TemporaryPlayerPayload) => {
    setSubmitting(true);
    try {
      await addTemporaryPlayer(data);
      toast.success("Temporary player added successfully!");
      reset({
        name: "",
        dob: "",
        parentName: "",
        parentEmail: "",
        parentPhone: "",
        emergencyContact: "",
        medicalConditions: "",
        allergies: "",
        classId: "",
        sessionDate: new Date().toISOString().split("T")[0],
      });
    } catch (error: any) {
      console.error("Failed to add temporary player:", error);
      const msg = error?.response?.data?.message || "Failed to add temporary player.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] p-6 sm:p-8 shadow-sm">
      <div className="mb-6 border-b border-gray-100 dark:border-white/[0.05] pb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Add Temporary Player</h3>
        <p className="text-xs text-gray-500 font-medium">Register a trial or temporary player for a specific class session.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Player details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Player Details</h4>

            <div>
              <Label>Player Name <span className="text-error-500">*</span></Label>
              <Input
                type="text"
                placeholder="e.g. Trial Player Name"
                error={!!errors.name}
                hint={errors.name?.message}
                {...register("name", { required: "Player name is required" })}
              />
            </div>

            <div>
              <input type="hidden" {...register("dob", { required: "Date of birth is required" })} />
              <DatePicker
                label="Date of Birth"
                placeholder="Select Date of Birth"
                options={{ maxDate: "today" }}
                onChange={([selectedDate]) => {
                  if (selectedDate) {
                    const localDateStr = selectedDate.toLocaleDateString("en-CA"); // YYYY-MM-DD
                    setValue("dob", localDateStr);
                    trigger("dob");
                  }
                }}
              />
              {errors.dob && (
                <p className="mt-1.5 text-xs text-error-500 font-semibold">{errors.dob.message}</p>
              )}
            </div>

            <div>
              <Label>Medical Conditions</Label>
              <Input
                type="text"
                placeholder="e.g. None or specific details"
                error={!!errors.medicalConditions}
                hint={errors.medicalConditions?.message}
                {...register("medicalConditions")}
              />
            </div>

            <div>
              <Label>Allergies</Label>
              <Input
                type="text"
                placeholder="e.g. Asthma, Peanuts"
                error={!!errors.allergies}
                hint={errors.allergies?.message}
                {...register("allergies")}
              />
            </div>
          </div>

          {/* Parent/Contact details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Contact Details</h4>

            <div>
              <Label>Parent Full Name <span className="text-error-500">*</span></Label>
              <Input
                type="text"
                placeholder="e.g. Parent Full Name"
                error={!!errors.parentName}
                hint={errors.parentName?.message}
                {...register("parentName", { required: "Parent name is required" })}
              />
            </div>

            <div>
              <Label>Parent Email <span className="text-error-500">*</span></Label>
              <Input
                type="email"
                placeholder="e.g. parent.trial@example.com"
                error={!!errors.parentEmail}
                hint={errors.parentEmail?.message}
                {...register("parentEmail", { required: "Parent email is required" })}
              />
            </div>

            <div>
              <Label>Parent Phone <span className="text-error-500">*</span></Label>
              <Input
                type="text"
                placeholder="e.g. +61400000000"
                error={!!errors.parentPhone}
                hint={errors.parentPhone?.message}
                {...register("parentPhone", { required: "Parent phone is required" })}
              />
            </div>

            <div>
              <Label>Emergency Contact <span className="text-error-500">*</span></Label>
              <Input
                type="text"
                placeholder="e.g. +61400000001"
                error={!!errors.emergencyContact}
                hint={errors.emergencyContact?.message}
                {...register("emergencyContact", { required: "Emergency contact is required" })}
              />
            </div>
          </div>
        </div>

        {/* Session / Class parameters */}
        <div className="border-t border-gray-100 dark:border-white/[0.05] pt-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Session Assignment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Assign Class <span className="text-error-500">*</span></Label>
              <select
                className="w-full rounded-none border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 focus:bg-white focus:border-brand-500 outline-none transition-all appearance-none cursor-pointer"
                disabled={loadingClasses}
                {...register("classId", { required: "Please select a class" })}
              >
                <option value="">{loadingClasses ? "Loading classes..." : "Select Target Class"}</option>
                {classes.map((c) => (
                  <option key={c.classId} value={c.classId}>
                    {c.className} ({c.dayOfWeek} at {c.startTime}) - {c.location}
                  </option>
                ))}
              </select>
              {errors.classId && (
                <p className="mt-1 text-xs text-error-500 font-semibold">{errors.classId.message}</p>
              )}
            </div>

            <div>
              <input type="hidden" {...register("sessionDate", { required: "Session date is required" })} />
              <DatePicker
                label="Session Date"
                defaultDate={new Date().toISOString().split("T")[0]}
                placeholder="Select Session Date"
                options={{ minDate: "today" }}
                onChange={([selectedDate]) => {
                  if (selectedDate) {
                    const localDateStr = selectedDate.toLocaleDateString("en-CA"); // YYYY-MM-DD
                    setValue("sessionDate", localDateStr);
                    trigger("sessionDate");
                  }
                }}
              />
              {errors.sessionDate && (
                <p className="mt-1.5 text-xs text-error-500 font-semibold">{errors.sessionDate.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 dark:border-white/[0.05] pt-6">
          <Button variant="outline" type="button" onClick={() => reset()}>
            Clear Form
          </Button>
          <Button type="submit" disabled={submitting} className="px-10 h-12 rounded-none text-xs font-bold uppercase tracking-widest">
            {submitting ? "Adding..." : "Add Temporary Player"}
          </Button>
        </div>
      </form>
    </div>
  );
}
