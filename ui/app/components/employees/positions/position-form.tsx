import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent } from "~/components/ui/card";
import { Loader2, Save } from "lucide-react";
import type { PositionResponseDTO } from "~/types/employees/position";

interface PositionFormProps {
    position?: PositionResponseDTO;
}

export function PositionForm({ position }: PositionFormProps) {
    const actionData = useActionData() as
        | { error?: string; success?: string; errors?: Record<string, string> }
        | undefined;

    const navigation = useNavigation();
    const [submitted, setSubmitted] = useState(false);

    const isSubmitting = navigation.state === "submitting";
    const isEditMode = !!position;

    return (
        <div className="mx-auto max-w-xl space-y-6">


            <Card>
                <CardContent className="p-6">
                    <Form
                        method="post"
                        onSubmit={() => setSubmitted(true)}
                        className="space-y-4"
                    >

                        <div className="flex flex-col items-center gap-2 text-center">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                {isEditMode ? "Editar Puesto" : "Crear Puesto"}
                            </h2>
                        </div>

                        {/* ID oculto SOLO en edición */}
                        {isEditMode && (
                            <input type="hidden" name="id" value={position.id} />
                        )}

                        {/* Nombre */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                maxLength={100}
                                placeholder="Ej. Gerente de Operaciones"
                                defaultValue={position?.name ?? ""}
                                // required
                            />
                            {actionData?.errors?.name && (
                                <p className="text-sm text-destructive">{actionData.errors.name}</p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                name="description"
                                maxLength={255}
                                placeholder="Descripción breve del cargo"
                                defaultValue={position?.description ?? ""}
                            />
                            {actionData?.errors?.description && (
                                <p className="text-sm text-destructive">
                                    {actionData.errors.description}
                                </p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {isEditMode ? "Guardando cambios..." : "Creando..."}
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        {isEditMode ? "Guardar cambios" : "Crear Cargo"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
