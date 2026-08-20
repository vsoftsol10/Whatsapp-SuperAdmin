import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
    getTicketNotes,
    addTicketNote
} from "../../services/supportTicketNoteService";


export default function TicketNotesDrawer({
    open,
    onClose,
    ticketId
}) {


    const [notes, setNotes] = useState([]);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);



    const loadNotes = async () => {

        try {

            const data = await getTicketNotes(ticketId);

            setNotes(data.notes || []);

        } catch (error) {

            console.log(error);

        }

    };



    useEffect(() => {

        if (open) {
            loadNotes();
        }

    }, [open]);



    const handleAddNote = async () => {

        if (!note.trim()) return;


        try {

            setLoading(true);


            await addTicketNote(ticketId, {
                note,
                createdById: "admin",
                createdByName: "Super Admin"
            });


            setNote("");

            loadNotes();


        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };



    if (!open) return null;


    return (

        <div className="fixed inset-0 z-50">

            {/* overlay */}

            <div
                className="absolute inset-0 bg-black/30"
                onClick={onClose}
            />



            {/* drawer */}

            <div className="
absolute right-0 top-0
h-full w-[420px]
bg-white shadow-xl
p-6
animate-slide
">


                <div className="flex justify-between items-center border-b pb-4">

                    <h2 className="text-xl font-semibold">
                        Ticket Updates
                    </h2>


                    <button onClick={onClose}>
                        <X />
                    </button>

                </div>



                <div className="mt-5 space-y-4 h-[60%] overflow-y-auto">


                    {
                        notes.map((item) => (

                            <div
                                key={item.id}
                                className="rounded-xl border p-4"
                            >


                                <p className="text-sm text-gray-700">
                                    {item.note}
                                </p>


                                <p className="mt-2 text-xs text-gray-500">
                                    {item.createdByName}
                                </p>


                                <p className="text-xs text-gray-400">
                                    {new Date(item.createdAt).toLocaleString()}
                                </p>


                            </div>

                        ))
                    }


                </div>




                <textarea

                    value={note}

                    onChange={(e) => setNote(e.target.value)}

                    placeholder="Add progress update..."

                    className="
w-full rounded-xl border p-3
h-28 resize-none
"
                />



                <button

                    onClick={handleAddNote}

                    disabled={loading}

                    className="
mt-3 w-full rounded-xl
bg-[#25D366]
py-3 text-white font-semibold
"

                >

                    {
                        loading ? "Adding..." : "Add Update"
                    }

                </button>


            </div>

        </div>

    )

}