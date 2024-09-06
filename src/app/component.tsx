// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"

// interface Medicine {
//   id: number
//   name: string
//   quantity: number
//   expirationDate: string
// }

// const LOCAL_STORAGE_KEY = "medical_inventory_medicines"

// export default function Component() {
//   const [medicines, setMedicines] = useState<Medicine[]>([])
//   const [showAddMedicineModal, setShowAddMedicineModal] = useState(false)
//   const [newMedicine, setNewMedicine] = useState<Omit<Medicine, 'id'>>({
//     name: "",
//     quantity: 0,
//     expirationDate: "",
//   })
//   const [isSorted, setIsSorted] = useState(false)

//   useEffect(() => {
//     const loadMedicines = () => {
//       const storedMedicines = localStorage.getItem(LOCAL_STORAGE_KEY)
//       if (storedMedicines) {
//         try {
//           const parsedMedicines = JSON.parse(storedMedicines)
//           setMedicines(parsedMedicines)
//         } catch (error) {
//           console.error("Error parsing medicines from localStorage:", error)
//           setMedicines([])
//         }
//       }
//     }

//     loadMedicines()

//     window.addEventListener('storage', loadMedicines)

//     return () => {
//       window.removeEventListener('storage', loadMedicines)
//     }
//   }, [])

//   const saveMedicinesToLocalStorage = (updatedMedicines: Medicine[]) => {
//     try {
//       localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMedicines))
//     } catch (error) {
//       console.error("Error saving medicines to localStorage:", error)
//     }
//   }

//   const handleAddMedicine = () => {
//     if (newMedicine.name && newMedicine.quantity && newMedicine.expirationDate) {
//       const updatedMedicines = [
//         ...medicines,
//         {
//           id: Date.now(),
//           ...newMedicine,
//         },
//       ]
//       setMedicines(updatedMedicines)
//       saveMedicinesToLocalStorage(updatedMedicines)
//       setShowAddMedicineModal(false)
//       setNewMedicine({
//         name: "",
//         quantity: 0,
//         expirationDate: "",
//       })
//     } else {
//       alert("Please fill in all the fields.")
//     }
//   }

//   const handleDeleteMedicine = (id: number) => {
//     const updatedMedicines = medicines.filter((medicine) => medicine.id !== id)
//     setMedicines(updatedMedicines)
//     saveMedicinesToLocalStorage(updatedMedicines)
//   }

//   const upcomingExpiries = medicines.filter(
//     (medicine) => new Date(medicine.expirationDate) < new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
//   )

//   const sortedMedicines = [...upcomingExpiries].sort((a, b) => {
//     return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
//   })

//   const handleSortMedicines = () => {
//     setIsSorted(!isSorted)
//   }

//   const displayedMedicines = isSorted ? sortedMedicines : medicines

//   return (
//     <div className="flex flex-col h-screen bg-background">
//       <header className="bg-primary text-primary-foreground p-4 shadow-md flex justify-center">
//         <h1 className="text-2xl font-bold">Medical Inventory</h1>
//       </header>
//       <main className="flex-1 p-6 pb-12 flex justify-center">
//         <div className="w-full max-w-4xl">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold">Medicine Details</h2>
//             <div className="flex gap-4">
//               <Button onClick={handleSortMedicines}>{isSorted ? "Unsort" : "Sort by Expiration"}</Button>
//               <Button onClick={() => setShowAddMedicineModal(true)}>Add Medicine</Button>
//             </div>
//           </div>
//           <div className="border rounded-lg overflow-hidden">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="text-center">Medicine</TableHead>
//                   <TableHead className="text-center">Quantity (g)</TableHead>
//                   <TableHead className="text-center">Expiration Date</TableHead>
//                   <TableHead className="text-center">Delete</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {displayedMedicines.map((medicine) => (
//                   <TableRow
//                     key={medicine.id}
//                     className={
//                       new Date(medicine.expirationDate) < new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
//                         ? "text-red-500"
//                         : ""
//                     }
//                   >
//                     <TableCell className="text-center">{medicine.name}</TableCell>
//                     <TableCell className="text-center">{medicine.quantity} g</TableCell>
//                     <TableCell className="text-center">{medicine.expirationDate}</TableCell>
//                     <TableCell className="text-center">
//                       <Button variant="ghost" size="icon" onClick={() => handleDeleteMedicine(medicine.id)}>
//                         <Trash2Icon className="h-4 w-4" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       </main>
//       <Dialog open={showAddMedicineModal} onOpenChange={setShowAddMedicineModal}>
//         <DialogContent className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
//           <DialogHeader>
//             <DialogTitle>Add New Medicine</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="grid gap-2">
//               <Label htmlFor="name">Medicine Name</Label>
//               <Input
//                 id="name"
//                 value={newMedicine.name}
//                 onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="quantity">Quantity (g)</Label>
//               <Input
//                 id="quantity"
//                 type="number"
//                 value={newMedicine.quantity}
//                 onChange={(e) => setNewMedicine({ ...newMedicine, quantity: Number(e.target.value) })}
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="expirationDate">Expiration Date</Label>
//               <Input
//                 id="expirationDate"
//                 type="date"
//                 value={newMedicine.expirationDate}
//                 onChange={(e) => setNewMedicine({ ...newMedicine, expirationDate: e.target.value })}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button onClick={handleAddMedicine}>Add Medicine</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// function Trash2Icon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M3 6h18" />
//       <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//       <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//       <line x1="10" x2="10" y1="11" y2="17" />
//       <line x1="14" x2="14" y1="11" y2="17" />
//     </svg>
//   )
// }