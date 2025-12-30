import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Loader2, ArrowRightLeft } from "lucide-react";
import { Combobox } from "~/components/common/combobox-option";

import type { SprintResponseDTO } from "~/types/scrum/sprint";

interface MoveWorkItemsToSprintFormProps {
  sprints: SprintResponseDTO[];
  sprint?: string | null; // opcional
}

export function WorkItemMoveToSprintForm({
  sprints,
  sprint,
}: MoveWorkItemsToSprintFormProps) {
  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined;

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [selected, setSelected] = useState<string>(
    sprint ?? ""
  );

  const sprintOptions = sprints
    .filter((s) => !s.isDeleted && s.status !== "COMPLETED")
    .map((s) => ({ value: s.id, label: s.name }));

  return (
    <Form method="post" className="space-y-4">
      {/* ...header */}

      <div className="space-y-2">
        <Label>Sprint</Label>
        <Combobox
          options={sprintOptions}
          value={selected}
          onChange={(v) => setSelected(v ?? "")}
          placeholder="Buscar sprint…"
        />
        {actionData?.errors?.sprintId && (
          <p className="text-sm text-red-500">
            {actionData.errors.sprintId}
          </p>
        )}
      </div>

      {/* ✅ SIEMPRE enviar sprintId (aunque sea "") */}
      <input type="hidden" name="sprintId" value={selected} />

      <div className="flex items-center justify-end pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || !selected}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Moviendo...
            </>
          ) : (
            <>
              <ArrowRightLeft className="h-4 w-4" />
              Mover
            </>
          )}
        </Button>
      </div>
    </Form>
  );
}

