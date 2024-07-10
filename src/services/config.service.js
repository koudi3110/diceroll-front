import { adminURL } from "../utils/baseUrl";
import api from "./api";

const getConfigs = async (id) => {
  return api.get(`${adminURL}configurations/player/${id}`).then((response) => {
    console.log(response.data);
    return response.data;
  });
};

const createUpdateConfigs = async (data) => {
  return api.post(`${adminURL}configurations`, data).then((response) => {
    return response.data;
  });
};

const configService = {
  getConfigs,
  createUpdateConfigs,
};
export default configService;
