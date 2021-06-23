import axios from "axios";

const BASE_URL = `https://ja.wikipedia.org/w/api.php`;


const NEXT_PARAMS = {
    format: "json",
    action: "query",
    list: "random",
    rnnamespace: "0"
};
const TEXT_PARAMS = {
    format: "json",
    action: "query",
    prop: "revisions",
    rvprop: "content"
};

const DOCUMENT_STATUS = ["draft", "review", "rejected", "accepted", "publish", "removed"];

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
    date: string;
    status: string;
};

export default class Wiki {

    public async next(limit: number = 10): Promise<WikiRandamQueryData[]> {
        const params = { ...NEXT_PARAMS, rnlimit: limit };
        const response = await axios.get(BASE_URL, { params });
        if ("query" in response.data) {
            if ("random" in response.data.query) {
                return response.data.query.random as WikiRandamQueryData[];
            }
        }
        return [];
    }

    public async document(ids: string[]): Promise<WikiDocument[]> {
        const params = { ...TEXT_PARAMS, pageids: ids.join("|") };
        const response = await axios.get(BASE_URL, { params });
        if ("query" in response.data) {
            if ("pages" in response.data.query) {
                const pages = response.data.query.pages;
                const docs = [];
                for (let id of ids) {
                    if (id in pages) {
                        const page = pages[id] || {};
                        const revs = page?.revisions || [];
                        const rev = revs.length ? revs[0] : {};
                        const texts = (rev["*"] || "").split("\n\n");
                        const now = new Date();
                        docs.push({
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
                            text9: texts.length > 9 ? texts.splice(9).join("\n\n") : "",
                            date: this.toStringFromDate(now),
                            status: this.status(now.getTime())
                        } as WikiDocument);
                    }
                }
                return docs;
            }
        }
        return [];
    }

    private toStringFromDate(date: Date): string {
        const dateArray = [
            date.getFullYear(),
            ('0' + (date.getMonth() + 1)).slice(-2),
            ('0' + date.getDate()).slice(-2)
        ];
        const timeArray = [
            ('0' + date.getHours()).slice(-2),
            ('0' + date.getMinutes()).slice(-2),
            ('0' + date.getSeconds()).slice(-2)
        ];
        return `${dateArray.join("/")} ${timeArray.join(":")}`;
    }

    private status(n: number): string {
        return DOCUMENT_STATUS[n % DOCUMENT_STATUS.length];
    }
}
