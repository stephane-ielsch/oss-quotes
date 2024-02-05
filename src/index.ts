#!/usr/bin/env npx ts-node --esm

import { OptionValues, program } from "commander";
import {
    getRandomQuotes, getRandomQuoteFromCharacter
    , getQuotes, getAllCharacters
} from "./service.js";
import { getHistory, saveQuotesToHistory } from "./history-service.js";
import { IQuote, ICharacter } from "./model.js";
import chalk from "chalk";


program
    .command('quotes')
    .description('Display a random quote if use without options')
    .option('-n, --number <number>', 'specify the number of quotes to get')
    .option('-c, --character <name>', 'get a random quote from character or work as a filter if use with other options,'
        + 'Use nickanme you get from the command "characters"')
    .option('-k, --keyword <word>', 'get all quotes containing keyword or work as a filter if use with other options')
    .action((options) => {

        if (!isNumberOptionsPositive(options)) {
            return;
        }
        if (!options.character && !options.keyword) {
            handleRandomQuotesRequest(options);
        } else if (options.character) {
            handleRandomCharcterQuotesRequest(options);
        }
        else if (options.keyword && !options.character) {
            handleQuotesByKeyWordRequest(options)
        }
    });

program
    .command('history')
    .description('Display the last requests displayed in the programm')
    .option('-n, --number <int>', 'specify the number of quote to get')
    .action((options) => {
        if (!isNumberOptionsPositive(options)) {
            return;
        }
        displayHistory(options.number);

    });


program
    .command('characters')
    .description('Display all the caracters available')
    .action(() => {
        displayCharacters()
    });

program.parse(process.argv);



function handleRandomQuotesRequest(options: OptionValues) {
    getRandomQuotes(options.number).then((quotes) => {
        displayQuotes(quotes, options);
    });
}

function handleRandomCharcterQuotesRequest(options: OptionValues) {
    getRandomQuoteFromCharacter(options.character, options.number, options.keyword).then((quotes) => {
        displayQuotes(quotes, options);
    });
}

function handleQuotesByKeyWordRequest(options: OptionValues) {
    getQuotes(options.keyword, options.number, options.character).then((quotes) => {
        displayQuotes(quotes, options);
    });
}

function displayQuotes(quotes: IQuote[], options?: OptionValues) {
    if (quotes && quotes.length > 0) {
        displayQuotesByCharacter(quotes)
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
            quotes.forEach((quote: IQuote) => displayQuote(quote))
        }
    }).catch((error) => {
        console.log("Impossible to display history : " + error)
    })
}

function displayCharacters() {
    console.log(chalk.blue("Nickname"));

    getAllCharacters().then((characters) => {
        characters.forEach((character) => {
            displayCharacter(character);
        })
    })
}


function displayQuotesByCharacter(quotes: IQuote[]) {
    for (const [key, value] of sortQuotesByCharacters(quotes).entries()) {
        console.log(chalk.blue(key));
        value.forEach((sentence) => {
            console.log(sentence);
        })
        console.log('\n');
    }
}

function displayQuote(quote: IQuote) {
    console.log(chalk.blue(quote.character.slug) + ` : ${quote.sentence}`)
}

function displayCharacter(character: ICharacter) {
    console.log(chalk.blue(character.slug) + ` aka ${character.name}`);
}


function displayQuotesErrorMessage(options: OptionValues) {
    let errorMessage = "No quotes were found : "
    if (options.keyword) {
        errorMessage += `\nWith the key word "${options.keyword}"`
    }

    if (options.character) {
        errorMessage += `\nFor character "${options.character}"`
    }
    console.log(errorMessage);
}



function isNumberOptionsPositive(options: OptionValues): boolean {
    if (options.number && options.number <= 0) {
        console.log("-n option value should be superior to 0");
        return false;
    }
    return true;
}



function sortQuotesByCharacters(quotes: IQuote[]): Map<String, String[]> {
    let characters = new Map();

    quotes.forEach((quote: IQuote) => {
        if (characters.get(quote.character.name)) {
            characters.get(quote.character.name).push(quote.sentence)
        } else {
            characters.set(quote.character.name, [quote.sentence])
        }
    });
    return characters;
}

