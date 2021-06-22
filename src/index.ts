import * as csvWriter from "csv-writer";
import Comfirm from "./comfirm";
import { sleep } from "./utils";
import Wiki, { WikiDocument } from "./wiki";

main();

async function main() {
    const agreed = await Comfirm.show("wikiからの収集を開始しますか？");
    if (!agreed) {
        return;
    }

    const writer = csvWriter.createObjectCsvWriter({
        path: `./out/out_${new Date().getTime()}.csv`,
        header: [
            { id: "id", title: "記事ID" },
            { id: "title", title: "記事タイトル" },
            { id: "format", title: "記事フォーマット" },
            { id: "model", title: "記事モデル" },
            { id: "text0", title: "記事本文0" },
            { id: "text1", title: "記事本文1" },
            { id: "text2", title: "記事本文2" },
            { id: "text3", title: "記事本文3" },
            { id: "text4", title: "記事本文4" },
            { id: "text5", title: "記事本文5" },
            { id: "text6", title: "記事本文6" },
            { id: "text7", title: "記事本文7" },
            { id: "text8", title: "記事本文8" },
            { id: "text9", title: "記事本文9" }
        ]
    });

    const wiki = new Wiki();
    try {
        const docs: WikiDocument[] = [];
        const list = await wiki.next();
        for (const item of list) {
            const doc = await wiki.document(item.id);
            if (doc) {
                docs.push(doc);
            }
            await sleep(1000);
        }
        await writer.writeRecords(docs);
    } catch (e) {
        console.error('取得失敗', e)
    }
    console.log("🦖 DONE 🦖");
}
