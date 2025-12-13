import { Combobox } from "~/components/common/combobox-option";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function StepWork({ form, updateField, positions }: any) {
  const positionOptions = positions.map((p: any) => ({
    value: p.id,
    label: p.name,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Datos Laborales</h2>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Puesto */}
        <div className="space-y-2">
          <Label>Puesto</Label>
          <Combobox
            options={positionOptions}
            value={form.positionId}
            onChange={(v) => updateField("positionId", v)}
            placeholder="Selecciona un puesto"
          />
        </div>

        {/* Tipo de jornada */}
        <div className="space-y-2">
          <Label>Tipo de jornada</Label>
          <Select
            value={form.workloadType}
            onValueChange={(v) => updateField("workloadType", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FULL_TIME">Tiempo completo</SelectItem>
              <SelectItem value="PART_TIME">Medio tiempo</SelectItem>
              <SelectItem value="TEMPORAL">Temporal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Fecha de contratación */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Fecha de contratación</Label>
          <Input
            id="startDate"
            type="date"
            value={form.startDate}
            onChange={(e) => updateField("startDate", e.target.value)}
          />
        </div>

        {/* Salario */}
        <div className="space-y-2">
          <Label htmlFor="salary">Salario</Label>
          <Input
            id="salary"
            type="number"
            min={0}
            step="0.01"
            placeholder="0.00"
            value={form.salary}
            onChange={(e) => updateField("salary", e.target.value)}
          />
        </div>

        {/* IGSS */}
        <div className="space-y-2">
          <Label htmlFor="igssPercentage">IGSS (%)</Label>
          <Input
            id="igssPercentage"
            type="number"
            min={0}
            max={10}
            step="0.01"
            placeholder="2.5"
            value={form.igssPercentage}
            onChange={(e) => updateField("igssPercentage", e.target.value)}
          />
        </div>

        {/* IRTRA */}
        <div className="space-y-2">
          <Label htmlFor="irtraPercentage">IRTRA (%)</Label>
          <Input
            id="irtraPercentage"
            type="number"
            min={0}
            max={10}
            step="0.01"
            placeholder="2.5"
            value={form.irtraPercentage}
            onChange={(e) => updateField("irtraPercentage", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
