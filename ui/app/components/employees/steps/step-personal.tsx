import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { X, ImagePlus } from "lucide-react";
import { cn } from "~/lib/utils";

export function StepPersonal({ form, updateField, fileInputRef, isEditMode }: any) {
  const clearImage = () => {
    updateField("profileImageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Datos Personales</h2>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* COLUMNA IMAGEN */}
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-40 w-40 border border-dashed">
            {form.profileImageUrl ? (
              <AvatarImage src={form.profileImageUrl} />
            ) : (
              <AvatarFallback>Sin foto</AvatarFallback>
            )}
          </Avatar>

          <label
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-full max-w-xs cursor-pointer border rounded-md py-2 flex gap-2 justify-center"
            )}
          >
            <ImagePlus className="w-4 h-4" />
            Subir imagen
          </label>

          {form.profileImageUrl && (
            <Button type="button" variant="destructive" onClick={clearImage}>
              <X className="w-4 h-4" />
              Quitar imagen
            </Button>
          )}
        </div>

        {/* COLUMNA CAMPOS */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label>CUI</Label>
            <Input
              value={form.cui}
              maxLength={13}
              onChange={(e) => updateField("cui", e.target.value)}
              disabled={isEditMode}
            />
          </div>

          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input
              value={form.firstName}
              maxLength={50}
              onChange={(e) => updateField("firstName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Apellido</Label>
            <Input
              value={form.lastName}
              maxLength={50}
              onChange={(e) => updateField("lastName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input
              value={form.phoneNumber}
              maxLength={8}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha de nacimiento</Label>
            <Input
              type="date"
              value={form.birthDate}
              onChange={(e) => updateField("birthDate", e.target.value)}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label>Correo</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              disabled={isEditMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
