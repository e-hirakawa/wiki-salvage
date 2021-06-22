import axios from "axios";

const BASE_URL = `https://ja.wikipedia.org/w/api.php`;
const NEXT_PARAMS = {
    format: "json",
    action: "query",
    list: "random",
    rnnamespace: "0",
    rnlimit: "10"
};
const TEXT_PARAMS = {
    format: "json",
    action: "query",
    prop: "revisions",
    rvprop: "content"
};

export type WikiRandamQueryData = {
    id: string;
    ns: number;
    title: string;
};
export type WikiDocument = {
    id: string;
    title: string;
    format: string;
    model: string;
    text0: string;
    text1: string;
    text2: string;
    text3: string;
    text4: string;
    text5: string;
    text6: string;
    text7: string;
    text8: string;
    text9: string;
};

export default class Wiki {

    public async next(): Promise<WikiRandamQueryData[]> {
        const response = await axios.get(BASE_URL, { params: NEXT_PARAMS });
        if ("query" in response.data) {
            if ("random" in response.data.query) {
                return response.data.query.random as WikiRandamQueryData[];
            }
        }
        return [];
    }

    public async document(id: string): Promise<WikiDocument | null> {
        const params = { ...TEXT_PARAMS, pageids: id };
        const response = await axios.get(BASE_URL, { params });
        if ("query" in response.data) {
            if ("pages" in response.data.query) {
                if (id in response.data.query.pages) {
                    const page = response.data.query.pages[id] || {};
                    const revs = page?.revisions || [];
                    const rev = revs.length ? revs[0] : {};
                    const texts = (rev["*"] || "").split("\n\n");
                    return {
                        id,
                        title: page?.title || "",
                        format: rev?.contentformat || "",
                        model: rev?.contentmodel || "",
                        text0: texts.length > 0 ? texts[0] : "",
                        text1: texts.length > 1 ? texts[1] : "",
                        text2: texts.length > 2 ? texts[2] : "",
                        text3: texts.length > 3 ? texts[3] : "",
                        text4: texts.length > 4 ? texts[4] : "",
                        text5: texts.length > 5 ? texts[5] : "",
                        text6: texts.length > 6 ? texts[6] : "",
                        text7: texts.length > 7 ? texts[7] : "",
                        text8: texts.length > 8 ? texts[8] : "",
                        text9: texts.length > 9 ? texts.splice(9).join("\n\n") : ""
                    } as WikiDocument;
                }
            }
        }
        return null;
    }
}
