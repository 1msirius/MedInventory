import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Medicine } from './types'

interface AddMedicineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMedicine: (medicine: Omit<Medicine, 'id'>) => void
}

export function AddMedicineDialog({ open, onOpenChange, onAddMedicine }: AddMedicineDialogProps) {
  const [newMedicine, setNewMedicine] = useState<Omit<Medicine, 'id'>>({
    name: "",
    quantity: 0,
    expirationDate: "",
  })

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.quantity && newMedicine.expirationDate) {
      onAddMedicine(newMedicine)
      setNewMedicine({
        name: "",
        quantity: 0,
        expirationDate: "",
      })
    } else {
      alert("Please fill in all the fields.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Medicine</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Medicine Name</Label>
            <Input
              id="name"
              value={newMedicine.name}
              onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity (g)</Label>
            <Input
              id="quantity"
              type="number"
              value={newMedicine.quantity}
              onChange={(e) => setNewMedicine({ ...newMedicine, quantity: Number(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Input
              id="expirationDate"
              type="date"
              value={newMedicine.expirationDate}
              onChange={(e) => setNewMedicine({ ...newMedicine, expirationDate: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={handleAddMedicine} className="w-full">Add Medicine</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}