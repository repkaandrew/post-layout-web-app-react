import axios from 'axios';
import {PostLayoutInput} from '../models/post-layout-input.ts';
import {PostLayoutOption} from '../models/post-layout-option.ts';


export const calculatePostLayout = async (input: PostLayoutInput): Promise<PostLayoutOption[]> =>{
  const url = `${import.meta.env.APP_API_URL}/post-layout`;

  return axios
    .post<PostLayoutOption[]>(url, input)
    .then((response) => response.data);
}
