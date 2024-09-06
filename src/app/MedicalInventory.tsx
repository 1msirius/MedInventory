"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { AddMedicineDialog } from "./AddMedicineDialog";
import { Medicine } from "./types";
import { Trash2Icon } from "lucide-react";

const LOCAL_STORAGE_KEY = "medical_inventory_medicines";

export function MedicalInventory() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    const loadMedicines = () => {
      const storedMedicines = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedMedicines) {
        try {
          const parsedMedicines = JSON.parse(storedMedicines);
          setMedicines(parsedMedicines);
        } catch (error) {
          console.error("Error parsing medicines from localStorage:", error);
          setMedicines([]);
        }
      }
    };

    loadMedicines();

    window.addEventListener("storage", loadMedicines);

    return () => {
      window.removeEventListener("storage", loadMedicines);
    };
  }, []);

  const saveMedicinesToLocalStorage = (updatedMedicines: Medicine[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMedicines));
    } catch (error) {
      console.error("Error saving medicines to localStorage:", error);
    }
  };

  const handleAddMedicine = (newMedicine: Omit<Medicine, "id">) => {
    const updatedMedicines = [
      ...medicines,
      {
        id: Date.now(),
        ...newMedicine,
      },
    ];
    setMedicines(updatedMedicines);
    saveMedicinesToLocalStorage(updatedMedicines);
    setShowAddMedicineModal(false);
  };

  const handleDeleteMedicine = (id: number) => {
    const updatedMedicines = medicines.filter((medicine) => medicine.id !== id);
    setMedicines(updatedMedicines);
    saveMedicinesToLocalStorage(updatedMedicines);
  };

  const upcomingExpiries = medicines.filter(
    (medicine) =>
      new Date(medicine.expirationDate) <
      new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
  );

  const sortedMedicines = [...upcomingExpiries].sort((a, b) => {
    return (
      new Date(a.expirationDate).getTime() -
      new Date(b.expirationDate).getTime()
    );
  });

  const handleSortMedicines = () => {
    setIsSorted(!isSorted);
  };

  const displayedMedicines = isSorted ? sortedMedicines : medicines;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className=" p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Medical Inventory</h1>
      </header>
      <main className="flex-1 p-4 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Medicine Details</h2>
            <div className="flex gap-4">
              <Button
                onClick={handleSortMedicines}
                className="whitespace-nowrap"
              >
                {isSorted ? "Unsort" : "Sort by Expiration"}
              </Button>
              <Button onClick={() => setShowAddMedicineModal(true)}>
                Add Medicine
              </Button>
            </div>
          </div>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center font-semibold">
                    Medicine
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Quantity (g)
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Expiration Date
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Delete
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedMedicines.map((medicine) => (
                  <TableRow
                    key={medicine.id}
                    className={
                      new Date(medicine.expirationDate) <
                      new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
                        ? "text-red-500"
                        : ""
                    }
                  >
                    <TableCell className="text-center">
                      {medicine.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {medicine.quantity} g
                    </TableCell>
                    <TableCell className="text-center">
                      {medicine.expirationDate}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMedicine(medicine.id)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <AddMedicineDialog
        open={showAddMedicineModal}
        onOpenChange={setShowAddMedicineModal}
        onAddMedicine={handleAddMedicine}
      />
    </div>
  );
}
