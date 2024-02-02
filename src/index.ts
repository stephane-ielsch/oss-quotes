#!/usr/bin/env npx ts-node --esm

import { OptionValues, program } from "commander";
import { ICharacter, IQuote } from "./model.js";
import {
    getRandomQuotes, getRandomQuoteFromCharacter
    , getQuotes, getAllCharacters
} from "./service.js";
import { getHistory, saveQuotesToHistory } from "./file-service.js";


program
    .command('quotes')
    .option('-n, --number <int>', 'specify the number of quote to get')
    .option('-c, --character <name>', 'get a random quote from character or specify the number if used with -n')
    .option('-k, --keyword <word>', 'filter quote by a keyword')
    .action((options) => {

        if (!isNumberOptionsIsPositive(options)) {
            return;
        }
        if (!options.character && !options.keyword) {
            displayRandomQuote(options.number);
        } else if (options.character) {
            displayRandomCharcterQuote(options);
        }
        else if (options.keyword && !options.character) {
            displayQuoteByKeyWord(options)
        }
    });

program
    .command('history')
    .option('-n, --number <int>', 'specify the number of quote to get')
    .action((options) => {
        if (!isNumberOptionsIsPositive(options)) {
            return
        }
        displayHistory(options.number);

    });


program
    .command('characters')
    .action((options) => {
        displayCharacters()
    });


program.parse(process.argv);
const options = program.opts();
if (options.debug) console.log(options);


function displayRandomQuote(numberOfQuotes?: number) {
    getRandomQuotes(numberOfQuotes).then((quotes) => {
        displayQuotes(quotes, options);
    });
}

function displayRandomCharcterQuote(options: OptionValues) {
    getRandomQuoteFromCharacter(options.character, options.number, options.keyword).then((quotes) => {
        displayQuotes(quotes, options);
    });
}


function displayQuoteByKeyWord(options: OptionValues) {
    getQuotes(options.keyword, options.number, options.character).then((quotes) => {
        displayQuotes(quotes, options);
    });
}


function displayQuotes(quotes: IQuote[], options?: OptionValues) {
    console.log(quotes);
    if (quotes && quotes.length > 0) {
        quotes.forEach((quote) => { displayQuote(quote) });
        saveQuotesToHistory(quotes);
    } else {
        displayQuotesErrorMessage(options);
    }
}

function displayHistory(numberOfQuotes?: number) {
    getHistory(numberOfQuotes).then((quotes) => {
        if (!quotes || quotes.length == 0) {
            console.log("There is no history")
        } else {
            displayQuotes(quotes)
        }
    }).catch((error) => {
        console.log("Impossible to display history : " + error)
    })
}

function displayCharacters() {
    getAllCharacters().then((characters) => {
        characters.forEach((character) => {
            displayCharacter(character);
        })
    })
}


function displayQuote(quote: IQuote) {
    console.log(`${quote.character.slug} says ${quote.sentence}`)
}


function displayCharacter(character: ICharacter) {
    console.log(`${character.slug} aka ${character.name}`)
}


function displayQuotesErrorMessage(options: OptionValues) {
    console.log(options);
    let errorMessage = "No quotes were found : "
    if (options.keyword) {
        errorMessage += "\n With the key word " + options.keyword
    }

    if (options.character) {
        errorMessage += "\n For character  " + options.character
    }
    console.log(errorMessage);
}



function isNumberOptionsIsPositive(options: OptionValues): boolean {
    if (options.number && options.number <= 0) {
        console.log("-n option value should be superior to 0");
        return false;
    }
    return true;
}

