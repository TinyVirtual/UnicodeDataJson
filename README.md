# Full Unicode Data JSON

This is a _simple_ json database for Unicode Character Data, optimal for easy access and fast loading, including web applications

You can load it with any programming language[^*]

​​ $${ \color{#8D8D8D} \tiny \textsf{fyi, the original xml have 200mb}}$$

It currently features:
- Latest Unicode (17.0)
- Separate Unicode Data Blocks
- Block Names
- Character Names
- Extra Data
- Browser version
- Font variants
- Unicode release
- Name Aliases

TODO:
- Add extra data
- ~~Add node package~~ (not anymore)

Download the files [here](https://github.com/zote-altf4/unicode-data-json/releases/tag/Release)

## Structure: 
```js
[
    {
        "dataType": "block",
        "min": "0000",
        "max": "007F",
        "name": " Basic Latin",
        "characters": [
            {
                "code": "0000",
                "name": "<control>",
                "category": "Cc",
                "char": "\u0000",
                "data": "0000\t<control>\n\t= NULL"
            }
           //...
        ]
    },
    //...
]
```

## Accessing:
```js
// Importing:
let jsonData = JSON.parse(fs.readFileSync("FullRawUnicode.json")) // For Node

// Example to access letter (in the crudest way)
jsonData[0].characters[0x61]
 
// Example to iterate to find character:

function findUDataFromCode(code){
    for(let block of jsonData){
        let range = [parseInt(block.min,16),parseInt(block.max,16)]
        if(code >= range[0] && code <= range[1]){
            // quick path
            let data = block.characters[(code-range[0])]
            if(data && parseInt(data.code,16) == code){
                return data
            } else {
                // painfull path
                for(let char of block.characters){
                    if(char && parseInt(char.code,16) == code){
                        return char
                    }
                }
            }
        }
    }
}

// DO NOT USE charCodeAt(0)!!! USE codePointAt(0)!!!!
// Characters with code point greater than 0xFFFF are 2 bytes, and charCodeAt(0) use byte index,
// while codePointAt(0) uses the string index
let code = "🙄".codePointAt(0)
let uData = findUDataFromCode(code)

if(!uData){
    console.warn("Failed to find character of code "+code+"!")
} else {
    console.log("Found data for character of code "+code+": \n"+JSON.stringify(uData))
// Found data for character of code 128580: 
// {"code":"1F644","name":"FACE WITH ROLLING EYES","category":"So","char":"🙄","data":"1F644\tFACE WITH ROLLING EYES"}
}

```
## Browser version: $${ \color{gold} \tiny \textsf{ᴺᴱᵂꜝ}}$$
```html
    <!-- At the <head> of your page -->
    <script src="https://raw.githubusercontent.com/zote-altf4/unicode-data-json/refs/heads/main/unicode-data-browser.js"></script>
```
```js
    // in your code:
    let UDBSuccess = await unicodeDB.load('https://raw.githubusercontent.com/zote-altf4/unicode-data-json/refs/heads/main/FullUnicodeRaw.json') //you can leave it empty, but loading is faster
    unicodeDB.findUDataFromChar("0")
    /* [object Object]:
        {
            code: "0030", name: "DIGIT ZERO",
            category: "Nd", class: "0",
            bidirectionalCategory: "EN",
            decimalValue: "0", digitValue: "0",
            numericValue: "0", mirrored: "N",
            char: "0", codeInt: 48,
            block: {
                name: "Basic Latin",
                range: "0000..007F"
            },
            age: "1.1",
            data: "0030\tDIGIT ZERO\n\t~ 0030 FE00 short diagonal stroke form",
            fonts: [
                {
                    relation: "double",
                    glyph: "𝟘",
                    glyphCodeInt: 120792,
                    glyphCode: "1d7d8"
                },{
                    relation: "typed",
                    glyph: "𝟶",
                    glyphCodeInt: 120822,
                    glyphCode: "1d7f6"
                },{
                    relation: "bold",
                    glyph: "𝟬",
                    glyphCodeInt: 120812,
                    glyphCode: "1d7ec"
                },{
                    relation: "serif",
                    glyph: "𝟎",
                    glyphCodeInt: 120782,
                    glyphCode: "1d7ce"
                },{
                    relation: "circle",
                    glyph: "⓪",
                    glyphCodeInt: 9450,
                    glyphCode: "24ea"
                }
            ]
        }
    */
```
### Methods:
```ts
unicodeDB.load(url_or_path_or_json: string): Promise<boolean?> // Loads the DB
unicodeDB.findUDataFromCode(code: number): Object? // Returns the unicode info from the character at the code
unicodeDB.findUDataFromChar(char: string): Object? // Returns the unicode info from the character
unicodeDB.getBlockFromCode(code: number): Object? // Returns the unicode block where the code is at
unicodeDB.getBlockFromChar(char: string): Object? // Returns the unicode block where the character is at
```

Credits:
- `0m141R1U1h161R1Y1a1d1J1S`: Basically the entire Code
- Unicode: UData[^1]
- Copilot: Annoying me
- Google: Made Chrome
- Microsoft: Made VSCode
- Github: yes
------
[^1]: All Rights Reserved to Unicode, I am not afiliated with Unicode
[^*]: Only programming languages that can load JSON files, so don't blame me when brainf**k and assembly don't load jsons
