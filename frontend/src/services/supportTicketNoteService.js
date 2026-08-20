import axios from "../api/axios";

export const getTicketNotes = async (ticketId) => {
  const response = await axios.get(
    `/support-ticket-notes/${ticketId}`
  );

  return response.data;
};

export const addTicketNote = async (ticketId, note) => {
  const response = await axios.post(
    `/support-ticket-notes/${ticketId}`,
    {
      note
    }
  );

  return response.data;
};