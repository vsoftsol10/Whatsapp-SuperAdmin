import {
Eye,
Pencil,
Trash2
} from "lucide-react";


export default function SubscriptionPlanTable({
plans=[],
onView,
onEdit,
onDelete
}){


if(!plans.length)

return(

<div className="rounded-2xl border bg-white p-12 text-center shadow-sm">

<h3 className="text-xl font-bold text-gray-900">
No Subscription Plans
</h3>

<p className="mt-2 text-gray-500">
Create your first WhatsApp CRM plan.
</p>

</div>

);



return(

<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">


<div className="overflow-x-auto">


<table className="w-full min-w-[1100px]">


<thead className="bg-gray-50">


<tr>

{
[
"Plan",
"Price",
"Duration",
"Limits",
"Trial",
"Status",
"Action"
].map(head=>(

<th
key={head}
className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-500"
>

{head}

</th>

))

}


</tr>


</thead>



<tbody>


{
plans.map(plan=>(


<tr
key={plan.id}
className="border-t hover:bg-gray-50 transition"
>


<td className="px-6 py-5">


<h3 className="font-bold text-gray-900">
{plan.planName}
</h3>


<p className="mt-1 text-xs text-gray-500">
{plan.features?.length || 0} Features
</p>


</td>



<td className="px-6 font-bold text-gray-900">

₹{Number(plan.price).toLocaleString("en-IN")}

</td>



<td className="px-6 text-gray-600">

{plan.durationDays} Days

</td>



<td className="px-6">


<div className="flex flex-wrap gap-2">


<span className="rounded-lg bg-blue-50 px-3 py-1 text-xs text-blue-600">
Users {plan.maxUsers}
</span>


<span className="rounded-lg bg-purple-50 px-3 py-1 text-xs text-purple-600">
Contacts {plan.maxContacts}
</span>


<span className="rounded-lg bg-orange-50 px-3 py-1 text-xs text-orange-600">
Bots {plan.maxBots}
</span>


</div>


</td>



<td className="px-6">


{
plan.isTrial ?

<span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
Free Trial
</span>

:

<span className="text-gray-400">
No
</span>

}


</td>



<td className="px-6">


<span
className={`rounded-full px-3 py-1 text-xs font-bold ${
plan.status==="ACTIVE"
?
"bg-green-100 text-green-700"
:
"bg-red-100 text-red-700"
}`}
>

{plan.status}

</span>


</td>




<td className="px-6">


<div className="flex gap-2">


<button
onClick={()=>onView(plan)}
className="rounded-lg p-2 hover:bg-green-50 hover:text-green-600"
>

<Eye size={18}/>

</button>



<button
onClick={()=>onEdit(plan)}
className="rounded-lg p-2 hover:bg-blue-50 hover:text-blue-600"
>

<Pencil size={18}/>

</button>



<button
onClick={()=>onDelete(plan)}
className="rounded-lg p-2 hover:bg-red-50 hover:text-red-600"
>

<Trash2 size={18}/>

</button>


</div>


</td>



</tr>


))

}


</tbody>


</table>


</div>


</div>


)

}