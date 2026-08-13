import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import apiClient from "../../api/apiClient";
import { addTemporaryPlayer, TemporaryPlayerPayload } from "../../api/coaches";
import { getAllCategories, getProgramsByCategory, getAllTerms } from "../../api/adminApi";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import DatePicker from "../form/date-picker";
import MultiSelect from "../form/MultiSelect";

interface ClassItem {
  classId?: string;
  _id?: string;
  className?: string;
  name?: string;
  location: string;
  startTime: string;
  dayOfWeek: string;
}

export default function AddTempPlayerscomp() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  const [allTerms, setAllTerms] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [loadingTerms, setLoadingTerms] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<{
    name: string;
    dob: string;
    parentName: string;
    parentEmail: string;
    parentPhone: string;
    emergencyContact: string;
    medicalConditions?: string;
    allergies?: string;
    classId: string;
    sessionDate: string;
    selectedCategory: string;
    selectedProgram: string;
    selectedYear: string;
    preferredTerm: string;
    gender: string;
    prefferedFoot: string;
    preferredClasses: string[];
  }>({
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
      selectedCategory: "",
      selectedProgram: "",
      selectedYear: "",
      preferredTerm: "",
      gender: "",
      prefferedFoot: "",
      preferredClasses: [],
    },
  });

  const watchCategory = watch("selectedCategory");
  const watchProgram = watch("selectedProgram");
  const watchTerm = watch("preferredTerm");
  const watchYear = watch("selectedYear");
  const watchPreferredClasses = watch("preferredClasses") || [];

  useEffect(() => {
    register("preferredClasses", { required: "Please select at least one class" });
  }, [register]);

  useEffect(() => {
    const fetchFilteredClasses = async () => {
      if (!watchCategory || !watchProgram || !watchTerm) {
        setClasses([]);
        setValue("classId", "");
        return;
      }

      setLoadingClasses(true);
      try {
        const response = await apiClient.get("/api/user/classes", {
          params: {
            category: watchCategory,
            program: watchProgram,
            term: watchTerm,
          },
        });
        const classesList = response && response.data ? response.data : [];
        const parsedClasses = Array.isArray(classesList) 
          ? classesList 
          : (Array.isArray(classesList.data) ? classesList.data : []);
        
        setClasses(parsedClasses);
      } catch (error) {
        console.error("Failed to fetch filtered classes:", error);
        toast.error("Failed to load matching classes");
        setClasses([]);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchFilteredClasses();
  }, [watchCategory, watchProgram, watchTerm, setValue]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response) {
          const cats = Array.isArray(response) ? response : (Array.isArray(response.data) ? response.data : []);
          setCategories(cats);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories list");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await getAllTerms(undefined, "all");
        const termsList = response && response.data ? response.data : (Array.isArray(response) ? response : []);
        setAllTerms(termsList);
        
        const uniqueYears = Array.from(
          new Set(termsList.map((t: any) => t.year?.toString()).filter(Boolean))
        ).sort() as string[];
        setYears(uniqueYears);
      } catch (error) {
        console.error("Failed to fetch terms:", error);
        toast.error("Failed to load terms list");
      } finally {
        setLoadingTerms(false);
      }
    };
    fetchTerms();
  }, []);

  const handleCategoryChange = async (categoryId: string) => {
    setValue("selectedProgram", "");
    setPrograms([]);
    if (!categoryId) return;

    setLoadingPrograms(true);
    try {
      const response = await getProgramsByCategory(categoryId);
      if (response) {
        const progs = Array.isArray(response) ? response : (Array.isArray(response.data) ? response.data : []);
        setPrograms(progs);
      }
    } catch (error) {
      console.error("Failed to fetch programs:", error);
      toast.error("Failed to load programs list");
    } finally {
      setLoadingPrograms(false);
    }
  };

  const handleYearChange = () => {
    setValue("preferredTerm", "");
  };

  const handleClearForm = () => {
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
      selectedCategory: "",
      selectedProgram: "",
      selectedYear: "",
      preferredTerm: "",
      gender: "",
      prefferedFoot: "",
      preferredClasses: [],
    });
    setPrograms([]);
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const payload: TemporaryPlayerPayload = {
        name: data.name,
        dob: data.dob,
        parentName: data.parentName,
        parentEmail: data.parentEmail,
        parentPhone: data.parentPhone,
        emergencyContact: data.emergencyContact,
        medicalConditions: data.medicalConditions,
        allergies: data.allergies,
        classId: data.classId,
        sessionDate: data.sessionDate,
        categories: data.selectedCategory ? [data.selectedCategory] : [],
        programs: data.selectedProgram ? [data.selectedProgram] : [],
        preferredTerm: data.preferredTerm || undefined,
        preferredClasses: data.preferredClasses || [],
        prefferedFoot: data.prefferedFoot || undefined,
        preferredFoot: data.prefferedFoot || undefined,
        gender: data.gender || undefined,
      };
      await addTemporaryPlayer(payload);
      toast.success("Temporary player added successfully!");
      handleClearForm();
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Gender <span className="text-error-500">*</span></Label>
                  <select
                    className="h-11 w-full rounded-none border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-white/90 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 transition-all appearance-none cursor-pointer"
                    {...register("gender", { required: "Please select gender" })}
                  >
                    <option value="">Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-xs text-error-500 font-semibold">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <Label>Foot <span className="text-error-500">*</span></Label>
                  <select
                    className="h-11 w-full rounded-none border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-white/90 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 transition-all appearance-none cursor-pointer"
                    {...register("prefferedFoot", { required: "Please select foot" })}
                  >
                    <option value="">Foot</option>
                    <option value="RIGHT">Right</option>
                    <option value="LEFT">Left</option>
                    <option value="BOTH">Both</option>
                  </select>
                  {errors.prefferedFoot && (
                    <p className="mt-1 text-xs text-error-500 font-semibold">{errors.prefferedFoot.message}</p>
                  )}
                </div>
              </div>
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
              <Label>Select Year <span className="text-error-500">*</span></Label>
              <select
                className="h-11 w-full rounded-none border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-white/90 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 transition-all appearance-none cursor-pointer"
                disabled={loadingTerms}
                {...register("selectedYear", {
                  required: "Please select a year",
                  onChange: () => handleYearChange()
                })}
              >
                <option value="">{loadingTerms ? "Loading years..." : "Select Year"}</option>
                {years.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              {errors.selectedYear && (
                <p className="mt-1 text-xs text-error-500 font-semibold">{errors.selectedYear.message}</p>
              )}
            </div>

            <div>
              <Label>Preferred Term <span className="text-error-500">*</span></Label>
              <select
                className="h-11 w-full rounded-none border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-white/90 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 transition-all appearance-none cursor-pointer disabled:bg-gray-100 disabled:opacity-50 dark:disabled:bg-gray-800/50 disabled:cursor-not-allowed"
                disabled={!watchYear}
                {...register("preferredTerm", { required: watchYear ? "Please select a term" : false })}
              >
                <option value="">{!watchYear ? "Select Year first" : "Select Term"}</option>
                {watchYear && allTerms
                  .filter((t: any) => t.year?.toString() === watchYear)
                  .map((term: any) => (
                    <option key={term._id} value={term._id}>
                      {term.name}
                    </option>
                  ))}
              </select>
              {errors.preferredTerm && (
                <p className="mt-1 text-xs text-error-500 font-semibold">{errors.preferredTerm.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Main Category <span className="text-error-500">*</span></Label>
              <select
                className="h-11 w-full rounded-none border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-white/90 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 transition-all appearance-none cursor-pointer"
                disabled={loadingCategories}
                {...register("selectedCategory", {
                  required: "Please select a main category",
                  onChange: (e) => handleCategoryChange(e.target.value)
                })}
              >
                <option value="">{loadingCategories ? "Loading categories..." : "Select Main Category"}</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.selectedCategory && (
                <p className="mt-1 text-xs text-error-500 font-semibold">{errors.selectedCategory.message}</p>
              )}
            </div>

            <div>
              <Label>Sub Category (Program) <span className="text-error-500">*</span></Label>
              <select
                className="h-11 w-full rounded-none border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-white/90 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/20 transition-all appearance-none cursor-pointer disabled:bg-gray-100 disabled:opacity-50 dark:disabled:bg-gray-800/50 disabled:cursor-not-allowed"
                disabled={!watchCategory || loadingPrograms}
                {...register("selectedProgram", { required: watchCategory ? "Please select a program" : false })}
              >
                <option value="">
                  {loadingPrograms
                    ? "Loading programs..."
                    : !watchCategory
                    ? "Select Main Category first"
                    : "Select Program"}
                </option>
                {watchCategory && programs.map((prog) => (
                  <option key={prog._id} value={prog._id}>
                    {prog.name}
                  </option>
                ))}
              </select>
              {errors.selectedProgram && (
                <p className="mt-1 text-xs text-error-500 font-semibold">{errors.selectedProgram.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Assign Class <span className="text-error-500">*</span></Label>
              <MultiSelect
                placeholder={
                  loadingClasses 
                    ? "Loading classes..." 
                    : (!watchCategory || !watchProgram || !watchTerm) 
                      ? "Select Category, Program & Term first" 
                      : "Select Target Classes"
                }
                disabled={loadingClasses || !watchCategory || !watchProgram || !watchTerm}
                options={classes.map((c) => {
                  const id = c.classId || c._id || "";
                  const name = c.className || c.name || "";
                  return {
                    value: id,
                    text: `${name} (${c.dayOfWeek} at ${c.startTime}) - ${c.location}`
                  };
                })}
                value={watchPreferredClasses}
                onChange={(selected) => {
                  setValue("preferredClasses", selected);
                  setValue("classId", selected[0] || "");
                  trigger(["preferredClasses", "classId"]);
                }}
              />
              {errors.preferredClasses && (
                <p className="mt-1 text-xs text-error-500 font-semibold">{errors.preferredClasses.message}</p>
              )}
            </div>

            <div>
              <input type="hidden" {...register("sessionDate", { required: "Session date is required" })} />
              <DatePicker
                label="Session Date"
                defaultDate={new Date().toISOString().split("T")[0]}
                placeholder="Select Session Date"
                options={{ minDate: "today", position: "above", static: false }}
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
          <Button variant="outline" type="button" onClick={handleClearForm}>
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
