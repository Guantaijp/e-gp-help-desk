import { Button } from "../../ui/button.tsx"
import { Checkbox } from "../../ui/checkbox"
import { Label } from "../../ui/label"

export default function AdvancedSection() {
    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-3">
                <Checkbox id="validate" defaultChecked />
                <Label htmlFor="validate" className="text-sm">
                    Validate shift times against business hours
                </Label>
            </div>

            <div>
                <Label className="text-base font-medium">Breaks</Label>
                <p className="text-sm text-gray-500 mt-1">No breaks added yet</p>
                <Button variant="outline" size="sm" className="mt-2">
                    Add Break
                </Button>
            </div>

            <div>
                <Label className="text-base font-medium">Required Skills</Label>
                <p className="text-sm text-gray-500 mt-1">No skills available. You can still create shifts without skills.</p>
            </div>
        </div>
    )
}
