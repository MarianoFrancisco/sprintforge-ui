import { useState, useRef } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { StepPersonal } from "./steps/step-personal";
import { StepWork } from "./steps/step-work";
import { StepOther } from "./steps/step-other";
import { Form } from "react-router";

export function EmployeeForm({ employee, positions }: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    cui: employee?.cui ?? "",
    email: employee?.email ?? "",
    firstName: employee?.firstName ?? "",
    lastName: employee?.lastName ?? "",
    phoneNumber: employee?.phoneNumber ?? "",
    birthDate: employee?.birthDate ?? "",
    profileImageUrl: employee?.profileImageUrl ?? "",
    positionId: employee?.positionId ?? "",
    workloadType: employee?.workloadType ?? "",
    salary: employee?.salary ?? "",
    igssPercentage: employee?.igssPercentage ?? "",
    irtraPercentage: employee?.irtraPercentage ?? "",
    startDate: "",
    notes: "",
  });

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const progress = (currentStep / 3) * 100;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Form
        method="post"
        encType="multipart/form-data"
        className="space-y-6"
      >
        <Progress value={progress} />

        <Card>
          <CardContent className="p-6 space-y-4">
            {currentStep === 1 && (
              <StepPersonal
                form={form}
                updateField={updateField}
                fileInputRef={fileInputRef}
              />
            )}

            {currentStep === 2 && (
              <StepWork
                form={form}
                updateField={updateField}
                positions={positions}
              />
            )}

            {currentStep === 3 && (
              <StepOther form={form} updateField={updateField} />
            )}

            <div className="flex justify-between pt-4">
              {currentStep > 1 ? (
                <Button type="button" variant="secondary" onClick={() => setCurrentStep(s => s - 1)}>
                  Anterior
                </Button>
              ) : <div />}

              {currentStep < 3 ? (
                <>
                <Button type="button" onClick={() => setCurrentStep(s => s + 1)}>
                  Siguiente
                </Button>
                <Button type="submit" variant="outline" hidden>Submit hidden</Button>
                </>
              ) : (
                <Button type="submit">Contratar</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Serialización HTML (sin archivo ni preview) */}
        {Object.entries(form).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}

        {/* ÚNICO input file */}
        <input
          ref={fileInputRef}
          type="file"
          name="profileImage"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            updateField("profileImageUrl", URL.createObjectURL(file));
          }}
        />
      </Form>
    </div>
  );
}
