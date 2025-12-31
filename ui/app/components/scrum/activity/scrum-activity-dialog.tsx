// ~/components/scrum/scrum-activity-history-dialog.tsx
import * as React from "react";
import { useNavigate } from "react-router";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import type { ScrumActivityResponseDTO } from "~/types/scrum/scrum-activiy";
import { ScrumActivitiesTable } from "./scrum-activity-table";


interface ScrumActivityHistoryDialogProps {
  activities: ScrumActivityResponseDTO[];
  /** opcional: si lo usas como route modal, por defecto true */
  defaultOpen?: boolean;
  /** opcional: ancho del dialog */
  className?: string;
}

export function ScrumActivityHistoryDialog({
  activities,
  defaultOpen = true,
  className,
}: ScrumActivityHistoryDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(defaultOpen);

  function onClose() {
    try {
      navigate(-1);
    } catch {
      navigate("/");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) onClose();
      }}
    >
      <DialogContent className={className ?? "sm:max-w-3xl"}>
        <DialogHeader>
          <DialogTitle>Historial</DialogTitle>
        </DialogHeader>

        <ScrumActivitiesTable data={activities} />
      </DialogContent>
    </Dialog>
  );
}
