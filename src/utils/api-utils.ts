import axios from 'axios';
import {PostLayoutInput} from '../models/post-layout-input.ts';
import {PostLayoutOption} from '../models/post-layout-option.ts';

export const calculatePostLayout = async (input: PostLayoutInput): Promise<PostLayoutOption[]> =>
  axios
    .post<PostLayoutOption[]>('http://localhost:8081/api/v1/post-layout', input)
    .then((response) => response.data);
