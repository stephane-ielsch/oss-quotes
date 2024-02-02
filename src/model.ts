export interface IQuote {
    sentence: string;
    character: ICharacter;
}

export interface ICharacter {
    name: string;
    slug: string;
    quotes?: string[]
}



