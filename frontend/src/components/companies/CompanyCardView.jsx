// import { MoreVertical, Building2, User, Mail, Phone, Calendar } from "lucide-react";
// import CompanyActionMenu from "./CompanyActionMenu";

// export default function CompanyCardView({
//   companies,
//   openMenu,
//   setOpenMenu,
//   onView,
//   onEdit,
//   onStatus,
//   onDelete
// }) {

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "ACTIVE":
//         return "bg-green-100 text-green-700 border-green-200";
//       case "TRIAL":
//         return "bg-yellow-100 text-yellow-700 border-yellow-200";
//       case "INACTIVE":
//         return "bg-gray-100 text-gray-700 border-gray-200";
//       case "EXPIRED":
//         return "bg-red-100 text-red-700 border-red-200";
//       default:
//         return "bg-gray-100 text-gray-700 border-gray-200";
//     }
//   };

//   const getPlanColor = (plan) => {
//     switch (plan) {
//       case "Starter":
//         return "bg-blue-100 text-blue-700 border-blue-200";
//       case "Professional":
//         return "bg-green-100 text-green-700 border-green-200";
//       case "Enterprise":
//         return "bg-purple-100 text-purple-700 border-purple-200";
//       default:
//         return "bg-gray-100 text-gray-700 border-gray-200";
//     }
//   };

//   if (!companies.length) {
//     return (
//       <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
//         <Building2 size={60} className="mx-auto text-gray-300" />
//         <h2 className="mt-5 text-xl font-semibold text-gray-800">No Companies Found</h2>
//         <p className="mt-2 text-gray-500">Create your first company to get started.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
//       {companies.map((company) => (
//         <div key={company.companyId} className="group relative overflow-visible rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-2xl">

//           <div className="absolute right-5 top-5">
//             <button onClick={() => setOpenMenu(openMenu === company.companyId ? null : company.companyId)} className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100">
//               <MoreVertical size={20} />
//             </button>

//             {openMenu === company.companyId && (
//               <CompanyActionMenu
//                 company={company}
//                 onView={onView}
//                 onEdit={onEdit}
//                 onStatus={onStatus}
//                 onDelete={onDelete}
//                 onClose={() => setOpenMenu(null)}
//               />
//             )}
//           </div>

//           <div className="flex items-center gap-4">

//             <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-2xl font-bold text-white shadow-lg">
//               {company.companyName?.charAt(0).toUpperCase()}
//             </div>

//             <div className="flex-1">

//               <h2 className="text-lg font-bold text-gray-900">
//                 {company.companyName}
//               </h2>

//               <span className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
//                 {company.companyId}
//               </span>

//             </div>

//           </div>

//           <div className="my-6 border-t border-dashed"></div>

//           <div className="grid grid-cols-2 gap-x-5 gap-y-5">

//             <div className="flex items-center gap-3">
//               <div className="rounded-lg bg-green-50 p-2 text-green-600">
//                 <User size={16} />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Owner</p>
//                 <p className="font-medium text-gray-800">{company.ownerName}</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
//                 <Phone size={16} />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Phone</p>
//                 <p className="font-medium text-gray-800">{company.phone}</p>
//               </div>
//             </div>

//             <div className="col-span-2 flex items-center gap-3">
//               <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
//                 <Mail size={16} />
//               </div>
//               <div className="min-w-0">
//                 <p className="text-xs text-gray-500">Email</p>
//                 <p className="truncate font-medium text-gray-800">
//                   {company.email}
//                 </p>
//               </div>
//             </div>

//             <div className="col-span-2 flex items-center gap-3">
//               <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
//                 <Calendar size={16} />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500">Expiry Date</p>
//                 <p className="font-medium text-gray-800">
//                   {new Date(company.expiryDate).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>

//           </div>

//           <div className="mt-6 flex items-center justify-between border-t pt-5">

//             <span className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${getPlanColor(company.plan)}`}>
//               {company.plan}
//             </span>

//             <span className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${getStatusColor(company.status)}`}>
//               {company.status}
//             </span>

//           </div>

//         </div>
//       ))}
//     </div>
//   );
// }

import {
  MoreVertical,
  User,
  Mail,
  Phone,
  Calendar,
  Building2
} from "lucide-react";

import CompanyActionMenu from "./CompanyActionMenu";


