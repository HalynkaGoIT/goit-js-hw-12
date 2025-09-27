import axios from "axios";

const API_KEY = '52368753-eba0a00d68a5190bbbbc4e7af';
const BASE_URL = 'https://pixabay.com/api/';
export const PER_PAGE = 15;

export async function getImagesByQuery(query, page) {
    const params = {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: PER_PAGE,
    };

    const { data } = await axios.get(BASE_URL, { params });
    return data;
}