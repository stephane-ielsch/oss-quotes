# OSS-117 Quotes
CLI program to display OSS-117 quotes

### Prerequisite

Make sure Node.js is installed 
```sh
node -v
```
If it's not check [how to install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)


Make sure tsc is installed 
```sh
tsc -v
```

If it's not you can install it with the command
```sh
npm install -D typescript
```

### Compile and run

Build the project 
```bash
npm install
npm run build
```

To launch the program, run the command 
```bash
 npm run start <command> -- [options]
 ```

##  Commands 
### `quotes`

- **Description:** Display a random quote or a specified number of quotes.
- **Options:**
  - `-n, --number <number>`: Specify the number of quotes to retrieve.
  - `-c, --character <name>`: Get a random quote from a specific character or use it as a filter in combination with other options. Use the nickname obtained from the "characters" command.
  - `-k, --keyword <word>`: Retrieve all quotes containing a specific keyword or use it as a filter in combination with other options.
- **Example:**
  ```sh
  npm run start quotes -- -c hubert
  ```

### `characters`

- **Description:** Display a list of all available characters.
- **Example:**
  ```sh
  npm run start characters
  ```

### `history`

- **Description:** Display the last requests made in the program, including quotes and characters.
- **Options:**
  - `-n, --number <int>`: Specify the number of recent requests to display.
- **Example:**
  ```sh
  npm run start history -- -n 5
  ```
