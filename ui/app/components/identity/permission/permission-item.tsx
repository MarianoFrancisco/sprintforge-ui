import { Info } from "lucide-react";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

interface PermissionItemProps {
    name: string;
    description?: string;
    checked: boolean;
    onCheckedChange: () => void;
}

export function PermissionItem({
    name,
    description,
    checked,
    onCheckedChange,
}: PermissionItemProps) {
    return (
        <div className="flex items-center gap-3">
            <Checkbox checked={checked} onCheckedChange={onCheckedChange} />

            <span className="text-sm font-medium">{name}</span>

            {description && (
                <Tooltip >
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 text-muted-foreground"
                            onClick={(e) => e.preventDefault()}
                        >
                            <Info className="size-4" />
                        </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                        {description}
                    </TooltipContent>

                </Tooltip>
            )}
        </div>
    );
}
