export const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const fetcherMultiple = async ({urls}) => {
    const requests = urls.map(url => fetch(url));
    const responses = await Promise.all(requests);
    const jsons = responses.map(response => response.json());
    return Promise.all(jsons);
}