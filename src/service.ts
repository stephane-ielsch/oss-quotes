
import axios, { AxiosError } from 'axios';
import type { ICharacter, IQuote } from './model';
import { shuffle, toArray } from './utils.js';
import { config } from './config.js';


const baseUrl = config.apiUrl;


export function getRandomQuotes(numberOfQuote?: number): Promise<IQuote[]> {
    let url = `${baseUrl}/random`;
    if (numberOfQuote) {
        url += `/${numberOfQuote}`
    }
    return axios.get<IQuote>(url)
        .then(function (response) {
            return toArray(response.data);
        })
        .catch(function (error: AxiosError) {
            console.error(JSON.stringify(error.message));
            return [];
        });
}



export function getRandomQuoteFromCharacter(character: string, numberOfQuotes?: number, keyword?: string): Promise<IQuote[]> {

    let url = `${baseUrl}/author/${character.toLocaleLowerCase()}`;
    if (numberOfQuotes) {
        url = `${url}/${numberOfQuotes}`;
    }

    return axios.get<IQuote[]>(url)
        .then(function (response) {
            if (!response.data) {
                return [];
            }
            const quoteArray = toArray(response.data);
            if (keyword) {
                return quoteArray.filter((quote: IQuote) => {
                    return quote.sentence.split(" ").includes(keyword);
                });
            } else {
                return quoteArray;
            }
        })
        .catch(function (error: AxiosError) {
            console.error(url);
            console.error(JSON.stringify(error.message));
            return [];
        });
}


export function getAllCharacters(): Promise<ICharacter[]> {
    const url = baseUrl + '/characters';
    return axios.get<ICharacter[]>(url)
        .then(function (response) {
            return toArray(response.data);
        })
        .catch(function (error: AxiosError) {
            console.error(JSON.stringify(error.message));
            return [];
        });
}



export function getAllQuotes(): Promise<IQuote[]> {
    const quotes: IQuote[] = [];
    return getAllCharacters().then((characters: ICharacter[]) => {
        characters.forEach((character: ICharacter) => {
            if (character.quotes) {
                character.quotes.forEach((quote) => {
                    delete character.quotes;
                    quotes.push({
                        "sentence": quote,
                        "character": character
                    })
                })
            }

        })
        return quotes;
    })
}



export function getQuotes(keyword?: string, numberOfQuote?: number, character?: string): Promise<IQuote[]> {

    return getAllQuotes().then((quotes: IQuote[]) => {

        if (character) {
            quotes = quotes.filter((quote: IQuote) => {
                return quote.character.slug == character || quote.character.name == character;
            });
        }

        if (keyword) {
            quotes = quotes.filter((quote: IQuote) => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'i');
                return regex.test(quote.sentence);
            }
            );
        }

        if (numberOfQuote && numberOfQuote < quotes.length) {
            shuffle(quotes);
            return quotes.slice(0, numberOfQuote);
        }

        return quotes;
    })
}