export default function CompanyCardView({
  companies,
  openMenu,
  setOpenMenu,
  onView,
  onEdit,
  onStatus,
  onDelete
}) {



const getStatusColor=(status)=>{

switch(status){

case "ACTIVE":
return "bg-green-100 text-green-700";

case "TRIAL":
return "bg-yellow-100 text-yellow-700";

case "INACTIVE":
return "bg-gray-100 text-gray-700";

case "EXPIRED":
return "bg-red-100 text-red-700";

default:
return "bg-gray-100 text-gray-600";

}

};



const getPlanColor=(plan)=>{

switch(plan){

case "Starter":
return "bg-blue-100 text-blue-700";


case "Professional":
return "bg-green-100 text-green-700";


case "Enterprise":
return "bg-purple-100 text-purple-700";


default:
return "bg-gray-100 text-gray-700";

}

};






if(!companies.length){

return(

<div className="
col-span-full
text-center
py-16
">

<Building2
size={40}
className="mx-auto text-gray-400"
/>


<h3 className="
mt-4
font-semibold
text-gray-700
">

No Companies Found

</h3>


<p className="
text-sm
text-gray-500
mt-1
">

Create your first company

</p>


</div>

);

}






return (

<div className="
grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
xl:grid-cols-4
gap-5
">


{

companies.map((company)=>(


<div

key={company.companyId}

className="
relative
bg-white
rounded-xl
border
border-gray-200
p-4
hover:shadow-md
transition
"

>





{/* Action */}

<div className="
absolute
right-3
top-3
">


<button

onClick={()=>setOpenMenu(
openMenu===company.companyId
?
null
:
company.companyId
)}

className="
p-1.5
rounded-lg
hover:bg-gray-100
text-gray-500
"

>

<MoreVertical size={18}/>

</button>





{

openMenu===company.companyId &&

(

<CompanyActionMenu

company={company}

onView={onView}

onEdit={onEdit}

onStatus={onStatus}

onDelete={onDelete}

onClose={()=>setOpenMenu(null)}

/>

)

}



</div>








{/* Profile Header */}

<div className="
flex
items-center
gap-3
">


{/* Round Profile */}


<div

className="
h-12
w-12
rounded-full
bg-[#25D366]
flex
items-center
justify-center
text-white
font-bold
text-lg
shadow-sm
"

>

{

company.companyName
?.charAt(0)
.toUpperCase()

}


</div>





<div className="min-w-0">


<h3

className="
font-semibold
text-gray-900
truncate
"

>

{company.companyName}

</h3>



<p className="
text-xs
text-gray-500
mt-1
">

{company.companyId}

</p>


</div>



</div>









<div className="
my-4
border-t
border-gray-200
"/>









{/* Details */}


<div className="
space-y-3
">





<div className="
flex
items-center
gap-3
">


<User
size={15}
className="text-green-600"
/>


<div className="text-xs">


<p className="text-gray-400">
Owner
</p>


<p className="font-medium text-gray-700">
{company.ownerName}
</p>


</div>


</div>









<div className="
flex
items-center
gap-3
">


<Phone

size={15}

className="text-blue-600"

/>


<div className="text-xs">


<p className="text-gray-400">
Phone
</p>


<p className="font-medium text-gray-700">
{company.phone}
</p>


</div>


</div>









<div className="
flex
items-center
gap-3
">


<Mail

size={15}

className="text-orange-600"

/>


<div className="
text-xs
truncate
">


<p className="text-gray-400">
Email
</p>


<p className="
font-medium
text-gray-700
truncate
max-w-[180px]
">

{company.email}

</p>


</div>


</div>









<div className="
flex
items-center
gap-3
">


<Calendar

size={15}

className="text-purple-600"

/>



<div className="text-xs">


<p className="text-gray-400">
Expiry
</p>


<p className="font-medium text-gray-700">

{
company.expiryDate
?
new Date(company.expiryDate)
.toLocaleDateString()
:
"-"
}

</p>


</div>


</div>




</div>










{/* Bottom */}

<div className="
mt-4
flex
justify-between
items-center
">


<span

className={`
px-3
py-1
rounded-full
text-xs
font-semibold
${getPlanColor(company.plan)}
`}

>

{company.plan}

</span>





<span

className={`
px-3
py-1
rounded-full
text-xs
font-semibold
${getStatusColor(company.status)}
`}

>

{company.status}

</span>



</div>





</div>



))

}



</div>

);

}