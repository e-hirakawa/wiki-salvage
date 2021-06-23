import * as csvWriter from "csv-writer";
import Comfirm from "./comfirm";
import { sleep } from "./utils";
import Wiki from "./wiki";

main();

async function salvage(fileNumber: number, recordCount: number) {
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
            { id: "text9", title: "記事本文9" },
            { id: "date", title: "作成日時" },
            { id: "status", title: "ステータス" },
        ]
    });

    const wiki = new Wiki();
    try {
        const max = Math.ceil(recordCount / 10);
        for (let count = 0; count < max; count++) {
            console.log(`--- progress${fileNumber} (${count}/${max}) ---`);
            const list = await wiki.next(10);
            const ids = list.map(item => item.id);
            const docs = await wiki.document(ids);
            await writer.writeRecords(docs);
            await sleep(3000);
        }
    } catch (e) {
        console.error('取得失敗', e)
    }
}

async function main() {
    const agreed = await Comfirm.show("wikiからの収集を開始しますか？");
    if (!agreed) {
        return;
    }
    const docCount = 1000;
    const fileCount = 300;
    for (let count = 0; count < fileCount; count++) {
        await salvage(count, docCount);
    }

    console.log("🦖 DONE 🦖");
}
