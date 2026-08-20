import { create } from "zustand";

import {
  getUpgradeRequests,
  approveUpgradeRequest,
  rejectUpgradeRequest,
} from "../api/upgradeRequestApi";


export const useUpgradeRequestStore = create((set)=>({

  requests: [],
  loading:false,


  fetchRequests: async()=>{

    try{

      set({
        loading:true
      });


      const response =
        await getUpgradeRequests();


      set({
        requests:response.data,
        loading:false
      });


    }catch(error){

      console.log(
        "FETCH REQUEST ERROR",
        error
      );

      set({
        requests:[],
        loading:false
      });

    }

  },


  approveRequest: async(id,remarks)=>{

    const response =
      await approveUpgradeRequest(
        id,
        remarks
      );


    return response;

  },


  rejectRequest: async(
    id,
    reason
  )=>{

    const response =
      await rejectUpgradeRequest(
        id,
        reason
      );


    return response;

  }


}));