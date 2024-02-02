import fs, { writeFile } from 'fs';
import { IQuote } from './model.js';
import path from 'path';

const HISTORY_SIZE = 100;

export function getHistory(numberOfQuotes?: number): Promise<IQuote[]> {
    let path = "./dist/data/quotesHistory.json";
    let dir = './dist/data';

    if (!fs.existsSync(path)) {
        return Promise.resolve([]);
    }

    return new Promise((resolve, reject) => {
        return fs.readFile("./dist/data/quotesHistory.json", { encoding: 'utf8' }, (err, data) => {
            if (err) {
                return reject(err);
            }
            if (!data) {
                return resolve([])
            }
            let quotes = JSON.parse(data) as IQuote[];
            if (numberOfQuotes && numberOfQuotes < quotes.length) {
                quotes = quotes.slice(quotes.length - numberOfQuotes, quotes.length);
            }
            return resolve(quotes);
        });
    });
}



export function saveQuotesToHistory(quotes: IQuote[]) {
    let file = './dist/data/quotesHistory.json'

    if (!fs.existsSync(path.dirname(file))) {
        fs.mkdirSync(path.dirname(file), { recursive: true });
    }

    getHistory().then((historyQuotes) => {
        quotes = historyQuotes.concat(quotes);
        if (quotes.length > HISTORY_SIZE) {
            quotes = quotes.slice(quotes.length - HISTORY_SIZE, quotes.length);
        }
    })
        .catch((error) => {
            console.debug("Error getting history before saving it" + error);
        })
        .finally(() => {
            writeFile(file, JSON.stringify(quotes), (error) => {
                if (error) {
                    console.log('An error has occurred while saving history', error);
                    return;
                }
            });
        })
}
