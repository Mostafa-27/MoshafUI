import axios from "axios";

const BASE_URL = "https://moshaf-woad.vercel.app/api";

export const quranApi = {
  getPage: async (pageNumber: number) => {
    const response = await axios.get(`${BASE_URL}/ayat/page/${pageNumber}`);
    return response.data;
  },
  getPageNumberByAya: async (pageNumber: number, ayaNumber: number) => {
    const response = await axios.get(
      `${BASE_URL}/ayat/getpage/${pageNumber}/aya/${ayaNumber}`
    );

    return response.data;
  },
};
