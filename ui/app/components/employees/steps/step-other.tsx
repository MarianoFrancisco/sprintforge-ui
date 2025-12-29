import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export function StepOther({ form, updateField }:any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Información Adicional</h2>

      <div className="space-y-2">
        <Label>Notas</Label>
        <Textarea
          value={form.notes}
          rows={5}
          maxLength={100}
          onChange={(e) => updateField("notes", e.target.value)}
        />
      </div>
    </div>
  );
}
