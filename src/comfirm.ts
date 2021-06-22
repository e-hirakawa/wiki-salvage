import readline from "readline";

export default class Comfirm {
    public static show(message: string): Promise<boolean> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise(resolve => {
            rl.question(`${message}: (Y/N)`, results => {
                resolve(/y/i.test(results));
            });
        });
    }
}